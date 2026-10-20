from flask import request, make_response
from flask_jwt_extended import jwt_required
from sqlalchemy.exc import IntegrityError
from werkzeug.security import generate_password_hash, check_password_hash

from models import db
from models.citizen import Citizen
from utils.auth import check_citizen_access
from utils.validators import clean_name, normalize_phone_number, validate_password, parse_bool

# Only these fields can be changed, so id/timestamps can never be mass-assigned
UPDATABLE_FIELDS = {"name", "phone_number", "password", "is_admin"}


@jwt_required()
def update_citizen(id):
    # A citizen can only update themselves
    # an admin can update anyone
    current_citizen, message, status_code = check_citizen_access(id)

    if message:
        response = make_response(
            message,
            status_code
        )

        return response

    citizen = Citizen.query.filter(Citizen.citizen_id==id).first()

    if citizen == None:
        message = "This citizen does not exist in our database. Please try again."
        status_code = 404

        response = make_response(
            message,
            status_code
        )
        return response

    if not UPDATABLE_FIELDS.intersection(request.form):
        message = f"Provide at least one of: {', '.join(sorted(UPDATABLE_FIELDS))}."
        status_code = 400

        response = make_response(
            message,
            status_code
        )
        return response

    # Validate every field first and apply the changes only if ALL of them are valid
    changes = {}
    try:
        if "name" in request.form:
            changes["name"] = clean_name(request.form.get("name"))

        if "phone_number" in request.form:
            phone_number = normalize_phone_number(request.form.get("phone_number"))

            taken = Citizen.query.filter(
                Citizen.phone_number==phone_number, Citizen.citizen_id!=id
            ).first()

            if taken:
                message = f'Phone number "{phone_number}" is already registered!'
                status_code = 409

                response = make_response(
                    message,
                    status_code
                )
                return response

            changes["phone_number"] = phone_number

        if "password" in request.form:
            # Changing your OWN password requires your current one
            if current_citizen.citizen_id == id and not check_password_hash(
                citizen.password, request.form.get("current_password", "")
            ):
                message = "current_password is missing or incorrect."
                status_code = 403

                response = make_response(
                    message,
                    status_code
                )
                return response

            changes["password"] = generate_password_hash(validate_password(request.form.get("password")))

        if "is_admin" in request.form:
            # Only admins can promote/demote and nobody can demote themselves
            if not current_citizen.is_admin:
                message = "Only an admin can change admin status."
                status_code = 403

                response = make_response(
                    message,
                    status_code
                )
                return response

            is_admin = parse_bool(request.form.get("is_admin"))

            if current_citizen.citizen_id == id and not is_admin:
                message = "You cannot remove your own admin status."
                status_code = 409

                response = make_response(
                    message,
                    status_code
                )
                return response

            changes["is_admin"] = is_admin

    except ValueError as err:
        message = str(err)
        status_code = 400

        response = make_response(
            message,
            status_code
        )
        return response

    for attr, value in changes.items():
        setattr(citizen, attr, value)

    try:
        db.session.add(citizen)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        message = "Phone number is already registered!"
        status_code = 409

        response = make_response(
            message,
            status_code
        )
        return response

    citizen_dict = citizen.to_dict()
    status_code = 200

    response = make_response(
        citizen_dict,
        status_code
    )
    return response