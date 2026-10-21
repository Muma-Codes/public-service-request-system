from flask import Blueprint

from methods.categories import (
    add_service_category,
    delete_service_category,
    get_service_categories,
    get_service_category,
    update_service_category,
)

# Blueprint for all /categories endpoints
categories_bp = Blueprint("categories", __name__, url_prefix="/categories")


@categories_bp.route("", methods=["GET"])
def get_categories_route():
    """GET /categories — list every service category (any logged-in citizen)."""
    return get_service_categories()


@categories_bp.route("", methods=["POST"])
def add_category_route():
    """POST /categories — create a new category (admin only)."""
    return add_service_category()


@categories_bp.route("/<int:id>", methods=["GET"])
def get_category_route(id):
    """GET /categories/<id> — fetch a single category."""
    return get_service_category(id)


@categories_bp.route("/<int:id>", methods=["PATCH"])
def update_category_route(id):
    """PATCH /categories/<id> — rename a category (admin only)."""
    return update_service_category(id)


@categories_bp.route("/<int:id>", methods=["DELETE"])
def delete_category_route(id):
    """DELETE /categories/<id> — remove a category (admin only)."""
    return delete_service_category(id)