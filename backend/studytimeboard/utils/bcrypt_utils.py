import bcrypt

# create hashed password
def hash_password(password):
    passwdBytes = bytes(password, encoding='utf-8')  # Unicode-objects must be encoded before hasing
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(passwdBytes, salt)

# validate password with hashed password from database
# return: bool
def validate_password(password, hashed):
    return bcrypt.checkpw(password.encode(encoding='UTF-8',errors='strict'), hashed)
