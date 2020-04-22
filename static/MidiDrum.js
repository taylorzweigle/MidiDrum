//Taylor Zweigle, 2020
import { Midi } from './Midi.js';
import { Drum } from './Drum.js';
import { TimelineDisplay } from './TimelineDisplay.js';
import { Parameters } from './Parameters.js';

var socket = io.connect("http://localhost:5000");

let midi = new Midi();

//let keyCodes = {"Kick":36, "Snare":38, "Tom1":48, "Tom2":45, "Tom3":43, "HighHat":46, "Crash":49, "Ride":51}; //Drum
let keyCodes = {"Kick":59, "Snare":60, "Tom1":62, "Tom2":64, "Tom3":65, "HighHat":67, "Crash":69, "Ride":71}; //Piano

let kick = new Drum(document, "Kick", keyCodes["Kick"]);
let snare = new Drum(document, "Snare", keyCodes["Snare"]);
let tom1 = new Drum(document, "Tom1", keyCodes["Tom1"]);
let tom2 = new Drum(document, "Tom2", keyCodes["Tom2"]);
let tom3 = new Drum(document, "Tom3", keyCodes["Tom3"]);
let highHat = new Drum(document, "HighHat", keyCodes["HighHat"]);
let crash = new Drum(document, "Crash", keyCodes["Crash"]);
let ride = new Drum(document, "Ride", keyCodes["Ride"]);

let mySVG = document.getElementById("my_SVG");

let canvas = document.getElementById("myCanvas");
let context = canvas.getContext("2d");

let parameters = new Parameters();
let timelineDisplay = new TimelineDisplay();

window.addEventListener('resize', function(event) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    mySVG.setAttribute("height", ((window.innerHeight - 36) * 0.8));
    canvas.width = mySVG.width.baseVal.value;
    canvas.height = window.innerHeight - mySVG.height.baseVal.value;
    timelineDisplay.resizeTimeline(canvas.width);
});

window.dispatchEvent(new Event('resize'));

// Get json parameters from client.
socket.emit('get_json_data', "data\\parameters.json");
socket.on('json_data', function(json_data) {
    parameters.update(json_data);
});

socket.emit('client_ready', {'start_audio_driver' : true});
socket.on('data_from_server', function (data_from_server) {
    let midi_data = data_from_server['midi_data'];
    let midi_rows = data_from_server['midi_rows'];
    let audio_left = data_from_server['audio_left'];
    let audio_right = data_from_server['audio_right'];

    midi.updateBuffers(midi_data, midi_rows);

    timelineDisplay.updateBuffers(audio_left, audio_right);

    // After finished displaying the data, tell the server to send more data.
    socket.emit('client_ready', {'start_audio_driver' : false});
});

function animate() {
    requestAnimationFrame(animate);

    while(!midi.bufferEmpty()) {
        let midi_data = [];
        
        midi.readBuffer(midi_data);

        kick.setDrum(midi_data);
        snare.setDrum(midi_data);
        tom1.setDrum(midi_data);
        tom2.setDrum(midi_data);
        tom3.setDrum(midi_data);
        highHat.setDrum(midi_data);
        crash.setDrum(midi_data);
        ride.setDrum(midi_data);
    }

    timelineDisplay.draw(context, parameters,
        {"yLoc": 0, "width": canvas.width, "height": canvas.height});
}

animate();