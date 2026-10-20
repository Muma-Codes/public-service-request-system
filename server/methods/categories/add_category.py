from flask import request, make_response
from sqlalchemy.exc import IntegrityError

from models import db
from models.service_category import ServiceCategory
from utils.auth import admin_required, get_current_citizen
from utils.validators import clean_category_name


@admin_required
def add_service_category():
    """
    Admin-only. Name is trimmed, must be non-empty and unique.
    """
    # admin_required has already verified the token and admin role
    current_citizen = get_current_citizen()

    # Validate name
    try:
        name = clean_category_name(request.form.get("service_category_name"))
    except ValueError as err:
        message = str(err)
        status_code = 400

        response = make_response(
            message,
            status_code
        )
        return response

    # Reject duplicates early (friendly 409)
    existing = ServiceCategory.query.filter(
        ServiceCategory.service_category_name == name
    ).first()

    if existing != None:
        message = f'Category "{name}" already exists!'
        status_code = 409

        response = make_response(
            message,
            status_code
        )
        return response

    # Persist
    new_category = ServiceCategory(
        service_category_name=name,
        added_by=current_citizen.citizen_id,
    )

    db.session.add(new_category)

    try:
        db.session.commit()
    except IntegrityError:
        # Race condition: another admin inserted the same name between our
        # check and our commit -the DB UniqueConstraint caught it.
        db.session.rollback()
        message = f'Category "{name}" already exists!'
        status_code = 409

        response = make_response(
            message,
            status_code
        )
        return response

    service_category_dict = new_category.to_dict()
    status_code = 201

    response = make_response(
        service_category_dict,
        status_code
    )
    return response