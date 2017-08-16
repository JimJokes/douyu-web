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

    def __init__(self, cid, txt, rid, uid, nn, ic=None, level=None,
                 ol=None, pg=None, sahf=None, rg=None, dlv=None,
                 dc=None, bdlv=None, nl=None, bnn=None, bl=None,
                 col=None, el=None):
        self.cid = cid
        self.txt = txt
        self.rid = rid
        self.uid = uid
        self.nn = nn
        self.ic = ic
        self.level = level
        self.ol = ol
        self.pg = pg
        self.sahf = sahf
        self.rg = rg
        self.dlv = dlv
        self.dc = dc
        self.bdlv = bdlv
        self.nl = nl
        self.bnn = bnn
        self.bl = bl
        self.col = col
        self.el = el
        self.date = datetime.utcnow()

    def __repr__(self):
        return '<Msg %s: %s>' % (self.nn, self.txt)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))

    def __init__(self, name):
        self.name = name
