import bcrypt
import jwt
import datetime
from dotenv import load_dotenv
import os

# create hashed password
def hash_password(password):
    passwdBytes = bytes(password, encoding='utf-8')  # Unicode-objects must be encoded before hasing
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(passwdBytes, salt)

# validate password with hashed password from database
# return: bool
def validate_password(password, hashed):
    return bcrypt.checkpw(password.encode(encoding='UTF-8',errors='strict'), hashed)

# JWT Constants
ALGORITHM = 'HS256'
# Load environments from .env into os
load_dotenv()
JWT_DURATION = os.getenv('JWT_DURATION')
JWT_SECRET = os.getenv('JWT_SECRET')

# Encode user id, user name into a json web token 
def jwt_encode(id,username):
    exp_time = datetime.datetime.utcnow() + datetime.timedelta(seconds=int(JWT_DURATION))
    return jwt.encode(
        {'id': str(id),'username':username,'exp': exp_time},
        JWT_SECRET,
        algorithm = ALGORITHM
    )

# Decode user id, user name from json web token
def jwt_decode(encoded_jwt):
    return jwt.decode(encoded_jwt, JWT_SECRET, algorithms=[ALGORITHM])

# Twins implementation of jwt_decode to have pythonic return value
def jwt_decode_identity(encoded_jwt):
    jwt_decoded = jwt_decode(encoded_jwt)
    return jwt_decoded["username"], jwt_decoded["id"]

# Check authentication of http reques by extracting and validate the jwt
def jwt_verify(jwt_encoded):
    try:
        jwt.decode(jwt_encoded, JWT_SECRET, algorithms = [ALGORITHM])
        return True
    except Exception as err: #there could be incalid signature or expire excaptions
        return False

