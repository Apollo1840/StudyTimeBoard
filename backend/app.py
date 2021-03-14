
from studytimeboard import create_app, debug_mode, logger
from flask_cors import CORS

app = create_app()
CORS(app)  # require this library to sole the cors policy error

if __name__ == '__main__':
    logger.info("start the app! ")

    # start the app
    app.run(host='0.0.0.0', port=5555, debug=debug_mode)
