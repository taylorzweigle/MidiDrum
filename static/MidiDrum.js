//Taylor Zweigle, 2020
import { Midi } from './Midi.js';
import { Drum } from './Drum.js';
import { TimelineDisplay } from './TimelineDisplay.js';

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

let canvas = document.getElementById("myCanvas");
let context = canvas.getContext("2d");
const CANVAS_HEIGHT = 150;

let leftTimelineDisplay = new TimelineDisplay(4, 20, "#981e32");
let rightTimelineDisplay = new TimelineDisplay(4, 20, "#981e32");

window.addEventListener('resize', function(event) {
    context.clearRect(0, 0, canvas.width, CANVAS_HEIGHT*2 + 10);  // Bad!!
    canvas.width = window.innerWidth - 36;
    canvas.height = CANVAS_HEIGHT*2 + 10;
    leftTimelineDisplay.resizeTimeline(canvas.width);
    rightTimelineDisplay.resizeTimeline(canvas.width);
});

window.dispatchEvent(new Event('resize'));

// Tell the server to start sending data.
socket.emit('client_ready', {'start_audio_driver' : true});

socket.on('data_from_server', function (data_from_server) {
    let midi_data = data_from_server['midi_data'];
    let midi_rows = data_from_server['midi_rows'];
    let audio_left = data_from_server['audio_left'];
    let audio_right = data_from_server['audio_right'];

    midi.updateBuffers(midi_data, midi_rows);

    leftTimelineDisplay.updateBuffers(audio_left);
    rightTimelineDisplay.updateBuffers(audio_right);

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

    leftTimelineDisplay.draw(context, {"yLoc": 0, "width": canvas.width, "height": CANVAS_HEIGHT});
    rightTimelineDisplay.draw(context, {"yLoc": (CANVAS_HEIGHT + 10), "width": canvas.width, "height": CANVAS_HEIGHT});
}

animate();