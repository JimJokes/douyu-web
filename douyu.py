import threading

from flask import Flask, render_template, redirect, url_for, request, jsonify, json
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import urllib.request as req
from sqlalchemy.exc import IntegrityError
from flask_sockets import Sockets

from websocket import Send


app = Flask(__name__)

app.config.update(dict(
    DEBUG=True,
    TEMPLATES_AUTO_RELOAD=True,
    SQLALCHEMY_DATABASE_URI='sqlite:///douyu.db',
    SQLALCHEMY_TRACK_MODIFICATIONS=False,
))

db = SQLAlchemy(app)
migrate = Migrate(app, db)
sockets = Sockets(app)

from models import Msg, Follow, Room


@app.route('/')
def home():
    return redirect(url_for('index'))


@app.route('/index')
def index():
    follows = Follow.query.order_by('id').all()
    rooms = Room.query.order_by('id').all()
    return render_template('index.html', follows=follows, rooms=rooms)


@app.route('/api/info/<roomid>')
def api_room_info(roomid):
    url = 'http://open.douyucdn.cn/api/RoomApi/room/' + roomid
    res = req.urlopen(url)
    return res.read()


@app.route('/api/follow/add', methods=['POST'])
def api_add_follow():
    name = request.form['name']
    data = []
    if name is None:
        return jsonify(success=False, data=data, message='请输入正确的昵称！')
    follow = Follow(name)
    try:
        db.session.add(follow)
        db.session.commit()
        return jsonify(success=True, data=follow.serialize, message='')
    except IntegrityError as e:
        if 'UNIQUE constraint failed' in e.orig.args[0]:
            return jsonify(success=False, data=data, message='%s 已经关注了哦！' % name)
        return jsonify(success=False, data=data, message='弹幕姬错误！')


@app.route('/api/follow/remove', methods=['DELETE'])
def api_remove_follow():
    id = request.form['id']
    try:
        follow = Follow.query.filter_by(id=id).first()
        if follow is None:
            return jsonify(success=False, message='没有关注该用户！')
        db.session.delete(follow)
        db.session.commit()
        return jsonify(success=True, message='')
    except Exception as e:
        return jsonify(success=False, message='弹幕姬错误！')


@app.route('/api/room/add', methods=['POST'])
def api_add_room():
    roomId = request.form['name']
    data = []
    if roomId is None:
        return jsonify(success=False, data=data, message='请输入正确的直播间ID！')
    room = Room(roomId)
    try:
        db.session.add(room)
        db.session.commit()
        return jsonify(success=True, data=room.serialize, message='')
    except IntegrityError as e:
        if 'UNIQUE constraint failed' in e.orig.args[0]:
            return jsonify(success=False, data=data, message='%s 已经关注了哦！' % roomId)
        return jsonify(success=False, data=data, message='弹幕姬错误！')


@app.route('/api/room/remove', methods=['DELETE'])
def api_remove_room():
    id = request.form['id']
    try:
        room = Room.query.filter_by(id=id).first()
        if room is None:
            return jsonify(success=False, message='没有关注该直播间！')
        db.session.delete(room)
        db.session.commit()
        return jsonify(success=True, message='')
    except Exception as e:
        return jsonify(success=False, message='弹幕姬错误！')


websocket = None


@sockets.route('/message')
def socket(ws):
    global websocket
    if websocket:
        websocket.close()
    websocket = ws
    while not ws.closed:
        message = ws.receive()
        if message is not None:
            msg_type = json.loads(message).get('msg_type')
            if msg_type == 0:
                print('websocket已连接')

    print('websocket已关闭……')
