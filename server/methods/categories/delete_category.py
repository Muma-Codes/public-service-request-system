from flask import make_response
from sqlalchemy.exc import IntegrityError

from models import db
from models.service_category import ServiceCategory
from models.service_request import CitizenServiceRequest
from utils.auth import admin_required


@admin_required
def delete_service_category(id):
    """
    Admin-only. Refuses to delete a category that still has service requests
    pointing at it — deleting would orphan those requests and break the
    citizen's view of their own submissions. Admin must reassign/withdraw
    the requests first (or the FK constraint would fail anyway).
    """
    service_category = ServiceCategory.query.filter(
        ServiceCategory.service_category_id == id
    ).first()

    if service_category == None:
        message = "This service category does not exist in our database. Please try again."
        status_code = 404

        response = make_response(
            message,
            status_code
        )
        return response

    # Refuse if the category is in use
    request_count = CitizenServiceRequest.query.filter(
        CitizenServiceRequest.category_id == id
    ).count()

    if request_count > 0:
        message = (
            f'Cannot delete "{service_category.service_category_name}": '
            f'{request_count} service request(s) reference it.'
        )
        status_code = 409

        response = make_response(
            message,
            status_code
        )
        return response

    # Delete
    db.session.delete(service_category)

    try:
        db.session.commit()
    except IntegrityError:
        # Belt-and-suspenders: someone inserted a request between our check
        # and our commit — FK constraint caught it.
        db.session.rollback()
        message = "Cannot delete this category: it is still referenced by service requests."
        status_code = 409

        response = make_response(
            message,
            status_code
        )
        return response

    message = "Service category deleted successfully."
    status_code = 200

    response = make_response(
        message,
        status_code
    )
    return response