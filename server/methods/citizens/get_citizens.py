from flask import make_response

from models.citizen import Citizen
from utils.auth import admin_required


@admin_required
def get_citizens():
    citizens = []
    for citizen in Citizen.query.all():
        citizen_dict = citizen.to_dict()
        citizens.append(citizen_dict)

    status_code = 200
    response = make_response(
        citizens,
        status_code
    )

    return response