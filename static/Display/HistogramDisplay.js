//Taylor Zweigle, 2020
export class HistogramDisplay {
    constructor() {
        this.increment = 10;
    }

    draw(canvas, parameters, drumHeads) {
        let context = canvas.getContext("2d");
        let fontSize = parameters.getFontSize();

        context.clearRect(0, 0, canvas.width, canvas.height);

        this._drawCanvas(context, canvas.width, canvas.height, parameters);

        for(let k = 0; k < drumHeads.length; k++) {
            this._drawCountBar(context, canvas.width, canvas.height, parameters, drumHeads[k], (k)*fontSize);
        }
    }

    _drawCanvas(context, width, height, parameters) {
        this._drawBoundary(context, width, height);
        this._drawVerticalTickMarks(context, width, height, parameters);
    }

    _drawBoundary(context, width, height) {
        context.strokeStyle = "#000000";
        context.lineWidth = 1;
        context.beginPath();
        context.rect(0, 0, width, height);
        context.stroke();
    }

    _drawVerticalTickMarks(context, width, height, parameters) {
        let fontSize = parameters.getFontSize();
        let verticalTickmarksIncrement = parameters.getNumVerticalTickmarksIncrement();
        let labelPadding = parameters.getLabelPadding();

        let axisInc = 0;

        for(let inc = height - labelPadding; inc > verticalTickmarksIncrement; inc -= verticalTickmarksIncrement) {
            context.font = `${fontSize}px Arial`;
            context.fillStyle = "#000000";
            context.fillText(verticalTickmarksIncrement/this.increment*axisInc, 10, inc);

            context.beginPath(); 
            context.strokeStyle = "#dddddd";
            context.lineWidth = 1;   
            context.moveTo(fontSize * 3, inc);
            context.lineTo(width, inc);
            context.stroke();

            axisInc++;
        }

        context.beginPath();
        context.strokeStyle = "#000000";
        context.lineWidth = 1;   
        context.moveTo(fontSize * 3, height - labelPadding);
        context.lineTo(width, height - labelPadding);
        context.stroke();
    }

    _drawCountBar(context, width, height, parameters, drumHead, yLoc) {
        let fontSize = parameters.getFontSize();
        let verticalTickmarksIncrement = parameters.getNumVerticalTickmarksIncrement();
        let labelPadding = parameters.getLabelPadding();

        context.rotate(-90 * Math.PI / 180);
        context.font = `${fontSize}px Arial`;
        context.fillStyle = "#000000";
        context.fillText(drumHead.getName(), -height + 10, (fontSize * 5) + (2 * yLoc));
        context.rotate(90 * Math.PI / 180);

        context.beginPath();
        context.fillStyle = drumHead.getColor(parameters);
        context.fillRect((fontSize * 5) + (2 * yLoc) - fontSize, height - labelPadding, fontSize,  drumHead.getCount() * -this.increment);

        if(height - labelPadding - drumHead.getCount() * this.increment < verticalTickmarksIncrement) { 
            this.increment /= 2;
        }
    }
}