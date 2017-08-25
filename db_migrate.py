import os
from flask_migrate import migrate, init, upgrade

from douyu import app


with app.app_context():
    if not os.path.exists('./migrations'):
        init()
    migrate()
    # upgrade()
