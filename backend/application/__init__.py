from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
from os import environ

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config['SECRET_KEY'] = environ.get('SECRET_KEY')
app.config['MONGO_URI'] = environ.get('MONGO_URI')


client = MongoClient(app.config["MONGO_URI"], connect=False)

db = client['e-commerce']

products = db['products']

from application import routes