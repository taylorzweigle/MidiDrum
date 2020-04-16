//Taylor Zweigle, 2020
export class TimelineDisplay {
    constructor(numVert, numHoriz, color) {
        this.audioDisplayData = [];
        this.bufferData = [];
        this.numLocations = 2048 * 10;
        this.writeLocation = 0;
        this.readLocation = 0;
        this.samples = 0;
        this.numSamplesPerFrame = 44100/60/128;
        this.autoScale = false;
        // The ADC is 16-bits, which is 0 to 65535.
        // But it is +/-, so the range is -32768 to 32767.
        // So, we assume that the actual max value will be about half of that.
        // And, in the rare case it exceeds, there is a clip function too.
        this.maxValue = 16384;
        this.numVerticalTickmarks = numVert;
        this.numHorizontalTickmarks = numHoriz;
        this.waveformStyle = color;
        
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

    draw(context, dimensions) {
        context.clearRect(0, dimensions["yLoc"], dimensions["width"], dimensions["height"]);
        this._drawVerticalTickMarks(context, dimensions);
        this._drawHorizontalTickMarks(context, dimensions);
        this._drawBorder(context, dimensions);
        this._drawTimeline(context, dimensions);
    }

    _drawTimeline(context, dimensions) {
        let scaledArray = [];
        this._buildTimelineBuffer();
        this._scaleWaveform(scaledArray, dimensions["height"]);
        this._drawWaveform(context, scaledArray, dimensions["yLoc"]);
    }

    _drawBorder(context, dimensions) {
        context.strokeStyle = "#000000";
        context.lineWidth = 1;
        context.beginPath();
        context.rect(0, dimensions["yLoc"], dimensions["width"], dimensions["height"]);
        context.stroke();
    }

    _drawWaveform(context, scaledArray, yLoc) {
        context.strokeStyle = this.waveformStyle;
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(0, (yLoc + scaledArray[0]));
        for(let col = 1; col < scaledArray.length; col++) {
            context.lineTo(col, (yLoc + scaledArray[col]));
        }
        context.stroke();
    }

    _drawVerticalTickMarks(context, dimensions) {
        let yLoc = dimensions["yLoc"];
        let width = dimensions["width"];
        let height = dimensions["height"];

        for(let inc = -this.numVerticalTickmarks; inc <= this.numVerticalTickmarks; inc++) {
            context.beginPath(); 
            context.strokeStyle = "#dddddd";
            context.lineWidth = 1;   
            context.moveTo(width, height/2 + (height/2)*inc/this.numVerticalTickmarks + yLoc);
            context.lineTo(0, height/2 + (height/2)*inc/this.numVerticalTickmarks + yLoc);
            context.stroke();

            context.beginPath(); 
            context.strokeStyle = "#000000";
            context.lineWidth = 1; 
            context.moveTo(width, height/2 + (height/2)*inc/this.numVerticalTickmarks + yLoc);
            context.lineTo(width - 10, height/2 + (height/2)*inc/this.numVerticalTickmarks + yLoc);
            context.stroke();
        }
    }

    _drawHorizontalTickMarks(context, dimensions) {
        let yLoc = dimensions["yLoc"];
        let width = dimensions["width"];
        let height = dimensions["height"];

        for(let inc = 0; inc <= this.numHorizontalTickmarks; inc++) {
            context.beginPath();
            context.strokeStyle = "#dddddd";
            context.lineWidth = 1;
            context.moveTo(width - ((width/this.numHorizontalTickmarks)*inc), height + yLoc);
            context.lineTo(width - ((width/this.numHorizontalTickmarks)*inc), height + yLoc - height);
            context.stroke();

            context.beginPath();
            context.strokeStyle = "#000000";
            context.lineWidth = 1;
            context.moveTo(width - ((width/this.numHorizontalTickmarks)*inc), height + yLoc);
            context.lineTo(width - ((width/this.numHorizontalTickmarks)*inc), height + yLoc - 10);
            context.stroke();
        }
    }

    _scaleWaveform(scaledArray, height) {
        if (this.autoScale == true) {
            let absArray = this.audioDisplayData.map(function(x) { return Math.abs(x); })
            this.maxValue = Math.max(...absArray);
        }

        // Scale by the max.
        for (let col = 0; col < this.audioDisplayData.length; col++) {
            scaledArray.push((this.audioDisplayData[col]/this.maxValue + 1)*height/2);
        }

        for (let col = 0; col < this.audioDisplayData.length; col++) {
            if (scaledArray[col] < 0) {
                scaledArray[col] = 0;
            }
            else if (scaledArray[col] > height) {
                scaledArray[col] = height;
            }
        }
    }

    _buildTimelineBuffer() {
        let notDone = true;

        let diffReadWrite = this.writeLocation - this.readLocation;
        if (diffReadWrite < 0) {
            diffReadWrite += this.numLocations;
        }

        // When restart the browser, the audio driver buffers a lot of data
        // and then that overflows the client because the client is only display
        // at 60/second no matter what. So, this is a temporary solution until
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
    }
}