//Taylor Zweigle, 2020
import { Midi } from './Core/Midi.js';
import { Parameters } from './Core/Parameters.js';
import { MidiBuffer } from './Buffer/MidiBuffer.js';
import { Drum } from './Display/Drum.js';
import { AudioDisplay } from './Display/AudioDisplay.js';
import { VelocityDisplay } from './Display/VelocityDisplay.js';
import { HistogramDisplay } from './Display/HistogramDisplay.js';
import { MidiDisplay } from './Display/MidiDisplay.js';

var socket = io.connect("http://localhost:5000");

let midi = new Midi("Piano");
let midiBuffer = new MidiBuffer();
let parameters = new Parameters();

let drumKit = [];
let drumHeads = midi.getDrumHeads();
for(let i = 0; i < drumHeads.length; i++) {
    drumKit.push(new Drum(document, midi, midi.getDrum(drumHeads[i])));
}

let audioDisplay = new AudioDisplay();
let histogramDisplay = new HistogramDisplay();
let midiDisplay = new MidiDisplay(midi);
let velocityDisplay = new VelocityDisplay();

//SVG and Canvas
let audioCanvas = document.getElementById("audioCanvas");
let historgamCanvas = document.getElementById("histogramCanvas");
let midiCanvas = document.getElementById("midiDisplayCanvas");
let velocityCanvas = document.getElementById("velocityCanvas");
let audioCell = document.getElementById("audioCell");
let midiDisplayCell = document.getElementById("midiDisplayCell");

//Set Sizes
audioCanvas.width = audioCell.offsetWidth;
audioCanvas.height = 100;
midiCanvas.width = midiDisplayCell.offsetWidth;
midiCanvas.height = 130;
velocityCanvas.width = 315;
velocityCanvas.height = 365;
historgamCanvas.width = 315;
historgamCanvas.height = 365;

window.dispatchEvent(new Event('resize'));

let resetButton = document.getElementById("resetButton");
resetButton.onclick = function() {
    for(let i = 0; i < drumKit.length; i++) {
        drumKit[i].clearCount();
    }
    
    midiDisplay.reset();
    histogramDisplay.reset();
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

    audioDisplay.updateBuffers(audioLeft, audioRight);

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

    audioDisplay.draw(audioCanvas, parameters);
    midiDisplay.draw(midiCanvas, parameters, drumKit);
    velocityDisplay.draw(velocityCanvas, parameters, drumKit);
    histogramDisplay.draw(historgamCanvas, parameters, drumKit);
}

animate();