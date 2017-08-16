from flask import Flask, render_template, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate


app = Flask(__name__)

app.config.update(dict(
    DEBUG=True,
    TEMPLATES_AUTO_RELOAD=True,
    SQLALCHEMY_DATABASE_URI='sqlite:///douyu.db',
    SQLALCHEMY_TRACK_MODIFICATIONS=False,
    SQLALCHEMY_MIGRATE_REPO='./db_repository'
))

db = SQLAlchemy(app)
migrate = Migrate(app, db)

from models import Msg, User


@app.route('/')
def home():
    return redirect(url_for('index'))


@app.route('/index')
def index():
    return render_template('index.html')
