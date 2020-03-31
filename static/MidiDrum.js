//Taylor Zweigle
import { Drum } from './Drum.js';
import { TimelineDisplay } from './TimelineDisplay.js';

var socket = io.connect("http://localhost:5000");

let audioOn = false;

let canvas = document.getElementById("myCanvas");
let context = canvas.getContext("2d");
const CANVAS_HEIGHT = 150;

//let keyCodes = {"Kick":36, "Snare":38, "Tom1":48, "Tom2":45, "Tom3":43, "HighHat":46, "Crash":49, "Ride":51};
let keyCodes = {"Kick":59, "Snare":60, "Tom1":62, "Tom2":64, "Tom3":65, "HighHat":67, "Crash":69, "Ride":71};

let kick = new Drum(document, "Kick", keyCodes["Kick"]);
let snare = new Drum(document, "Snare", keyCodes["Snare"]);
let tom1 = new Drum(document, "Tom1", keyCodes["Tom1"]);
let tom2 = new Drum(document, "Tom2", keyCodes["Tom2"]);
let tom3 = new Drum(document, "Tom3", keyCodes["Tom3"]);
let highHat = new Drum(document, "HighHat", keyCodes["HighHat"]);
let crash = new Drum(document, "Crash", keyCodes["Crash"]);
let ride = new Drum(document, "Ride", keyCodes["Ride"]);

let leftTimelineDisplay = new TimelineDisplay();
let rightTimelineDisplay = new TimelineDisplay();

window.addEventListener('resize', function(event) {
    context.clearRect(0, 0, canvas.width, CANVAS_HEIGHT*2);
    canvas.width = window.innerWidth - 36;
    canvas.height = CANVAS_HEIGHT*2;
    leftTimelineDisplay.resizeTimeline(canvas.width);
    rightTimelineDisplay.resizeTimeline(canvas.width);
});

window.dispatchEvent(new Event('resize'));

// Tell the server to start sending data.
socket.emit('client_ready', {'start_audio_driver' : audioOn});

socket.on('data_from_server', function (data_from_server) {
    var midi_data = data_from_server['midi_data'];
    var audio_rows = data_from_server['audio_rows'];
    var audio_left = data_from_server['audio_left'];
    var audio_right = data_from_server['audio_right'];

    leftTimelineDisplay.saveAudioData(audio_left, audio_rows);
    leftTimelineDisplay.drawTimeline(context, 0, canvas.width, CANVAS_HEIGHT);
    rightTimelineDisplay.saveAudioData(audio_right, audio_rows);
    rightTimelineDisplay.drawTimeline(context, CANVAS_HEIGHT, canvas.width, CANVAS_HEIGHT);

    for(let row = 0; row < data_from_server['midi_rows']; row++) {
        kick.setDrum(midi_data[row]);
        snare.setDrum(midi_data[row]);
        tom1.setDrum(midi_data[row]);
        tom2.setDrum(midi_data[row]);
        tom3.setDrum(midi_data[row]);
        highHat.setDrum(midi_data[row]);
        crash.setDrum(midi_data[row]);
        ride.setDrum(midi_data[row]);
    }

    // After finished displaying the data, tell the server to send more data.
    socket.emit('client_ready', {'start_audio_driver' : false});
});