from flask import Blueprint

from methods.citizens import (
    add_citizen,
    delete_citizen,
    get_citizen,
    get_citizens,
    update_citizen,
)

# Blueprint for all /citizens endpoints
citizens_bp = Blueprint("citizens", __name__, url_prefix="/citizens")


@citizens_bp.route("", methods=["GET"])
def get_citizens_route():
    """GET /citizens — list all citizens (admin only. Guarded inside method)."""
    return get_citizens()


@citizens_bp.route("", methods=["POST"])
def add_citizen_route():
    """POST /citizens — register a new citizen (public, no auth)."""
    return add_citizen()


@citizens_bp.route("/<int:id>", methods=["GET"])
def get_citizen_route(id):
    """GET /citizens/<id> — fetch one citizen (self or admin. Guarded inside method)."""
    return get_citizen(id)


@citizens_bp.route("/<int:id>", methods=["PATCH"])
def update_citizen_route(id):
    """PATCH /citizens/<id> — edit citizen (self or admin. Guarded inside method)."""
    return update_citizen(id)


@citizens_bp.route("/<int:id>", methods=["DELETE"])
def delete_citizen_route(id):
    """DELETE /citizens/<id> — remove citizen (self or admin; guarded inside method)."""
    return delete_citizen(id)