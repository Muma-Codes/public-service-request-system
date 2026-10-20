from flask import Blueprint

from methods.service_requests import (
    get_service_request,
    get_service_requests,
    service_requests_analytics,
    submit_service_request,
    update_service_request,
    withdraw_service_request,
)

# Blueprint for all /service_requests endpoints
service_requests_bp = Blueprint(
    "service_requests", __name__, url_prefix="/service_requests"
)


@service_requests_bp.route("", methods=["GET"])
def get_service_requests_route():
    """GET /service_requests — list requests (own for citizens, all for admins)."""
    return get_service_requests()


@service_requests_bp.route("", methods=["POST"])
def submit_service_request_route():
    """POST /service_requests — submit a new request (any logged-in citizen)."""
    return submit_service_request()


@service_requests_bp.route("/analytics", methods=["GET"])
def service_requests_analytics_route():
    """GET /service_requests/analytics — counts by status and category (scoped by role)."""
    return service_requests_analytics()


@service_requests_bp.route("/<int:id>", methods=["GET"])
def get_service_request_route(id):
    """GET /service_requests/<id> — fetch one request (owner or admin)."""
    return get_service_request(id)


@service_requests_bp.route("/<int:id>", methods=["PATCH"])
def update_service_request_route(id):
    """PATCH /service_requests/<id> — edit request (owner while Pending or admin)."""
    return update_service_request(id)


@service_requests_bp.route("/<int:id>", methods=["DELETE"])
def withdraw_service_request_route(id):
    """DELETE /service_requests/<id> — withdraw a pending request (owner or admin)."""
    return withdraw_service_request(id)