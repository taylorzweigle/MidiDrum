//Taylor Zweigle, Greg Zweigle, 2020
export class MidiDisplay {
    constructor(midi) {
        this.midi = midi;
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
            //TODO: Fix this check due to high hat having multiple key codes
            //if(midiData[1] == this.midi.getNoteDown() && this.note.includes(dataRow[2])) {
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

    draw(canvas, parameters, drumHeads) {
        let context = canvas.getContext("2d");

        context.clearRect(0, 0, canvas.width, canvas.height);

        this._drawCanvas(context, canvas.width, canvas.height, parameters, drumHeads);
        this._drawMidi(context, canvas.width, canvas.height, parameters);
    }

    _drawCanvas(context, width, height, parameters, drumHeads) {
        this._drawBoundary(context, width, height);
        this._drawVerticalTickMarks(context, width, height, parameters, drumHeads);
        this._drawHorizontalTickMarks(context, width, height, parameters);
    }

    _drawBoundary(context, width, height) {
        context.strokeStyle = "#5b5c5f";
        context.fillStyle = "#28292d";
        context.lineWidth = 1;
        context.beginPath();
        context.fillRect(5, 5, width - 10, height - 10);
        context.stroke();
    }

    _drawVerticalTickMarks(context, width, height, parameters, drumHeads) {
        let fontSize = parameters.getFontSize();
        let labelPadding = parameters.getLabelPadding();

        for(let row = 0; row < drumHeads.length; row++) {
            context.font = `${fontSize}px Arial`;
            context.fillStyle = "#ffffff";
            context.fillText(drumHeads[row].getName(), width - 70, (row*fontSize)+fontSize);

            context.beginPath(); 
            context.strokeStyle = "#5b5c5f";
            context.lineWidth = 1;
            context.moveTo(0, (row*fontSize)+fontSize);
            context.lineTo(width - labelPadding, (row*fontSize)+fontSize);
            context.stroke();
        }
    }

    _drawHorizontalTickMarks(context, width, height, parameters) {
        let labelPadding = parameters.getLabelPadding();

        context.beginPath();
        context.strokeStyle = "#ffffff";
        context.lineWidth = 1;
        context.moveTo(width - labelPadding, height);
        context.lineTo(width - labelPadding, 0);
        context.stroke();
    }

    _drawMidi(context, width, height, parameters) {
        let fontSize = parameters.getFontSize();
        let blockWidth = parameters.getMidiBlockWidth();
        let labelPadding = parameters.getLabelPadding();

        let col2 = this.writeLocation;

        for(let col = 0; col < this.numLocations; col++) {
            for(let row = 0; row < this.keyCodes.length; row++) {
                if(this.bufferData[col2][row] == 1) {
                    context.beginPath();
                    context.fillStyle = parameters.getDrumColor(this.drumHeads[row]);
                    context.fillRect(width - (col*5.74) - labelPadding - blockWidth, row*fontSize, blockWidth, fontSize);
                }
            }

            col2--;

            if (col2 < 0) {
                col2 = this.numLocations - 1;
            }
        }
    }
}