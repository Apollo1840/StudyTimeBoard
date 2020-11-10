# StudyTimeBoard

This is the server of the study-time-board web app.

## For developers

To develop this web app you should first follow the steps from：

https://www.youtube.com/watch?v=w533wJuilao&ab_channel=JayMartMedia

to get the `client_secret.json` and put it in `./utils/creds`. 
then add the client_email to the share list of the `record_study_time` on cloud.

run:

    pip install -r requiremnts.txt
    python app.py
   
to start a server locally. go to `http://0.0.0.0:5555/` to view the main page of thie web app.

## Live demo

Use your browser, go to https://study-time-board.herokuapp.com/.

Ask the author to get editing permits to the data sheet (`record_study_time` on cloud).


## Reference: How to build web app
https://www.freecodecamp.org/news/how-to-build-a-web-application-using-flask-and-deploy-it-to-the-cloud-3551c985e492/

https://dev.to/techparida/how-to-deploy-a-flask-app-on-heroku-heb (recommended by DiQing Chang [https://github.com/changdiqing])