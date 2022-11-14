# Setting Up Backend

This README should assist in setting up the backend instance on your local environment, from getting Django, Postgres and other applications working.

## Before working with backend architecture 

Before you work with backend code and when running the backend to get the server running, this should always be done in a virtual environment. This is done to prevent the OS intefering with the backend setup and packages, while also isolating our environment so we all work with the same type of environment. 

Python allows us to create a virtual env in our code setup so we don't need to create a docker container or external VM to clone and run our code.

In the Capstone project directory run `python -m venv capstone-env` or `python3 -m venv capstone-env`

We are using this virtual environment name, as it is already added to the .gitignore and we don't have to all deal with adding it to our own if we use different names.

To start the virtual environment, run `source capstone-env/bin/activate` and your terminal should now be running in the virtual environemnt. 

Create a virtual environement anytime you are going to work in the backend and currently do not have one made. Start the virtual enviroment anytime you are going to run backend focused commands in a terminal.

## Installing packages 

Run `pip install -r requirements.txt` or `pip3 install -r requirements.txt` to install the dependencies for the server to run.

## Installing softwares

Installing Postgres App and pgAdmin4 as they are both needed to run a postgres server and maintain the database.

- https://postgresapp.com/
- https://www.pgadmin.org/

## Starting up the Postgres Server

Open the Postgres application and click `Initialize` and observe the server running.

## Connecting pgAdmin 4 to Postgres Server

Open pgAdmin 4 and create the main password for your local instance

If the server dropdown on the left is empty, then click on `Add New Server`. Under the `General` tab enter the name `PostgresSQL 15` and under the `Connection` tab enter host name as `localhost`.

## Running Django server with Postgres SQL connected

In the Capstone project and a virtual environment terminal, go into the `server` directory. From there run `python manage.py runserver` and you should see no errors and be able to view the browser page `http://127.0.0.1:8000/api/`



