# How to install dependencies

This manuscript is for Ubuntu 18 with Linux 5.4.0-70-generic kernel. Hopefully suitable for any linux kernel.

1.  check whether you have have Python3 or not. if not install Python3 (https://docs.python.org/3/using/index.html).

         python -V

    (I am using Python3.6.9)

2.  install virtualenvwrapper

        pip install virtualenvwrapper
        export WORKON_HOME=~/Envs
        mkdir -p $WORKON_HOME
        source /usr/local/bin/virtualenvwrapper.sh
        mkvirtualenv stb_dev

3.  install python packgages

        cd /path/to/this/project
        cd backend/
        workon stb_dev
        pip install -r requirements.txt

4.  install node etw.

        sudo apt install nodejs
        sudo apt install npm
        sudo npm install -g n
        sudo n stable

5.  install npm packgages

        cd /path/to/this/project
        cd frontend/
        npm install

## Error Handling:

### For windows:

- RAM shortage when use 'npm start':
  in `package.json` modify:

  ```json

      ...
      "start": "react-scripts --max_old_space_size=4096 start"
      "build": "react-scripts --max_old_space_size=4096 build"
      ...
  ```
