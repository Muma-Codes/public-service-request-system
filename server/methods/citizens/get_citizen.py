from flask import make_response
from flask_jwt_extended import jwt_required

from models.citizen import Citizen
from utils.auth import check_citizen_access


@jwt_required()
def get_citizen(id):
    # A citizen can only view themselves
    # an admin can view anyone
    current_citizen, message, status_code = check_citizen_access(id)

    if message:
        response = make_response(
            message,
            status_code
        )

        return response

    citizen = Citizen.query.filter(Citizen.citizen_id==id).first()

    if citizen:

        citizen_dict = citizen.to_dict()
        status_code = 200
        response = make_response(
            citizen_dict,
            status_code
        )

        return response

    message = "This citizen does not exist in our database. Please try again."
    status_code = 404

    response = make_response(
        message,
        status_code
    )
    return response