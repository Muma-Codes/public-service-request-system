from flask import Flask
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from dotenv import load_dotenv
from datetime import timedelta

import os

from models import db
from models.citizen import Citizen
from models.service_request import CitizenServiceRequest
from models.service_category import ServiceCategory

# bring in all blueprints from the routes package
from routes import auth_bp, citizens_bp, categories_bp, service_requests_bp

load_dotenv() # reads variables from .env file and sets them in os.environ

# create a Flask application object
app = Flask(__name__)

# configure a database connection to the local file app
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("SQLALCHEMY_DATABASE_URI")

# disable modification tracking to use less memory
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# JWT configuration — required by @jwt_required / @admin_required
app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY")

# Access tokens are short-lived. Clients refresh using the refresh token.
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)

origins = [
    o.strip()
    for o in os.getenv("FRONTEND_URL", "").split(",")
    if o.strip()
]

CORS(app, origins=origins, methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"], allow_headers=["Content-Type", "Authorization"], supports_credentials=True)

# create a migrate object to manage schema modification
migrate = Migrate(app, db)

# initialize the Flask application to use the database
db.init_app(app)

# initialize JWT handling (used by utils/auth.py)
jwt = JWTManager(app)

# register blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(citizens_bp)
app.register_blueprint(categories_bp)
app.register_blueprint(service_requests_bp)

if __name__ == '__main__':
    app.run(port=5555, debug=True)