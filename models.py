from datetime import datetime

from douyu import db


class Msg(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    cid = db.Column(db.String(50), nullable=False)
    txt = db.Column(db.String(256), nullable=False)
    rid = db.Column(db.Integer, nullable=False)
    uid = db.Column(db.Integer, nullable=False)
    nn = db.Column(db.String(100), nullable=False)
    ic = db.Column(db.String(256))
    level = db.Column(db.Integer)
    ol = db.Column(db.Integer)
    pg = db.Column(db.Integer)
    sahf = db.Column(db.Integer)
    rg = db.Column(db.Integer)
    dlv = db.Column(db.Integer)
    dc = db.Column(db.Integer)
    bdlv = db.Column(db.Integer)
    nl = db.Column(db.Integer)
    bnn = db.Column(db.String(10))
    bl = db.Column(db.Integer)
    col = db.Column(db.Integer)
    el = db.Column(db.String(256))
    date = db.Column(db.DateTime)

    def __init__(self, message):
        self.cid = message.cid
        self.txt = message.txt
        self.rid = message.rid
        self.uid = message.uid
        self.nn = message.nn
        self.ic = message.ic
        self.level = message.level
        self.ol = message.ol
        self.pg = message.pg
        self.sahf = message.sahf
        self.rg = message.rg
        self.dlv = message.dlv
        self.dc = message.dc
        self.bdlv = message.bdlv
        self.nl = message.nl
        self.bnn = message.bnn
        self.bl = message.bl
        self.col = message.col
        el = []
        for item in message.el:
            el.append(item['eid'])
        self.el = ','.join(el)
        self.date = datetime.now()

    def __repr__(self):
        return '<Msg %s: %s>' % (self.nn, self.txt)


class Follow(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)

    def __init__(self, name):
        self.name = name

    def __repr__(self):
        return '<Follow %s>' % self.name

    @property
    def serialize(self):
        return dict(id=self.id, name=self.name)


class Room(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    roomId = db.Column(db.Integer, nullable=False, unique=True)

    def __init__(self, roomId):
        self.roomId = roomId

    def __repr__(self):
        return '<Room %s>' % self.roomId

    @property
    def serialize(self):
        return dict(id=self.id, roomId=self.roomId)
