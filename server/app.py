from flask import Flask
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from datetime import timedelta

from models import db
from models.citizen import Citizen
from models.service_request import CitizenServiceRequest
from models.service_category import ServiceCategory

# bring in all blueprints from the routes package
from routes import auth_bp, citizens_bp, categories_bp, service_requests_bp

# create a Flask application object
app = Flask(__name__)

# configure a database connection to the local file app
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///publicservicerequestsystem.db'

# disable modification tracking to use less memory
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# JWT configuration — required by @jwt_required / @admin_required
app.config['JWT_SECRET_KEY'] = 'change-me-in-production'

# Access tokens are short-lived. Clients refresh using the refresh token.
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)


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