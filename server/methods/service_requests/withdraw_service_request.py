from flask import make_response
from flask_jwt_extended import jwt_required

from models import db
from models.service_request import CitizenServiceRequest
from utils.auth import get_current_citizen


@jwt_required()
def withdraw_service_request(id):
    """
    A citizen may withdraw (delete) ONLY their own request and ONLY while
    its status is "Pending".  Admins may also withdraw pending requests on a
    citizen's behalf — but we prevent admins from deleting processing/resolved
    ones so audit history isn't lost.
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

    if service_request.submitted_by != current_citizen.citizen_id and not current_citizen.is_admin:
        message = "You are not allowed to withdraw this service request."
        status_code = 403

        response = make_response(
            message,
            status_code
        )
        return response

    if service_request.status != "Pending":
        message = "Only pending service requests can be withdrawn."
        status_code = 409

        response = make_response(
            message,
            status_code
        )
        return response

    db.session.delete(service_request)
    db.session.commit()

    message = "Service request withdrawn successfully."
    status_code = 200

    response = make_response(
        message,
        status_code
    )
    return response