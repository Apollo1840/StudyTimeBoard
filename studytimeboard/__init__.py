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

from studytimeboard.utils.database import DataBaseAPI
from studytimeboard.config import (debug_mode, main_googlesheet_name, user_googlesheet_name,
                                   add_examples, add_users)

dbapi = DataBaseAPI(db,
                    main_googlesheet_name=main_googlesheet_name,
                    user_googlesheet_name=user_googlesheet_name)
dbapi.init_db(add_examples=add_examples, add_users=add_users)

print("successfully init db")

from studytimeboard.routes import *
