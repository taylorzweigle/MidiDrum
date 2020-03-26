//Taylor Zweigle
import { Drum } from './Drum.js';
import { TimelineDisplay } from './TimelineDisplay.js';

var socket = io.connect("http://localhost:5000");

let canvas = document.getElementById("myCanvas");
let context = canvas.getContext("2d");
const CANVAS_HEIGHT = 150;

let snare = new Drum(document.getElementById("Snare"), 38);
let tom1 = new Drum(document.getElementById("Tom1"), 48);
let tom2 = new Drum(document.getElementById("Tom2"), 45);
let tom3 = new Drum(document.getElementById("Tom3"), 43);
let highHat = new Drum(document.getElementById("HighHat"), 46);
let crash = new Drum(document.getElementById("Crash"), 49);
let ride = new Drum(document.getElementById("Ride"), 51);
let kick = new Drum(document.getElementById("Kick"), 36);

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
socket.emit('client_ready', {'start_audio_driver' : true});

socket.on('data_from_server', function (data_from_server) {
    var midi_data = data_from_server['midi_data'];
    var audio_left = data_from_server['audio_left'];
    var audio_right = data_from_server['audio_right'];

    leftTimelineDisplay.saveAudioData(audio_left, canvas.width);
    leftTimelineDisplay.drawTimeline(context, 0, canvas.width, CANVAS_HEIGHT);
    rightTimelineDisplay.saveAudioData(audio_right, canvas.width);
    rightTimelineDisplay.drawTimeline(context, CANVAS_HEIGHT, canvas.width, CANVAS_HEIGHT);

    for(let row = 0; row < midi_data.length; row++) {
        if(midi_data[row][0] != 0) {
            snare.setDrum(midi_data[row]);
            tom1.setDrum(midi_data[row]);
            tom2.setDrum(midi_data[row]);
            tom3.setDrum(midi_data[row]);
            highHat.setDrum(midi_data[row]);
            crash.setDrum(midi_data[row]);
            ride.setDrum(midi_data[row]);
            kick.setDrum(midi_data[row]);
        }
        else {
            break;
        }
    }

    // After finished displaying the data, tell the server to send more data.
    socket.emit('client_ready', {'start_audio_driver' : false});
});