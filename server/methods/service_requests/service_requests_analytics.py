from flask import make_response
from flask_jwt_extended import jwt_required
from sqlalchemy import func

from models import db
from models.service_request import CitizenServiceRequest, REQUEST_STATUSES
from models.service_category import ServiceCategory
from utils.auth import get_current_citizen


@jwt_required()
def service_requests_analytics():
    """
    Returns a summary grouped by status and by category.
      - Admins see totals across the whole system.
      - Regular citizens see analytics for THEIR OWN requests only.
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

    base_query = db.session.query(CitizenServiceRequest)

    if not current_citizen.is_admin:
        base_query = base_query.filter(
            CitizenServiceRequest.submitted_by == current_citizen.citizen_id
        )

    total = base_query.count()

    # by_status
    # Pre-seed every allowed status with 0 so the response shape is stable
    by_status = {status: 0 for status in REQUEST_STATUSES}

    status_rows = (
        base_query.with_entities(
            CitizenServiceRequest.status,
            func.count(CitizenServiceRequest.service_request_id),
        )
        .group_by(CitizenServiceRequest.status)
        .all()
    )

    for status, count in status_rows:
        by_status[status] = count

    # by_category
    category_rows = (
        base_query.with_entities(
            CitizenServiceRequest.category_id,
            ServiceCategory.service_category_name,
            func.count(CitizenServiceRequest.service_request_id),
        )
        .join(
            ServiceCategory,
            ServiceCategory.service_category_id == CitizenServiceRequest.category_id,
        )
        .group_by(
            CitizenServiceRequest.category_id,
            ServiceCategory.service_category_name,
        )
        .all()
    )

    by_category = [
        {
            "category_id": category_id,
            "category_name": category_name,
            "count": count,
        }
        for category_id, category_name, count in category_rows
    ]

    analytics = {
        "scope": "system" if current_citizen.is_admin else "self",
        "total": total,
        "by_status": by_status,
        "by_category": by_category,
    }

    status_code = 200

    response = make_response(
        analytics,
        status_code
    )
    return response