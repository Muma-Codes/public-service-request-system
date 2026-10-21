from flask import request, make_response
from flask_jwt_extended import jwt_required
from sqlalchemy.orm import joinedload, selectinload

from models.service_request import CitizenServiceRequest, REQUEST_STATUSES
from utils.auth import get_current_citizen

DEFAULT_PER_PAGE = 10
MAX_PER_PAGE = 50


@jwt_required()
def get_service_requests():
    """
    - A regular citizen sees only their own requests. An admin sees ALL requests.
    - Newest first, paginated.

    Query string (all optional, for everyone):
      page         1-based page number (default 1)
      per_page     page size (default 10, max 50)
      status       Pending | In Progress | Resolved
      category_id  only requests in this category

    Returns {"items": [...], "page", "per_page", "total", "pages"}.
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

    query = CitizenServiceRequest.query

    # Citizens only ever see their own requests
    if not current_citizen.is_admin:
        query = query.filter(
            CitizenServiceRequest.submitted_by == current_citizen.citizen_id
        )

    status_filter = request.args.get("status")

    if status_filter:
        if status_filter not in REQUEST_STATUSES:
            message = f"status must be one of: {', '.join(REQUEST_STATUSES)}."
            status_code = 400

            response = make_response(
                message,
                status_code
            )
            return response

        query = query.filter(CitizenServiceRequest.status == status_filter)

    category_filter = request.args.get("category_id", type=int)

    if category_filter is not None:
        query = query.filter(CitizenServiceRequest.category_id == category_filter)

    # Bad or out-of-range numbers fall back to sensible values instead of erroring
    page = max(request.args.get("page", 1, type=int) or 1, 1)
    per_page = request.args.get("per_page", DEFAULT_PER_PAGE, type=int) or DEFAULT_PER_PAGE
    per_page = min(max(per_page, 1), MAX_PER_PAGE)

    pagination = (
        query.options(
            # Load everything to_dict() touches in a few queries instead of one per row
            joinedload(CitizenServiceRequest.citizen),
            joinedload(CitizenServiceRequest.category),
            selectinload(CitizenServiceRequest.status_history),
        )
        .order_by(CitizenServiceRequest.service_request_id.desc())
        .paginate(page=page, per_page=per_page, error_out=False, max_per_page=MAX_PER_PAGE)
    )

    body = {
        "items": [sr.to_dict() for sr in pagination.items],
        "page": pagination.page,
        "per_page": pagination.per_page,
        "total": pagination.total,
        "pages": pagination.pages,
    }
    status_code = 200

    response = make_response(
        body,
        status_code
    )
    return response