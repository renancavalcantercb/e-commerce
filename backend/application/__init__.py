from flask import Flask, request
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
from os import environ

import sys
import os

sys.path.append(os.getcwd())

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config['SECRET_KEY'] = environ.get('SECRET_KEY')
app.config['MONGO_URI'] = environ.get('MONGO_URI')

client = MongoClient(app.config["MONGO_URI"], connect=False)
db = client['e-commerce']
products = db['products']

@app.after_request
def add_cors_headers(response):
    response.headers.add('Access-Control-Allow-Origin', request.headers.get('Origin', '*'))
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    return response

from application.routes import *