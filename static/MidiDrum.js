//Taylor Zweigle, 2020
import { Midi } from './Midi.js';
import { MidiBuffer } from './MidiBuffer.js';
import { Drum } from './Drum.js';
import { TimelineDisplay } from './TimelineDisplay.js';
import { Parameters } from './Parameters.js';
import { HistogramDisplay } from './HistogramDisplay.js';
import { MidiDisplay } from './MidiDisplay.js';

var socket = io.connect("http://localhost:5000");

let midi = new Midi("Piano");
let midiBuffer = new MidiBuffer();
let parameters = new Parameters();

let drumKit = [];
let drumHeads = midi.getDrumHeads();
for(let i = 0; i < drumHeads.length; i++) {
    drumKit.push(new Drum(document, midi, midi.getDrum(drumHeads[i])));
}

let timelineDisplay = new TimelineDisplay();
let histogramDisplay = new HistogramDisplay();
let midiDisplay = new MidiDisplay(midi);

//SVG and Canvas
let mySVG = document.getElementById("Layer_1");
let timelineCanvas = document.getElementById("timelineCanvas");
let timelineContext = timelineCanvas.getContext("2d");
let historgamCanvas = document.getElementById("histogramCanvas");
let midiCanvas = document.getElementById("midiDisplayCanvas");
let timelineCell = document.getElementById("timelineCell");
let histogramCell = document.getElementById("histogramCell");
let midiDisplayCell = document.getElementById("midiDisplayCell");

window.addEventListener('resize', function(event) {
    timelineCanvas.width = timelineCell.offsetWidth;
    timelineCanvas.height = 100;
    midiCanvas.width = midiDisplayCell.offsetWidth;
    midiCanvas.height = 130;
    historgamCanvas.width = 320;
    historgamCanvas.height = mySVG.height.baseVal.value;
});

window.dispatchEvent(new Event('resize'));

let resetButton = document.getElementById("resetButton");
resetButton.onclick = function() {
    for(let i = 0; i < drumKit.length; i++) {
        drumKit[i].clearCount();
    }
    
    midiDisplay.reset();
};

// Get json parameters from client.
socket.emit('get_json_data', "data\\parameters.json");
socket.on('json_data', function(jsonData) {
    parameters.update(jsonData);
});

socket.emit('client_ready', {'start_audio_driver' : true});
socket.on('data_from_server', function (data_from_server) {
    let midiData = data_from_server['midi_data'];
    let midiRows = data_from_server['midi_rows'];
    let audioLeft = data_from_server['audio_left'];
    let audioRight = data_from_server['audio_right'];

    midiBuffer.updateBuffers(midiData, midiRows);

    timelineDisplay.updateBuffers(audioLeft, audioRight);

    //After finished displaying the data, tell the server to send more data.
    socket.emit('client_ready', {'start_audio_driver' : false});
});

function animate() {
    requestAnimationFrame(animate);

    midiDisplay.shiftWriteLocation();
    // Right here we need to move the write pointer for the midi buffer.

    while(!midiBuffer.bufferEmpty()) {
        let midiData = [];
        
        midiBuffer.readBuffer(midiData);

        for(let i = 0; i < drumKit.length; i++) {
            drumKit[i].setDrum(midiData);
        }

        midiDisplay.updateBuffers(midiData);

        // Right here we need to check if the drum has been hit for each 
        // drum head and put a 1 in the row associated with that drum head.
        // And, remove the outer loop from the code we are working on (because
        // while loop takes the place of the outer loop in the code we are working on)
    }

    timelineDisplay.draw(timelineCanvas);
    midiDisplay.draw(midiCanvas, parameters, drumKit);
    histogramDisplay.draw(historgamCanvas, parameters, drumKit);
}

animate();