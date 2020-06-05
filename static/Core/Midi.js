//Taylor Zweigle, 2020
export class Midi {
    constructor(instrument) {
        this.noteDown = 0;
        this.noteUp = 0;
        this.drumHeads = ["Kick", "Snare", "Tom1", "Tom2", "Tom3", "HighHat", "Crash", "Ride"];
        this.keyCodes = {};

        this._setDevice(instrument);
    }

    getNoteDown() { return this.noteDown; }
    getNoteUp() { return this.noteUp; }
    getDrumHeads() { return this.drumHeads; }

    getDrum(drumId) { 
        return {name: drumId, note: this.keyCodes[drumId]};
    }

    _setDevice(instrument) {
        if(instrument == "Piano") {
            this.keyCodes = {
                "Kick": [59],
                "Snare": [60],
                "Tom1": [62],
                "Tom2": [64],
                "Tom3": [65],
                "HighHat": [67],
                "Crash": [69],
                "Ride": [71]
            };
            this.noteDown = 144;
            this.noteUp = 128;
        }
        else if(instrument == "Drum") {
            this.keyCodes = {
                "Kick": [36],
                "Snare": [38, 40],
                "Tom1": [48, 50],
                "Tom2": [45, 47],
                "Tom3": [43, 58],
                "HighHat": [26, 46],
                "Crash": [49, 55],
                "Ride": [51, 59]
            };
            this.noteDown = 153;
            this.noteUp = 137;
        }
    }
}