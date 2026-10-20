from flask import make_response
from flask_jwt_extended import jwt_required

from utils.auth import get_current_citizen


@jwt_required()
def me():
    """
    Returns the currently-authenticated citizen. The frontend calls this on
    page load to know who's logged in without re-parsing the JWT payload.
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

    citizen_dict = current_citizen.to_dict()
    status_code = 200

    response = make_response(
        citizen_dict,
        status_code
    )
    return response