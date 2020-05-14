//Taylor Zweigle, 2020
export class MidiDisplay {
    constructor(midi) {
        this.midi = midi;
        this.fontSize = 16;
        this.writeLocation = 0;
        this.readLocation = 0;
        this.numLocations = 1140;
        this.bufferData = [];

        this.drumHeads = midi.getDrumHeads();
        this.keyCodes = [];
        for(let i = 0; i < this.drumHeads.length; i++) {
            this.keyCodes[i] = midi.getDrum(this.drumHeads[i]).note;
        }

        this.reset();
    }

    draw(canvas, parameters, drumHeads) {
        let context = canvas.getContext("2d");

        context.clearRect(0, 0, canvas.width, canvas.height);

        this._drawCanvas(canvas, context, drumHeads);
        this._drawMidi(canvas, parameters);
    }

    _drawCanvas(canvas, context, drumHeads) {
        this._drawVerticalTickMarks(canvas, context, drumHeads);
        this._drawHorizontalTickMarks(canvas, context);
        this._drawBoundary(canvas, context);
    }

    _drawMidi(canvas, parameters) {
        let context = canvas.getContext("2d");

        let col2 = this.writeLocation;

        for(let col = 0; col < this.numLocations; col++) {
            for(let row = 0; row < this.keyCodes.length; row++) {
                if(this.bufferData[col2][row] == 1) {
                    context.beginPath();
                    context.fillStyle = parameters.getDrumColor(this.drumHeads[row]);
                    context.fillRect(canvas.width-(col*5.74)-90, row*this.fontSize, 12, this.fontSize);
                }
            }
            col2--;
            if (col2 < 0) {
                col2 = this.numLocations - 1;
            }
        }
    }

    shiftWriteLocation() {
        // Move the write pointer in anticipation of the next write.
        if(this.writeLocation == this.numLocations-1) {
            this.writeLocation = 0;
        }
        else {
            this.writeLocation++;
        }

        // Before moving the write pointer, clear the oldest
        // data out of the buffer.
        for (let row = 0; row < this.keyCodes.length; row++) {
            this.bufferData[this.writeLocation][row] = '.';
        }
    }

    updateBuffers(midiData) {  
        // If we get new midiData, then write it to the buffer.
        // Note that this function only gets called when there is new midiData
        // so if no drums are being being hit, no data is added.      
        for(let row = 0; row < this.keyCodes.length; row++) {
            if(midiData[1] == this.midi.getNoteDown() && midiData[2] == this.keyCodes[row]) {
                this.bufferData[this.writeLocation][row] = 1;
            }
        }
    }

    reset() {
        for(let col = 0; col < this.numLocations; col++) {
            this.bufferData[col] = [];
            for(let row = 0; row < this.keyCodes.length; row++) {
                this.bufferData[col].push(".");
            }
        }
    }

    _drawBoundary(canvas, context) {
        context.strokeStyle = "#000000";
        context.lineWidth = 1;
        context.beginPath();
        context.rect(0, 0, canvas.width, canvas.height);
        context.stroke();
    }

    _drawVerticalTickMarks(canvas, context, drumHeads) {
        for(let row = 0; row < drumHeads.length; row++) {
            context.font = `${this.fontSize}px Arial`;
            context.fillStyle = "#000000";
            context.fillText(drumHeads[row].getName(), canvas.width - 65, (row*this.fontSize)+this.fontSize);

            context.beginPath(); 
            context.strokeStyle = "#dddddd";
            context.lineWidth = 1;
            context.moveTo(0, (row*this.fontSize)+this.fontSize);
            context.lineTo(canvas.width - 80, (row*this.fontSize)+this.fontSize);
            context.stroke();
        }
    }

    _drawHorizontalTickMarks(canvas, context) {
        context.beginPath();
        context.strokeStyle = "#000000";
        context.lineWidth = 1;
        context.moveTo(canvas.width - 80, canvas.height);
        context.lineTo(canvas.width - 80, canvas.height - canvas.height);
        context.stroke();
    }
}