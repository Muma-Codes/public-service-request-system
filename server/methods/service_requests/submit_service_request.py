from flask import request, make_response
from flask_jwt_extended import jwt_required

from models import db
from models.citizen import Citizen
from models.service_category import ServiceCategory
from models.service_request import CitizenServiceRequest
from utils.auth import get_current_citizen


@jwt_required()
def submit_service_request():
    """
    Creates a new service request owned by the logged-in citizen.
    """
    current_citizen = get_current_citizen()

    if current_citizen == None:
        message = "Invalid session. Please log in again."
        status_code = 401

        response = make_response(
            message,
            status_code
        )
        return response

    # Validate category
    category_id = request.form.get("category_id")

    if not category_id:
        message = "category_id is required."
        status_code = 400

        response = make_response(
            message,
            status_code
        )
        return response

    service_category = ServiceCategory.query.filter(
        ServiceCategory.service_category_id == category_id
    ).first()

    if service_category == None:
        message = "This service category does not exist in our database. Please try again."
        status_code = 404

        response = make_response(
            message,
            status_code
        )
        return response

    # Validate location
    location = request.form.get("location")

    if not isinstance(location, str) or not location.strip():
        message = "Location is required."
        status_code = 400

        response = make_response(
            message,
            status_code
        )
        return response

    # Validate description
    description = request.form.get("description")

    if not isinstance(description, str) or not description.strip():
        message = "Description is required."
        status_code = 400

        response = make_response(
            message,
            status_code
        )
        return response

    # Optional image_url
    # The frontend uploads to Cloudinary. We only persist the resulting URL.
    image_url = request.form.get("image_url")

    if image_url is not None and not image_url.strip():
        image_url = None  # treat blank string as "no image"

    # Build and persist
    new_request = CitizenServiceRequest(
        category_id=service_category.service_category_id,
        location=location.strip(),
        description=description.strip(),
        image_url=image_url,
        submitted_by=current_citizen.citizen_id,
        status="Pending",
    )

    db.session.add(new_request)
    db.session.commit()

    service_request_dict = new_request.to_dict()
    status_code = 201

    response = make_response(
        service_request_dict,
        status_code
    )
    return response