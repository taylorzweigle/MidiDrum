export class Drum {
    constructor(drumId, note) {
        this.drumId = drumId;
        this.note = note
        this.graphicVisibilityState = false;
        this.drumId.style.visibility = "hidden";
        this.NOTE_DOWN = 144;
        this.NOTE_UP = 128;
    }

    setDrum(dataRow) {
        if(dataRow[1] == this.NOTE_DOWN && dataRow[2] == this.note) {
            this.graphicVisibilityState = true;
            this.drumId.style.visibility = "visible";
        }
        else if(dataRow[1] == this.NOTE_UP && dataRow[2] == this.note) {
            this.graphicVisibilityState = false;
            this.drumId.style.visibility = "hidden";
        }
        else {
            if (this.graphicVisibilityState == true) {
                this.drumId.style.visibility = "visible";
            }
            else {
                this.drumId.style.visibility = "hidden";
            }
        }
    }
}