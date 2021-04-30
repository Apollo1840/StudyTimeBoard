
# sudo apt install xdotool

# workon web
xdotool type "python backend/app.py"
xdotool key Return

xdotool key ctrl+shift+t
xdotool type "cd frontend"
xdotool key Return
 
xdotool type "npm start"
xdotool key Return
