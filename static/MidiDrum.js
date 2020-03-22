//Taylor Zweigle
import { Drum } from './Drum.js';

var socket = io.connect("http://localhost:5000");

let snare = new Drum(document.getElementById("Snare"), 60);
let tom1 = new Drum(document.getElementById("Tom1"), 62);
let tom2 = new Drum(document.getElementById("Tom2"), 64);
let tom3 = new Drum(document.getElementById("Tom3"), 65);
let highHat = new Drum(document.getElementById("HighHat"), 67);
let crash = new Drum(document.getElementById("Crash"), 69);
let ride = new Drum(document.getElementById("Ride"), 71);
let kick = new Drum(document.getElementById("Kick"), 59);

// Tell the server to start sending data.
socket.emit('client_ready', {});

socket.on('data_from_server', function (data_from_server) {
    var data = data_from_server['data']

    for(let row = 0; row < data.length; row++) {
        if(data[0][0] != 0) {
            snare.setDrum(data[row]);
            tom1.setDrum(data[row]);
            tom2.setDrum(data[row]);
            tom3.setDrum(data[row]);
            highHat.setDrum(data[row]);
            crash.setDrum(data[row]);
            ride.setDrum(data[row]);
            kick.setDrum(data[row]);
        }
        else {
            break;
        }
    }

    // After finished displaying the data, tell the server to send more data.
    socket.emit('client_ready', {});
});