import os, shutil
from flask_migrate import init, upgrade, migrate

from douyu import app


with app.app_context():
    if not os.path.exists('./migrations'):
        init()
        migrate()
        upgrade()
    else:
        files = os.listdir('./versions')

        for file in files:
            src = './versions/'+file
            dst = './migrations/versions/'+file
            if os.path.exists(dst):
                os.remove(dst)
            shutil.move(src, dst)

        upgrade()

app.run(debug=app.config.get('DEBUG', False))
