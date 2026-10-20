from flask import make_response
from flask_jwt_extended import jwt_required

from models.service_request import CitizenServiceRequest
from utils.auth import get_current_citizen


@jwt_required()
def get_service_request(id):
    """
    A citizen may view only their own request. An admin may view any request.
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

    # Ownership check: owners and admins only
    if service_request.submitted_by != current_citizen.citizen_id and not current_citizen.is_admin:
        message = "You are not allowed to access this service request."
        status_code = 403

        response = make_response(
            message,
            status_code
        )
        return response

    service_request_dict = service_request.to_dict()
    status_code = 200

    response = make_response(
        service_request_dict,
        status_code
    )
    return response