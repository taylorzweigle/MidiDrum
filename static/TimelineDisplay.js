export class TimelineDisplay {
    constructor() {
        let audioDisplayData = [];
    }

    resizeTimeline(width) {
        this.audioDisplayData = [];
        for(let i = 0; i < width; i++) { this.audioDisplayData.push(0); }
    }

    saveAudioData(audio_left, width) {
        for(let row = 0; row < audio_left.length; row++) {
            if(audio_left[row][0] != 0) {
                for(let col = 0; col < audio_left[0].length; col++) {
                    if(this.audioDisplayData.length >= width) {
                        this.audioDisplayData.shift();
                    }
                    this.audioDisplayData.push(audio_left[row][col]);
                }
            }
            else { break; }
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