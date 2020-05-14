//Taylor Zweigle, 2020
export class Drum {
    constructor(document, midi, drum) {
        this.midi = midi;
        this.note = drum.note;
        document.getElementById(drum.name).style.visibility = 'hidden';
        this.velocityRings = document.getElementsByClassName(`${drum.name}Ring`);
        this.count = 0;
        this.name = drum.name;
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
        if(dataRow[1] == this.midi.getNoteDown() && dataRow[2] == this.note) {
            this.count++;
            let breakVelocity = 128/this.velocityRings.length;
            for (let k = 0; k < this.velocityRings.length; k++) {
                if (dataRow[3] >= k*breakVelocity) {
                    this.velocityRings[k].style.visibility = "visible";
                }
            }
        }
        else if(dataRow[1] == this.midi.getNoteUp() && dataRow[2] == this.note) {
            for (let k = 0; k < this.velocityRings.length; k++) {
                this.velocityRings[k].style.visibility = "hidden";
            }
        }
    }
}