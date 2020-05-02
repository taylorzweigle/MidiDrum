//Taylor Zweigle, 2020
export class Drum {
    constructor(document, drumId, note) {
        this.note = note;
        document.getElementById(drumId).style.visibility = 'hidden';
        this.velocityRings = document.getElementsByClassName(`${drumId}Ring`);
        this.NOTE_DOWN = 144; //Keyboard 144, Drum 153
        this.NOTE_UP = 128;   //Keyboard 128, Drum 137
        this.count = 0;
        this.name = drumId;
        this.color = "#000000";
    }

    //Get class level parameters
    getCount() { return this.count; }
    getName() { return this.name; }
    getColor(parameters) {
        this.color = parameters.getDrumColor(this.name);
        return this.color;
    }

    clearCount() { 
        this.count = 0; 
    }

    setDrum(dataRow) {
        if(dataRow[1] == this.NOTE_DOWN && dataRow[2] == this.note) {
            this.count++;
            let breakVelocity = 128/this.velocityRings.length;
            for (let k = 0; k < this.velocityRings.length; k++) {
                if (dataRow[3] >= k*breakVelocity) {
                    this.velocityRings[k].style.visibility = "visible";
                }
            }
        }
        else if(dataRow[1] == this.NOTE_UP && dataRow[2] == this.note) {
            for (let k = 0; k < this.velocityRings.length; k++) {
                this.velocityRings[k].style.visibility = "hidden";
            }
        }
    }
}