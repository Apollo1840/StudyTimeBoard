
from studytimeboard import app, debug_mode

if __name__ == '__main__':
    # start the app
    app.run(host='0.0.0.0', port=5555, debug=debug_mode)
