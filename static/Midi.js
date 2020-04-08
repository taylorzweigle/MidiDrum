//Taylor Zweigle
export class Midi {
    constructor() {
        this.midiData = [];
        this.numLocations = 20;
        this.readLocation = 0;
        this.writeLocation = 0;

        for(let len = 0; len < this.numLocations; len++) {
            this.midiData.push([0,0,0,0]);
        }
    }

    updateBuffers(input, numRows) {
        for(let row = 0; row < numRows; row++) {
            if(this.writeLocation == this.numLocations-1) {
                this.writeLocation = 0;
            }
            else {
                this.writeLocation++;
            }

            for(let col = 0; col < 4; col++) {
                this.midiData[this.writeLocation][col] = input[row][col];
            }
        }
    }

    bufferEmpty() {
        let isEmpty = false;

        if(this.readLocation == this.writeLocation) {
            isEmpty = true;
        }

        return isEmpty;
    }

    readBuffer(data) {
        if (this.readLocation == this.numLocations-1) {
            this.readLocation = 0;
        }
        else {
            this.readLocation++;
        }

        for(let col = 0; col < 4; col++) {
            data.push(this.midiData[this.readLocation][col]);
        }
    }
}