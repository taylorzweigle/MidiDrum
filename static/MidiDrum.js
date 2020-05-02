//Taylor Zweigle, 2020
import { Midi } from './Midi.js';
import { Drum } from './Drum.js';
import { TimelineDisplay } from './TimelineDisplay.js';
import { Parameters } from './Parameters.js';
import { HistogramDisplay } from './HistogramDisplay.js';

var socket = io.connect("http://localhost:5000");

let midi = new Midi();
let parameters = new Parameters();

//let keyCodes = {"Kick":36, "Snare":38, "Tom1":48, "Tom2":45, "Tom3":43, "HighHat":46, "Crash":49, "Ride":51}; //Drum
let keyCodes = {"Kick":59, "Snare":60, "Tom1":62, "Tom2":64, "Tom3":65, "HighHat":67, "Crash":69, "Ride":71}; //Pian

let drumHeads = [];
drumHeads.push(new Drum(document, "Kick", keyCodes["Kick"]));
drumHeads.push(new Drum(document, "Snare", keyCodes["Snare"]));
drumHeads.push(new Drum(document, "Tom1", keyCodes["Tom1"]));
drumHeads.push(new Drum(document, "Tom2", keyCodes["Tom2"]));
drumHeads.push(new Drum(document, "Tom3", keyCodes["Tom3"]));
drumHeads.push(new Drum(document, "HighHat", keyCodes["HighHat"]));
drumHeads.push(new Drum(document, "Crash", keyCodes["Crash"]));
drumHeads.push(new Drum(document, "Ride", keyCodes["Ride"]));

let mySVG = document.getElementById("Layer_1");

let timelineCanvas = document.getElementById("timelineCanvas");
let timelineContext = timelineCanvas.getContext("2d");
let parametersCanvas = document.getElementById("parametersCanvas");
let parametersContext = parametersCanvas.getContext("2d");
let historgamCanvas = document.getElementById("histogramCanvas");
let historgamContext = historgamCanvas.getContext("2d");

let timelineCell = document.getElementById("timelineCell");
let parametersCell = document.getElementById("parametersCell");
let histogramCell = document.getElementById("histogramCell");

let timelineDisplay = new TimelineDisplay();
let histogramDisplay = new HistogramDisplay();

window.addEventListener('resize', function(event) {
    timelineCanvas.width = timelineCell.offsetWidth;
    parametersCanvas.width = parametersCell.offsetWidth;
    historgamCanvas.width = histogramCell.offsetWidth;
    historgamCanvas.height = mySVG.height.baseVal.value;

    timelineDisplay.resizeTimeline(timelineCanvas.width);
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

    //After finished displaying the data, tell the server to send more data.
    socket.emit('client_ready', {'start_audio_driver' : false});
});

function animate() {
    requestAnimationFrame(animate);

    while(!midi.bufferEmpty()) {
        let midi_data = [];
        
        midi.readBuffer(midi_data);

        for(let i = 0; i < drumHeads.length; i++) {
            drumHeads[i].setDrum(midi_data);
        }
    }

    histogramDisplay.drawHistogram(historgamCanvas, parameters, drumHeads);

    parametersContext.beginPath();
    parametersContext.fillStyle = "#000000";
    parametersContext.lineWidth = 1;
    parametersContext.rect(0, 0, parametersCanvas.width, parametersCanvas.height);
    parametersContext.stroke();

    timelineDisplay.draw(timelineContext, parameters, 
        {"yLoc": 0, "width": timelineCanvas.width, "height": timelineCanvas.height});
}

animate();