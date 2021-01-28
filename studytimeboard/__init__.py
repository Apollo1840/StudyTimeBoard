from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager

app = Flask(__name__)
app.config['SECRET_KEY'] = 'newyear20210103helloworld'
# this is for data models to hash information in cookies

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
db = SQLAlchemy(app)
db.create_all()

login_manager = LoginManager(app)
login_manager.login_view = 'login'
login_manager.login_message_category = 'info'

from studytimeboard.routes import *
from studytimeboard.config import backup_googlesheet, with_examples

DataBaseAPI(backup_googlesheet=backup_googlesheet).init_db(db, with_examples=with_examples)
