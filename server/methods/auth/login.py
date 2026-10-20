from flask import request, make_response
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token, create_refresh_token

from models.citizen import Citizen
from utils.validators import normalize_phone_number


def login():
    """
    The phone number is normalised before lookup so the client can send
    "0712345678", "0712 345 678" or "+254712345678" — all resolve to the
    same row.

    Failure is a single generic 401 for both "unknown phone" and "wrong
    password" so an attacker can't enumerate registered phone numbers.
    """
    # Accept JSON as well as form data 
    data = request.get_json(silent=True) or request.form

    raw_phone = data.get("phone_number")
    password = data.get("password")

    if not raw_phone or not password:
        message = "phone_number and password are required."
        status_code = 400

        response = make_response(
            message,
            status_code
        )
        return response

    # Normalise: if the number can never be valid, treat as bad credentials
    try:
        phone_number = normalize_phone_number(raw_phone)
    except ValueError:
        message = "Invalid phone number or password."
        status_code = 401

        response = make_response(
            message,
            status_code
        )
        return response

    citizen = Citizen.query.filter(
        Citizen.phone_number == phone_number
    ).first()

    if citizen == None or not check_password_hash(citizen.password, password):
        message = "Invalid phone number or password."
        status_code = 401

        response = make_response(
            message,
            status_code
        )
        return response

    # `identity` must be a string for flask-jwt-extended
    identity = str(citizen.citizen_id)

    tokens = {
        "access_token": create_access_token(identity=identity),
        "refresh_token": create_refresh_token(identity=identity),
        "citizen": citizen.to_dict(),
    }

    status_code = 200

    response = make_response(
        tokens,
        status_code
    )
    return response