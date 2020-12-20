# import pandas as pd
# import os

from studytimeboard import app
# from studytimeboard.constant import *
# from studytimeboard.app_utils import initialize_db

if __name__ == '__main__':

    # start the app
    app.run(host='0.0.0.0', port=5555, debug=True)
