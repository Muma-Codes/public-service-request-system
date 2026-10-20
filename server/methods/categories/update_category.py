from flask import request, make_response
from sqlalchemy.exc import IntegrityError

from models import db
from models.service_category import ServiceCategory
from utils.auth import admin_required, get_current_citizen
from utils.validators import clean_category_name

# Only the name is editable — added_by, added_at are immutable provenance
UPDATABLE_FIELDS = {"service_category_name"}


@admin_required
def update_service_category(id):
    """
    Admin-only. The only mutable field is `service_category_name`.
    """
    current_citizen = get_current_citizen()

    service_category = ServiceCategory.query.filter(
        ServiceCategory.service_category_id == id
    ).first()

    if service_category == None:
        message = "This service category does not exist in our database. Please try again."
        status_code = 404

        response = make_response(
            message,
            status_code
        )
        return response

    # Require at least one editable field
    if not UPDATABLE_FIELDS.intersection(request.form):
        message = f"Provide at least one of: {', '.join(sorted(UPDATABLE_FIELDS))}."
        status_code = 400

        response = make_response(
            message,
            status_code
        )
        return response

    # Validate
    try:
        new_name = clean_category_name(request.form.get("service_category_name"))
    except ValueError as err:
        message = str(err)
        status_code = 400

        response = make_response(
            message,
            status_code
        )
        return response

    # Reject duplicates, excluding this row
    taken = ServiceCategory.query.filter(
        ServiceCategory.service_category_name == new_name,
        ServiceCategory.service_category_id != id,
    ).first()

    if taken != None:
        message = f'Category "{new_name}" already exists!'
        status_code = 409

        response = make_response(
            message,
            status_code
        )
        return response

    # Apply
    service_category.service_category_name = new_name
    service_category.updated_by = current_citizen.citizen_id

    db.session.add(service_category)

    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        message = f'Category "{new_name}" already exists!'
        status_code = 409

        response = make_response(
            message,
            status_code
        )
        return response

    service_category_dict = service_category.to_dict()
    status_code = 200

    response = make_response(
        service_category_dict,
        status_code
    )
    return response