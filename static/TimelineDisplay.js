//Taylor Zweigle, 2020
export class TimelineDisplay {
    constructor() {
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
        this.numVerticalTickmarks = 4;
        this.numHorizontalTickmarks = 20;
        this.waveformStyle = "#981e32";
        
        for (let k = 0; k < this.numLocations; k++) {
            this.bufferData.push(0);
        }

        for(let i = 0; i < 1263; i++) {
            this.audioDisplayData.push(0);
        }
    }

    updateBuffers(audioInputLeft, audioInputRight) {
        let averageBuffer = [];

        this._averageBuffers(averageBuffer, audioInputLeft, audioInputRight);

        for(let ind = 0; ind < averageBuffer.length; ind++) {
            if (this.writeLocation == this.numLocations-1) {
                this.writeLocation = 0;
            }
            else {
                this.writeLocation++;
            }

            this.bufferData[this.writeLocation] = averageBuffer[ind];
        }
    }

    draw(canvas) {
        let context = canvas.getContext("2d");

        context.clearRect(0, 0, canvas.width, canvas.height);

        this._drawCanvas(context, 0, canvas.width, canvas.height);
        this._drawWaveform(context, 0, canvas.width, canvas.height);
    }

    _drawCanvas(context, yLoc, width, height) {
        this._drawVerticalTickMarks(context, yLoc, width, height);
        this._drawHorizontalTickMarks(context, yLoc, width, height);
        this._drawBoundary(context, yLoc, width, height);
    }

    _drawWaveform(context, yLoc, width, height) {
        let scaledArray = [];
        this._buildTimelineBuffer();
        this._scaleWaveform(scaledArray, height);
        
        context.strokeStyle = this.waveformStyle;
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(0, (yLoc + scaledArray[0]));
        for(let col = 1; col < scaledArray.length - 80; col++) {
            context.lineTo(col, (yLoc + scaledArray[col]));
        }
        context.stroke();
    }

    _drawBoundary(context, yLoc, width, height) {
        context.strokeStyle = "#000000";
        context.lineWidth = 1;
        context.beginPath();
        context.rect(0, yLoc, width, height);
        context.stroke();
    }

    _drawVerticalTickMarks(context, yLoc, width, height) {
        for(let inc = -this.numVerticalTickmarks; inc <= this.numVerticalTickmarks; inc++) {
            context.beginPath(); 
            context.strokeStyle = "#dddddd";
            context.lineWidth = 1;   
            context.moveTo(width-80, height/2 + (height/2)*inc/this.numVerticalTickmarks + yLoc);
            context.lineTo(0, height/2 + (height/2)*inc/this.numVerticalTickmarks + yLoc);
            context.stroke();

            context.beginPath(); 
            context.strokeStyle = "#000000";
            context.lineWidth = 1; 
            context.moveTo(width - 80, height/2 + (height/2)*inc/this.numVerticalTickmarks + yLoc);
            context.lineTo(width - 80 - 10, height/2 + (height/2)*inc/this.numVerticalTickmarks + yLoc);
            context.stroke();
        }
    }

    _drawHorizontalTickMarks(context, yLoc, width, height) {
        for(let inc = 0; inc <= this.numHorizontalTickmarks; inc++) {
            context.beginPath();
            context.strokeStyle = "#dddddd";
            context.lineWidth = 1;
            context.moveTo(width - 80 - (((width - 80)/this.numHorizontalTickmarks)*inc), height + yLoc);
            context.lineTo(width - 80 - (((width - 80)/this.numHorizontalTickmarks)*inc), height + yLoc - height);
            context.stroke();

            context.beginPath();
            context.strokeStyle = "#000000";
            context.lineWidth = 1;
            context.moveTo(width - 80 - (((width - 80)/this.numHorizontalTickmarks)*inc), height + yLoc);
            context.lineTo(width - 80 - (((width - 80)/this.numHorizontalTickmarks)*inc), height + yLoc - 10);
            context.stroke();
        }

        context.beginPath();
        context.strokeStyle = "#000000";
        context.lineWidth = 1;
        context.moveTo(width - 80, height + yLoc);
        context.lineTo(width - 80, height + yLoc - height);
        context.stroke();
    }

    _averageBuffers(averageBuffer, audioInputLeft, audioInputRight) {
        if(audioInputLeft.length == audioInputRight.length) {
            for(let i = 0; i < audioInputLeft.length; i++) {
                averageBuffer[i] = ((audioInputLeft[i] + audioInputRight[i]) / 2);
            }
        }
        else { 
            console.log("ERROR: MISMATCH LENGTH");
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

            this.samples += 1/this.numSamplesPerFrame; //44100/60/128 = 5.74samples, 1183px 
            if (this.samples >= 1) {
                this.samples -= 1;
                notDone = false;
            } 
        }
    }
}