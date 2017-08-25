from flask import Flask, render_template, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import urllib.request as request


app = Flask(__name__)

app.config.update(dict(
    DEBUG=True,
    TEMPLATES_AUTO_RELOAD=True,
    SQLALCHEMY_DATABASE_URI='sqlite:///douyu.db',
    SQLALCHEMY_TRACK_MODIFICATIONS=False,
))

db = SQLAlchemy(app)
migrate = Migrate(app, db)

from models import Msg, Follow


@app.route('/')
def home():
    return redirect(url_for('index'))


@app.route('/index')
def index():
    return render_template('index.html')


@app.route('/api/info/<roomid>')
def api_info(roomid):
    url = 'http://open.douyucdn.cn/api/RoomApi/room/' + roomid
    res = request.urlopen(url)
    return res.read()


@app.route('/api/follow/add/<name>')
def api_add_follow(name):
    follow = Follow(name)
