from flask import make_response
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
    create_access_token,
)

from models import db
from models.citizen import Citizen


@jwt_required(refresh=True)
def refresh():
    """
    Requires a valid *refresh* token in the Authorization header.
    Returns a fresh access token. Also re-checks that the citizen still
    exists — a deleted account can't refresh its way back in.
    """
    identity = get_jwt_identity()
    citizen = db.session.get(Citizen, int(identity))

    if citizen == None:
        message = "Invalid session. Please log in again."
        status_code = 401

        response = make_response(
            message,
            status_code
        )
        return response

    tokens = {
        "access_token": create_access_token(identity=identity),
        "citizen": citizen.to_dict(),
    }

    status_code = 200

    response = make_response(
        tokens,
        status_code
    )
    return response