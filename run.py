import os, shutil
from flask_migrate import init, upgrade

from douyu import app


with app.app_context():
    if not os.path.exists('./migrations'):
        init()

    files = os.listdir('./versions')

    if len(files) > 0:
        for file in files:
            src = './versions/'+file
            dst = './migrations/versions/'+file
            if os.path.exists(dst):
                continue
            shutil.move(src, dst)

        upgrade()

app.run(debug=app.config.get('DEBUG', False))
