//Taylor Zweigle, 2020
export class VelocityDisplay {
    constructor() {
        this.lastVelocity = {
            "Kick": 0,
            "Snare": 0,
            "Tom1": 0,
            "Tom2": 0,
            "Tom3": 0,
            "HighHat": 0,
            "Crash": 0,
            "Ride": 0,
        };
        this.lastOpacity = {
            "Kick": 1.0,
            "Snare": 1.0,
            "Tom1": 1.0,
            "Tom2": 1.0,
            "Tom3": 1.0,
            "HighHat": 1.0,
            "Crash": 1.0,
            "Ride": 1.0,
        };
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
        context.strokeStyle = "#5b5c5f";
        context.fillStyle = "#28292d";
        context.lineWidth = 1;
        context.beginPath();
        context.fillRect(0, 0, width, height);
        context.stroke();
    }

    _drawVerticalTickMarks(context, width, height, parameters) {
        let fontSize = parameters.getFontSize();
        let verticalTickmarksIncrement = parameters.getNumVerticalTickmarksIncrement();
        let labelPadding = parameters.getLabelPadding();

        let axisInc = 0;

        for(let inc = height - labelPadding; inc > verticalTickmarksIncrement; inc -= verticalTickmarksIncrement) {
            context.font = `${fontSize}px Arial`;
            context.fillStyle = "#ffffff";
            context.fillText(axisInc * 16, 10, inc);

            context.beginPath(); 
            context.strokeStyle = "#5b5c5f";
            context.lineWidth = 1;   
            context.moveTo(fontSize * 3, inc);
            context.lineTo(width - 20, inc);
            context.stroke();

            axisInc++;
        }

        context.beginPath();
        context.strokeStyle = "#ffffff";
        context.lineWidth = 1;   
        context.moveTo(fontSize * 3, height - labelPadding);
        context.lineTo(width - 20, height - labelPadding);
        context.stroke();
    }

    _drawCountBar(context, width, height, parameters, drumHead, yLoc) {
        let fontSize = parameters.getFontSize();
        let labelPadding = parameters.getLabelPadding();
        let name = drumHead.getName();
        let velocity = drumHead.getVelocity();

        context.rotate(-90 * Math.PI / 180);
        context.font = `${fontSize}px Arial`;
        context.fillStyle = "#ffffff";
        context.fillText(drumHead.getName(), -height + 10, (fontSize * 4.3) + (2 * yLoc));
        context.rotate(90 * Math.PI / 180);

        context.beginPath();

        if(this.lastVelocity[name] != velocity) {
            this.lastOpacity[name] = 1.0;
        }
        else {
            if(this.lastOpacity[name] > 0) {
                this.lastOpacity[name] = this.lastOpacity[name] - 0.05;
            }
            else {
                this.lastOpacity[name] = 0.0;
            }
        }

        context.fillStyle = this._convertHEXToRGB(drumHead.getColor(parameters), this.lastOpacity[name]);
        context.fillRect((fontSize * 4.3) + (2 * yLoc) - fontSize, height - labelPadding, fontSize, (240 / 128) * -velocity);
    
        this.lastVelocity[name] = velocity;
    }

    //Take the first two string values from the hex and append it to the
    //string '0x' to convert to a hexidecimal number which in return has
    //an integer associated with it. When returning that value, and converting
    //to an integer, you get the representative integer. For example, 0xff = 255. 
    _convertHEXToRGB(hex, opacity) {
        let r = "0x" + hex[1] + hex[2];
        let g = "0x" + hex[3] + hex[4];
        let b = "0x" + hex[5] + hex[6];
        let a = opacity;

        return "rgba(" + +r + "," + +g + "," + +b + "," + a + ")";
    }
}