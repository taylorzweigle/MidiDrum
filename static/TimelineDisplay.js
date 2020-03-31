export class TimelineDisplay {
    constructor() {
        let audioDisplayData = [];
    }

    resizeTimeline(width) {
        this.audioDisplayData = [];
        for(let i = 0; i < width; i++) { this.audioDisplayData.push(0); }
    }

    saveAudioData(audio_input, audio_rows) {
        for(let row = 0; row < audio_rows; row++) {
            for(let col = 0; col < audio_input[0].length; col++) {
                this.audioDisplayData.shift();
                this.audioDisplayData.push(audio_input[row][col]);
            }
        }
    }

    drawTimeline(context, yLoc, width, height) {
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