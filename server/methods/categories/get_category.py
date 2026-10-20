from flask import make_response
from flask_jwt_extended import jwt_required

from models.service_category import ServiceCategory


@jwt_required()
def get_service_category(id):
    """
    Any logged-in citizen can view a category (they need it to submit a
    request against it).
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

    service_category_dict = service_category.to_dict()
    status_code = 200

    response = make_response(
        service_category_dict,
        status_code
    )
    return response