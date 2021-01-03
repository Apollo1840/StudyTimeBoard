from flask import Flask, render_template, request
from flask_login import LoginManager

app = Flask(__name__)
app.config['SECRET_KEY'] = 'newyear20210103helloworld'
# this is for data models to hash information in cookies

login_manager = LoginManager(app)
login_manager.login_view = 'login'
login_manager.login_message_category = 'info'

from studytimeboard.routes import *
