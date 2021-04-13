import logging
import time
import random

from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager

from studytimeboard.tools.logger import APPLogHandler

logger = logging.getLogger(__file__)
logger.setLevel(logging.DEBUG)
logger.filename = "stb_app_backend.log"
logger.addHandler(APPLogHandler(logger.filename))

app = Flask(__name__)
app.config['SECRET_KEY'] = 'newyear20210103helloworld'  # this is for data models to hash information in cookies
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'

db = SQLAlchemy(app)
# db.create_all()

login_manager = LoginManager(app)
login_manager.login_view = 'login'
login_manager.login_message_category = 'info'

from .utils.database import DataBaseAPI
from studytimeboard.config import (debug_mode,
                                   main_googlesheet_name,
                                   user_googlesheet_name,
                                   add_examples,
                                   add_users)
from studytimeboard.constant import (PATH_TO_DB_STATUS, INITIED, UNBORN)

dbapi = DataBaseAPI(db,
                    main_googlesheet_name=main_googlesheet_name,
                    user_googlesheet_name=user_googlesheet_name)

from studytimeboard.routes import *


def create_app():
    logger.info("************** app: heated ***************")

    db.create_all()

    logger.info("app: db ready")

    with open(PATH_TO_DB_STATUS, "w") as f:
        f.write(UNBORN)

    time.sleep(random.random() * 2)

    with open(PATH_TO_DB_STATUS, "r") as f:
        db_status = f.read()

    if db_status == UNBORN:
        with open(PATH_TO_DB_STATUS, "w") as f:
            f.write(INITIED)
        dbapi.init_db(add_examples=add_examples, add_users=add_users)
        print("successfully init db")

    return app
