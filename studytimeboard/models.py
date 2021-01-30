from datetime import datetime, timedelta
from flask_login import UserMixin

from .tools.data_tools import *
from studytimeboard import db, login_manager


@login_manager.user_loader
def load_user(user_id):
    try:
        user = UserDB.query.get(int(user_id))
    except:
        user = None
    return user


class StudyEvent:

    def __init__(self, start_time: str = None, end_time: str = None, name=None, date=None):
        self.start_time = start_time
        self.end_time = end_time
        self.name = name
        self.date = date

    @property
    def default_end_time(self):
        return datetime2time(time2datetime(self.start_time) + timedelta(minutes=30))

    @property
    def default_start_time(self):
        return datetime2time(time2datetime(self.end_time) - timedelta(minutes=30))


class StudyEventDB(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    start_time = db.Column(db.String(20), nullable=False)
    end_time = db.Column(db.String(20), nullable=False)

    def __repr__(self):
        return f"'{self.username}', study from '{self.start_time}' to '{self.end_time}')"


class UserDB(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)

    def __repr__(self):
        return f"User('{self.username}')"
