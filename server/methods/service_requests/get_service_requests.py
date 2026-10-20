from flask import make_response
from flask_jwt_extended import jwt_required

from models.service_request import CitizenServiceRequest
from utils.auth import get_current_citizen


@jwt_required()
def get_service_requests():
    """
    - A regular citizen sees only their own requests.
    - An admin sees ALL requests
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

    query = CitizenServiceRequest.query

    if current_citizen.is_admin:
        # Admins filter using query-string params
        status_filter = request.args.get("status")
        category_filter = request.args.get("category_id")

        if status_filter:
            query = query.filter(CitizenServiceRequest.status == status_filter)

        if category_filter:
            query = query.filter(CitizenServiceRequest.category_id == category_filter)
    else:
        # Citizens only ever see their own requests
        query = query.filter(
            CitizenServiceRequest.submitted_by == current_citizen.citizen_id
        )

    service_requests = [sr.to_dict() for sr in query.all()]
    status_code = 200

    response = make_response(
        service_requests,
        status_code
    )
    return response