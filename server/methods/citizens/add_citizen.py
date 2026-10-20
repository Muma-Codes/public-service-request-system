from flask import request, make_response
from sqlalchemy.exc import IntegrityError
from werkzeug.security import generate_password_hash

from models import db
from models.citizen import Citizen
from utils.validators import clean_name, normalize_phone_number, validate_password


def add_citizen():
    # Validate and normalise every field before touching the database
    try:
        name = clean_name(request.form.get("name"))
        phone_number = normalize_phone_number(request.form.get("phone_number"))
        password = validate_password(request.form.get("password"))
    except ValueError as err:
        message = str(err)
        status_code = 400

        response = make_response(
            message,
            status_code
        )

        return response

    # Phone numbers are unique (checked on the normalised +254 form)
    if Citizen.query.filter(Citizen.phone_number==phone_number).first():
        message = f'Phone number "{phone_number}" is already registered!'
        status_code = 409

        response = make_response(
            message,
            status_code
        )

        return response

    # Everyone who registers is a normal citizen; admins are promoted later by an admin/sql command
    new_citizen = Citizen(
        name = name,
        phone_number = phone_number,
        password = generate_password_hash(password),  # store hashed passwords
        is_admin = False,
    )

    try:
        db.session.add(new_citizen)
        db.session.commit()
    except IntegrityError:
        # Safety net for two simultaneous requests with the same number
        db.session.rollback()
        message = f'Phone number "{phone_number}" is already registered!'
        status_code = 409

        response = make_response(
            message,
            status_code
        )

        return response

    citizen_dict = new_citizen.to_dict()
    status_code = 201

    response = make_response(
        citizen_dict,
        status_code
    )

    return response