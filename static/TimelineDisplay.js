//Taylor Zweigle
export class TimelineDisplay {
    constructor() {
        this.audioDisplayData = [];
        this.bufferData = [];
        this.numLocations = 2048 * 10;
        this.writeLocation = 0;
        this.readLocation = 0;
        this.samples = 0;
        this.numSamplesPerFrame = 44100/60/128; //TODO get values from client
        for (let k = 0; k < this.numLocations; k++) {
            this.bufferData.push(0);
        }
    }

    resizeTimeline(width) {
        this.audioDisplayData = [];
        for(let i = 0; i < width; i++) { this.audioDisplayData.push(0); }
    }

    updateBuffers(audioInput) {
        for(let ind = 0; ind < audioInput.length; ind++) {
            if (this.writeLocation == this.numLocations-1) {
                this.writeLocation = 0;
            }
            else {
                this.writeLocation++;
            }
            this.bufferData[this.writeLocation] = audioInput[ind];
        }
    }

    clearBuffers() {
        this.bufferData = [];
    }

    drawTimeline(context, yLoc, width, height) {
        let notDone = true;

        let diffReadWrite = this.writeLocation - this.readLocation;
        if (diffReadWrite < 0) {
            diffReadWrite += this.numLocations;
        }

        // When restart the browser, the audio driver buffers a lot of data
        // and then that overflows the client because the client is only display
        // at 60/second no matter what.  So, this is a temporary solution until
        // we can make the audio driver better.
        if (diffReadWrite > 50) {
            this.readLocation = this.writeLocation;
        }

        while(notDone) {
            if (this.readLocation == this.writeLocation) {
                break;
            } 
            else {
                this.audioDisplayData.shift();
                this.audioDisplayData.push(this.bufferData[this.readLocation]);
                if (this.readLocation == this.numLocations-1) {
                    this.readLocation = 0;
                }
                else {
                    this.readLocation++;
                }
            }

            this.samples += 1/this.numSamplesPerFrame;
            if (this.samples >= 1) {
                this.samples -= 1;
                notDone = false;
            } 
        }

        // Get data from bufferData and put into audioDisplayData.
        context.clearRect(0, yLoc, width, height);
        context.strokeStyle = "#000000";
        context.lineWidth = 1;
        context.beginPath();
        let xLoc = 0;
        context.moveTo(xLoc, (yLoc + this.audioDisplayData[0] / 100) + (height / 2));
        for(let col = 1; col < this.audioDisplayData.length; col++) {
            xLoc += 1;
            context.lineTo(xLoc, (yLoc + this.audioDisplayData[col] / 100) + (height / 2));
        }
        context.stroke();
    }
}