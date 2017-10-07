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

# websocket_server = WebSocketServer()
# websocket_server.setDaemon(True)
# websocket_server.start()
#
# app.run(debug=app.config.get('DEBUG', False))
app.debug = app.config.get('DEBUG', False)

from gevent import pywsgi
from geventwebsocket.handler import WebSocketHandler
sever = pywsgi.WSGIServer(('', 5000), app, handler_class=WebSocketHandler)
sever.serve_forever()
