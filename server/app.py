from flask import Flask
from flask_migrate import Migrate

from models import db

# create a Flask application object
app = Flask(__name__)

# configure a database connection to the local file app
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite"///publicservicerequestsystem.db'

# disable modification tracking to use less memory
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# create a migrate object to manage schema modification
migrate = Migrate(app, db)

# initialize the Flask application to use the database
db.init_app(app)

if __name__ == '__main__':
    app.run(port=5555, debug=True)


