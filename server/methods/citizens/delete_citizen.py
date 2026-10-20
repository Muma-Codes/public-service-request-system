from flask import make_response
from flask_jwt_extended import jwt_required

from models import db
from models.citizen import Citizen
from utils.auth import check_citizen_access


@jwt_required()
def delete_citizen(id):
    # A citizen can only delete themselves. An admin can delete anyone
    current_citizen, message, status_code = check_citizen_access(id)

    if message:
        response = make_response(
            message,
            status_code
        )

        return response

    citizen = Citizen.query.filter(Citizen.citizen_id==id).first()

    if citizen == None:
        message = "This citizen does not exist in our database. Please try again."
        status_code = 404

        response = make_response(
            message,
            status_code
        )

        return response

    # Never leave the system without an admin
    if citizen.is_admin and Citizen.query.filter(Citizen.is_admin==True).count() <= 1:
        message = "The last remaining admin cannot be deleted."
        status_code = 409

        response = make_response(
            message,
            status_code
        )

        return response

    # The citizen's own service requests are removed with them (cascade on the model)
    db.session.delete(citizen)
    db.session.commit()

    message = "Citizen deleted successfully."
    status_code = 200
    response = make_response(
        message,
        status_code
    )

    return response