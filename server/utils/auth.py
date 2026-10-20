from functools import wraps
from flask import make_response
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from models import db
from models.citizen import Citizen


def get_current_citizen():
    """Return the Citizen that owns the JWT in this request (None if the account was deleted)."""
    identity = get_jwt_identity()
    return db.session.get(Citizen, int(identity)) if identity is not None else None


def admin_required(fn):
    """Route guard: a valid access token is required AND the citizen must be an admin."""
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        current_citizen = get_current_citizen()

        if current_citizen == None:
            message = "Invalid session. Please log in again."
            status_code = 401
            response = make_response(message, status_code)
            return response

        if not current_citizen.is_admin:
            message = "Admin privileges are required for this action."
            status_code = 403
            response = make_response(message, status_code)
            return response

        return fn(*args, **kwargs)
    return wrapper


def check_citizen_access(citizen_id):
    """
    Shared rule for get/update/delete of ONE citizen: a citizen may act on their own
    record, an admin on anyone's.
    Returns (current_citizen, message, status_code). Message is None when access is allowed.
    """
    current_citizen = get_current_citizen()

    if current_citizen == None:
        return None, "Invalid session. Please log in again.", 401

    if current_citizen.citizen_id != citizen_id and not current_citizen.is_admin:
        return None, "You are not allowed to access this citizen.", 403

    return current_citizen, None, None