from flask import Blueprint

from methods.auth import login, refresh, me

# blueprint for all /auth endpoints
auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

@auth_bp.route("/login", methods=["POST"])
def login_route():
    """POST /auth/login — exchange phone + password for tokens (public)."""
    return login()


@auth_bp.route("/refresh", methods=["POST"])
def refresh_route():
    """POST /auth/refresh — trade a refresh token for a new access token."""
    return refresh()


@auth_bp.route("/me", methods=["GET"])
def me_route():
    """GET /auth/me — return the current citizen (requires access token)."""
    return me()