# Gregary C. Zweigle, 2020

import eventlet
from flask import Flask, render_template
from flask_socketio import SocketIO
import json
import server

eventlet.monkey_patch()

app = Flask(__name__)
app.config['SECRET_KEY'] = 'put_secret_key_here'
socket_io = SocketIO(app)

ss = server.Server()


@app.route('/')
def main_page():
    print("Rendering initial HTML page.")
    return render_template('MidiDrum.html')

@socket_io.on('get_json_data')
def get_json(filename):
    with open(filename, "r") as f:
        params = json.load(f)
        socket_io.emit('json_data', params)

@socket_io.on('client_ready')
def pass_along_data_from_client(message):
    ss.server(socket_io, message['start_audio_driver'])


if __name__ == '__main__':
    socket_io.run(app, port=5000, debug=True)
