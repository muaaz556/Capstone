# Getting the code on you machine

To obtain the code on your machine, do `git fetch` to obtain all the branches and then checkout to the proper branch

# Installing dependencies 

`pip install -r requirements.txt` or `pip3 install -r requirements.txt` to install the dependencies for the server to run.

# Running Django server

`python manage.py runserver` or `pip3 manage.py runserver` and visit the IP url path admin -> `127.0.0.1:8000/admin` (IP and/or port maybe different for you)

# Error of Invalid HTTP Header

If obtaining this error when entering the Django server URL into a browser, go into `server/settings.py` and add the IP to `ALLOWED_HOSTS`


