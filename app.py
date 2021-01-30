
from studytimeboard import app, debug_mode, logger

if __name__ == '__main__':
    logger.info("start the app! ")

    # start the app
    app.run(host='0.0.0.0', port=5555, debug=debug_mode)
