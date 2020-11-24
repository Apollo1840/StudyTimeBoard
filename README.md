# StudyTimeBoard

This is the server of the study-time-board web app.

## For developers

To debug your program locally you need to follow those steps:

1. follow the steps from：

    https://www.youtube.com/watch?v=w533wJuilao&ab_channel=JayMartMedia

    to get the `client_secret.json` and put it in `./utils/creds`. 


2. Ask me to give you the access to this google sheet:
    https://docs.google.com/spreadsheets/d/1FGoY2IrXavkyiRGZQkvTIgHwHmIrlohR-IDoQ5K4hw4/edit?usp=sharing
    
3. Add the "client_email" in `./utils/creds/client_secret.json` to the share list of that googrm le sheet.

Now you are ready to go.

run:

    pip install -r requiremnts.txt
    python app.py
   
to start a server locally. go to `http://0.0.0.0:5555/` to view the main page of thie web app.

### todo:

- add this_week time board and put it before the whole time board.
- show the study king of today.
- combine bootstrap (component-wise develop of the web app)
- use Database software to check updates then update the charts regularly, instead of tigered by visit the web.
- automatic download of bootstrap.

## Live demo

Use your browser, go to https://study-time-board.herokuapp.com/.

Ask the author to get editing permits to the data sheet 
(`record_study_time` on cloud, url:  https://docs.google.com/spreadsheets/d/1FGoY2IrXavkyiRGZQkvTIgHwHmIrlohR-IDoQ5K4hw4/edit?usp=sharing).


## Reference: How to build web app
https://www.freecodecamp.org/news/how-to-build-a-web-application-using-flask-and-deploy-it-to-the-cloud-3551c985e492/

https://dev.to/techparida/how-to-deploy-a-flask-app-on-heroku-heb (recommended by DiQing Chang [https://github.com/changdiqing])