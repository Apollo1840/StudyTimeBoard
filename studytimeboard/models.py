from studytimeboard import login_manager
from flask_login import UserMixin


@login_manager.user_loader
def load_user(user_id):
    print("load user {}".format(user_id))
    return User(username=user_id)


class User(UserMixin):
    id = ""
    username = ""

    def __init__(self, username):
        self.username = username
        self.id = username

    @staticmethod
    def query_via_username(username):
        raise NotImplemented

    def __repr__(self):
        return "User"
