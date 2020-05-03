//Taylor Zweigle, 2020
export class HistogramDisplay {
    constructor() {
        this.xAxisFontSize = 16;
        this.yAxisFontSize = 14;
        this.numVerticalTickmarksIncrement = 30;
        this.increment = 10;
    }

    drawHistogram(canvas, parameters, drumHeads) {
        let context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);

        this._drawBoundary(canvas, context);
        this._drawVerticalTickMarks(canvas, context);

        for(let k = 0; k < drumHeads.length; k++) {
            this._drawCountBar(canvas, context, parameters, drumHeads[k], (k)*this.xAxisFontSize);
        }
    }

    _drawBoundary(canvas, context) {
        context.strokeStyle = "#000000";
        context.lineWidth = 1;
        context.beginPath();
        context.rect(0, 0, canvas.width, canvas.height);
        context.stroke();
    }

    _drawVerticalTickMarks(canvas, context) {
        let axisInc = 0;

        for(let inc = canvas.height - 90; inc > this.numVerticalTickmarksIncrement; inc -= this.numVerticalTickmarksIncrement) {
            context.font = `${this.yAxisFontSize}px Arial`;
            context.fillStyle = "#000000";
            context.fillText(this.numVerticalTickmarksIncrement/this.increment*axisInc, 10, inc);

            context.beginPath(); 
            context.strokeStyle = "#dddddd";
            context.lineWidth = 1;   
            context.moveTo(this.yAxisFontSize * 3, inc);
            context.lineTo(canvas.width, inc);
            context.stroke();

            axisInc++;
        }
    }

    _drawCountBar(canvas, context, parameters, drumHead, yLoc) {
        context.rotate(-90 * Math.PI / 180);
        context.font = `${this.xAxisFontSize}px Arial`;
        context.fillStyle = "#000000";
        context.fillText(drumHead.getName(), -canvas.height + 20, (this.yAxisFontSize * 5) + (2 * yLoc));
        context.rotate(90 * Math.PI / 180);

        context.beginPath();
        context.fillStyle = drumHead.getColor(parameters);
        context.fillRect((this.yAxisFontSize * 5) + (2 * yLoc) - this.xAxisFontSize, canvas.height - 90, this.xAxisFontSize,  drumHead.getCount() * -this.increment);

        if(canvas.height - 90 - drumHead.getCount() * this.increment < this.numVerticalTickmarksIncrement) { 
            this.increment /= 2;
        }
    }
}