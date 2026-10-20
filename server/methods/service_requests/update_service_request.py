from flask import request, make_response
from flask_jwt_extended import jwt_required

from models import db
from models.service_request import CitizenServiceRequest, REQUEST_STATUSES
from utils.auth import get_current_citizen

# Admins may change status. Owners may only correct the description/location/image.
ADMIN_ONLY_FIELDS = {"status"}
CITIZEN_FIELDS = {"location", "description", "image_url"}


@jwt_required()
def update_service_request(id):
    """
    - An admin can update `status` (must be one of REQUEST_STATUSES) and the
      descriptive fields.
    - The owner may only edit location / description / image_url while the
      request is still "Pending".
    - Once resolved or in progress, only admins can modify the request.
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

    service_request = CitizenServiceRequest.query.filter(
        CitizenServiceRequest.service_request_id == id
    ).first()

    if service_request == None:
        message = "This service request does not exist in our database. Please try again."
        status_code = 404

        response = make_response(
            message,
            status_code
        )
        return response

    is_owner = service_request.submitted_by == current_citizen.citizen_id

    if not is_owner and not current_citizen.is_admin:
        message = "You are not allowed to update this service request."
        status_code = 403

        response = make_response(
            message,
            status_code
        )
        return response

    # Non-admin owners cannot modify once processing has begun
    if not current_citizen.is_admin and service_request.status != "Pending":
        message = "Only pending service requests can be edited."
        status_code = 409

        response = make_response(
            message,
            status_code
        )
        return response

    # Determine which fields the caller is permitted to touch
    allowed_fields = CITIZEN_FIELDS if not current_citizen.is_admin else (CITIZEN_FIELDS | ADMIN_ONLY_FIELDS)

    if not allowed_fields.intersection(request.form):
        message = f"Provide at least one of: {', '.join(sorted(allowed_fields))}."
        status_code = 400

        response = make_response(
            message,
            status_code
        )
        return response

    # Non-admin trying to send an admin-only field is a clear error
    forbidden = ADMIN_ONLY_FIELDS.intersection(request.form)

    if forbidden and not current_citizen.is_admin:
        message = f"Only an admin can change: {', '.join(sorted(forbidden))}."
        status_code = 403

        response = make_response(
            message,
            status_code
        )
        return response

    # Validate everything first. Apply only if all checks pass
    changes = {}

    if "status" in request.form:
        new_status = request.form.get("status")

        if new_status not in REQUEST_STATUSES:
            message = f"status must be one of: {', '.join(REQUEST_STATUSES)}."
            status_code = 400

            response = make_response(
                message,
                status_code
            )
            return response

        changes["status"] = new_status
        # Stamp who made the change
        changes["status_updated_by"] = current_citizen.citizen_id

    if "location" in request.form:
        location = request.form.get("location")

        if not isinstance(location, str) or not location.strip():
            message = "location must be a non-empty string."
            status_code = 400

            response = make_response(
                message,
                status_code
            )
            return response

        changes["location"] = location.strip()

    if "description" in request.form:
        description = request.form.get("description")

        if not isinstance(description, str) or not description.strip():
            message = "description must be a non-empty string."
            status_code = 400

            response = make_response(
                message,
                status_code
            )
            return response

        changes["description"] = description.strip()

    if "image_url" in request.form:
        image_url = request.form.get("image_url")
        changes["image_url"] = image_url.strip() if image_url and image_url.strip() else None

    for attr, value in changes.items():
        setattr(service_request, attr, value)

    db.session.add(service_request)
    db.session.commit()

    service_request_dict = service_request.to_dict()
    status_code = 200

    response = make_response(
        service_request_dict,
        status_code
    )
    return response