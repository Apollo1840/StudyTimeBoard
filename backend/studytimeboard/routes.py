"""
    
    UseCase design & Display information generation through app_utils.py ( info_...() )
    
    JSON API Style: JSend https://github.com/omniti-labs/jsend
    example 1:
    {
        status : "success",
        data : { "post" : { "id" : 2, "title" : "Another blog post", "body" : "More content" }， “tail”： “1234”}
    }
    example 2:
    {
        "status" : "error",
        "message" : "Unable to communicate with database"
    }
    
"""

# external utils
import json
import numpy as np

from flask import Flask, request
from flask_login import login_user, logout_user

from functools import wraps

# internal utils
from . import app, dbapi, logger
from .constant import *
from .app_utils import *

# database proxies
from .utils.mongodb_client import users_collection
# utils for hasing password and jwt encode/decode
from .utils.bcrypt_utils import hash_password, validate_password
from .utils.jwt_utils import jwt_encode, jwt_decode_identity, jwt_verify

def login_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            jwt_encoded = request.headers.get('jwt')
            if jwt_verify(jwt_encoded):
                return fn(*args, **kwargs)
            else:
                return {"status": "error", "message": FlashMessages.UNAUTHENTICATED}, 403

        return decorator
    return wrapper

@app.route("/api/go", methods=["POST"])
def api_handle_go_event():
    data = json.loads(request.data)
    username = data[USERNAME]
    if username in dbapi.all_users():
        date = datetime.now(TZ)
        start_time = datetime2time(datetime.now(TZ))
        dbapi.into_go(username, date, start_time)
        return {"status": "success"}, 200
    else:
        return {"status": "error", "message": FlashMessages.NO_SUCH_USER}, 400
    

@app.route("/api/hold", methods=["POST"])
def api_handle_hold_event():
    data = json.loads(request.data)
    username = data[USERNAME]
    if username in dbapi.all_users():
        date = datetime.now(TZ)
        end_time = datetime2time(datetime.now(TZ))
        dbapi.into_hold(username, date, end_time)
        return {"status": "success"}, 200
    else:
        return {"status": "error", "message": FlashMessages.NO_SUCH_USER}, 400
    
@app.route("/api/interval", methods=["POST"])
def api_handle_interval_event():
    data = json.loads(request.data)
    username = data[USERNAME]
    if username in dbapi.all_users():
        date = datetime.now(TZ)
        start_time = data[START_TIME]
        end_time = data[END_TIME]
        if varify_time(start_time) and varify_time(end_time):
            dbapi.into_interval(username, date, start_time, end_time)
        else:
            return {"status": "error", "message": FlashMessages.WRONG_DURATION}, 400
        return {"status": "success"}, 200
    else:
        return {"status": "error", "message": FlashMessages.NO_SUCH_USER}, 400

@app.route("/api/studying_users", methods=["GET"])
def api_studying_users():
    df_all = get_df_ana(dbapi)
    studying_users = info_studying_users(df_all)
    return {"status": "success", "data": studying_users}, 200



@app.route("/api/studying_king", methods=["GET"])
def api_studying_king():
    
    df_all = get_df_ana(dbapi)
    df_last_week = to_this_week_table(df_all)
    df_today = df_last_week.loc[df_last_week[TODAY_OR_NOT] == IS_TODAY, :]
    # todo: query todays data directly from dbapi
    
    if len(df_today) > 0:
        df_minutes = to_minutes_leaderboard(df_today)
        name_winner = list(df_minutes[NAME])[0]
        duration_str = min2duration_str(df_minutes.loc[df_minutes[NAME]==name_winner, MINUTES])
        
        df_user_today = df_today.loc[df_today[NAME] == name_winner, :]
        timeline = [(row[START_TIME], row[END_TIME]) for _,row in df_user_today.iterrows() if row[END_TIME]!=UNKNOWN]
    else:
        name_winner = "nobody"
        duration_str = "0 seconds"
        
        timeline = []
    return {"status": "success", "data": {
        "winner": name_winner,
        "winnerMinutes": duration_str,
        "timeline": timeline}
    }, 200


@app.route("/api/minutes_lastweek", methods=["POST"])
def api_minutes_lastweek():
    
    # parse request
    group_type = json.loads(request.data)[GROUPATTR]  # WEEKDAY or CURRENT
    
    # get result
    df_all = get_df_ana(dbapi)
    df_last_week = to_this_week_table(df_all)  # filter only the data for last week
    result = info_duration(df_last_week, by=group_type)  # list of entries -> data grouped by weekdays
    result_json = result.unstack(level=0).to_json()  # to proper json format
    return {"status": "success", "data": json.loads(result_json)}, 200


@app.route("/api/minutes_total", methods=["GET"])
def api_minutes_total():
    df_all = get_df_ana(dbapi)
    result_json = info_duration(df_all, by=NAME).to_json()
    return {"status": "success", "data": json.loads(result_json)}, 200

@app.route("/api/personal_n_stars", methods=["GET"])
@login_required()
def api_personal_n_stars():
    # TODO: Authentication with JWT
    df_all = get_df_ana(dbapi)
    authHeader = request.headers.get('jwt')
    # TODO: decode user id from jwt token, for this we need user model with id, a DB to store user data
    # and JWT, there is still a long way to go...
    username = authHeader

    # Check if name is found
    if username in df_all[NAME].unique():
        n_stars = dbapi.out_user_n_stars(username)
        return {"status": "success", "data": {N_STARS: n_stars}}, 200  # TODO: use JWT token
    else:
        # error user not found?
        return {"status": "error", "message": FlashMessages.NO_SUCH_USER}, 401

@app.route("/api/personal_duration_avg", methods=["GET"])
@login_required()
def api_personal_duration_avg():
    df_all = get_df_ana(dbapi)
    jwt_encoded = request.headers.get('jwt')
    username, userid = jwt_decode_identity(jwt_encoded)

    # Check if name is found
    if username in df_all[NAME].unique():
        # TODO: move this to app_utils
        df_user = df_all.loc[df_all[NAME] == username]
        df_user = df_user.loc[df_user[MINUTES].notnull()]
        df_durations = to_minutes_by_day_table(df_user)[[DATE, MINUTES]]
        minutes_avg = np.mean(df_durations[MINUTES])
        # TODO: use JWT token
        return {"status": "success", "data": {AVG_HOURS: min2duration_str(minutes_avg)}}, 200
    else:
        # error user not found?
        return {"status": "error", "message": FlashMessages.NO_SUCH_USER}, 401

  
# replace minutes with durations
@app.route("/api/personal_durations", methods=["GET"])
@login_required()
def api_personal_durations():
    df_all = get_df_ana(dbapi)
    jwt_encoded = request.headers.get('jwt')
    username, userid = jwt_decode_identity(jwt_encoded)

    # Check if name is found
    if username in df_all[NAME].unique():
        # TODO: move this to app_utils
        df_user = df_all.loc[df_all[NAME] == username]
        df_user = df_user.loc[df_user[MINUTES].notnull()]
        df_durations = to_minutes_by_day_table(df_user)[[DATE, MINUTES]]
        
        result_json = df_durations.to_json(orient="records")
        # TODO: use JWT token
        return {"status": "success", "data": json.loads(result_json)}, 200
    else:
        # error user not found?
        return {"status": "error", "message": FlashMessages.NO_SUCH_USER}, 401



@app.route("/api/personal_durations_averages", methods=["GET"])
@login_required()
def api_personal_durations_averages():
    df_all = get_df_ana(dbapi)
    jwt_encoded = request.headers.get('jwt')
    username, userid = jwt_decode_identity(jwt_encoded)

    # Check if name is found
    if username in df_all[NAME].unique():
        # TODO: move this to app_utils
        df_user = df_all.loc[df_all[NAME] == username]
        df_user = df_user.loc[df_user[MINUTES].notnull()]
        df_durations = to_minutes_by_day_table(df_user)[[DATE, MINUTES]]
    
        df_durations[HOURS] = df_durations[MINUTES] / 60
        df_durations[HOURS_AVG] = along_average(df_durations[HOURS])
        df_durations[HOURS_AVG_EXP] = exponential_moving_average(list(df_durations[HOURS]), 0.1)
        
        result_json = df_durations.to_json(orient="records")
    
        # TODO: use JWT token
        return {"status": "success", "data": json.loads(result_json)}, 200
    else:
        # error user not found?
        return {"status": "error", "message": FlashMessages.NO_SUCH_USER}, 401


@app.route("/api/personal_intervals", methods=["GET"])
@login_required()
def api_personal_intervals():
    df_all = get_df_ana(dbapi)
    jwt_encoded = request.headers.get('jwt')
    username, userid = jwt_decode_identity(jwt_encoded)

    # Check if name is found
    if username in df_all[NAME].unique():
        # TODO: move this to app_utils
        df_user = df_all.loc[df_all[NAME] == username]
        df_user = df_user.loc[df_user[END_TIME] != UNKNOWN]
        df_intervals = df_user[[DATE, START_TIME, END_TIME]]
        
        result_json = df_intervals.to_json(orient="records")
        return {"status": "success", "data": json.loads(result_json)}, 200  # TODO: use JWT token
    else:
        # error user not found?
        return {"status": "error", "message": FlashMessages.NO_SUCH_USER}, 401

@app.route("/api/personal_intervals_per_week", methods=["GET"])
@login_required()
def api_personal_intervals_per_week():
    df_all = get_df_ana(dbapi)
    jwt_encoded = request.headers.get('jwt')
    username, userid = jwt_decode_identity(jwt_encoded)

    # Check if name is found
    if username in df_all[NAME].unique():
        # TODO: move this to app_utils
        df_user = df_all.loc[df_all[NAME] == username]
        df_user = df_user.loc[df_user[END_TIME] != UNKNOWN]
        df_intervals_by_week = df_user[[ID_WEEK, START_TIME, END_TIME, YEAR]]
        
        result_json = df_intervals_by_week.to_json(orient="records")
        # TODO: use JWT token
        return {"status": "success", "data": json.loads(result_json)}, 200
    else:
        # error user not found?
        return {"status": "error", "message": FlashMessages.NO_SUCH_USER}, 401


# Minispec for authentication response:
#   on success: response should contain token: String
#   on failure: response should contain error: String

@app.route('/api/login', methods=['POST'])
def api_login():
    # body contains only username and password, chose http body over authentication to minimize the code for httpservice
    username = request.json.get('username')
    password = request.json.get("password")
    if(username is None or password is None):
        return {"status": "error", "message": FlashMessages.BAD_AUTH_REQUEST}, 400

    user = users_collection.find_one({"name": username})
    # fail case 1: no such user, status 401
    if user is None:
        return {"status": "error", "message": FlashMessages.NO_SUCH_USER}, 401
    # fail case 2: invalid/wrong password, status 401
    if not validate_password(password, user["password"]):
        return {"status": "error", "message": FlashMessages.PASSWD_INCORRECT}, 401
    # success, status 200
    # Generate new token as certificate of valid login
    token = jwt_encode(user["_id"], username)
    return {"status": "success", "data": {"token": token}}, 200

@app.route('/api/registration', methods=['POST'])
def api_register():
    username = request.json.get('username')
    password = request.json.get("password")

    if users_collection.find_one({"name":username}):
        return {"status": "error", "message": FlashMessages.REGISTERED_USER}, 409

    if users_collection.estimated_document_count() >= user_amount_limit:
        return {"status": "error", "message": FlashMessages.TOO_MUCH_USERS}, 400 

    # Create json document for new user
    new_user = {"name": username, "password": hash_password(password)}
    # Insert document into database
    new_id = users_collection.insert_one(new_user)
    # Generate new token as certificate of valid login
    token = jwt_encode(new_id, username)

    return {"status": "success", "data": {"token": token}}, 200

@app.route('/api/logout', methods=['POST'])
def api_logout():
    logout_user()
    return {"status": "success", "data": {"token": None}}, 200


# admin APIs
@app.route('/admin_log')
def admin_log():
    with open(logger.filename, "r") as f:
        infos = f.readlines()
    for info in infos:
        print(info)
    return {"status": "success"}, 200

@app.route('/admin_reload_data', methods=['GET'])
def admin_reload_data():
    msg = "ADMIN: admin_reload_data"
    print(msg)
    logger.info(msg)
    dbapi.init_db()
    return {"status": "success"}, 200

@app.route('/admin_clean_data')
def admin_clean_data():
    dbapi.init_empty()
    return {"status": "success"}, 200
  
@app.route('/admin_create_some_data')
def admin_create_some_data():
    dbapi.into_some_examples()
    return {"status": "success"}, 200

@app.route('/admin_create_some_users')
def admin_create_some_user():
    dbapi.into_some_users()
    return {"status": "success"}, 200

@app.route('/admin_star', methods=['GET', 'POST'])
def admin_star():
    if USERNAME in request.args:
        username = request.args[USERNAME]
        dbapi.into_user_onestar(username)
    return {"status": "success"}, 200

@app.route('/api/admin/clean_chart_folder', methods=['GET'])
def api_admin_clean_chart_folder():
    clean_chart_folder()
    return {"status": "success"}, 200
