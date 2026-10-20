from flask import make_response
from flask_jwt_extended import jwt_required

from models.service_category import ServiceCategory


@jwt_required()
def get_service_categories():
    """
    Any logged-in citizen can list all categories. Citizens need this to pick
    a category when submitting a service request, admins need it to manage.
    """
    service_categories = [
        service_category.to_dict()
        for service_category in ServiceCategory.query.all()
    ]

    status_code = 200

    response = make_response(
        service_categories,
        status_code
    )
    return response