//Taylor Zweigle, 2020
export class Parameters {
    constructor() {
        //Initialize to avoid json sync issues
        this.fontSize = 16;
        this.numAudioVerticalTickmarks = 4;
        this.numAudioHorizontalTickmarks = 20;
        this.numVerticalTickmarksIncrement = 30;
        this.waveformStyle = "#981e32";
        this.kickColor = "#000000";
        this.snareColor = "#40a8c4";
        this.tom1Color = "#ece34a";
        this.tom2Color = "#f7aa00";
        this.tom3Color = "#f07810";
        this.highHatColor = "#88dfac";
        this.crashColor = "#c50d66";
        this.rideColor = "#b336d1";
        this.midiBlockWidth = 15;
        this.labelPadding = 80; //Maximum string length of drum head name times font size (approx.)
    }

    getFontSize() { return this.fontSize; }
    getNumAudioVerticalTickmarks() { return this.numAudioVerticalTickmarks; }
    getNumAudioHorizontalTickmarks() { return this.numAudioHorizontalTickmarks; }
    getNumVerticalTickmarksIncrement() { return this.numVerticalTickmarksIncrement; }
    getWaveformStyle() { return this.waveformStyle; }
    getMidiBlockWidth() { return this.midiBlockWidth; }
    getLabelPadding() { return this.labelPadding; }

    getDrumColor(drumId) {
        let color = "";

        switch(drumId) {
            case "Kick": color = this.kickColor; break;
            case "Snare": color = this.snareColor; break;
            case "Tom1": color = this.tom1Color; break;
            case "Tom2": color = this.tom2Color; break;
            case "Tom3": color = this.tom3Color; break;
            case "HighHat": color = this.highHatColor; break;
            case "Crash": color = this.crashColor; break;
            case "Ride": color = this.rideColor; break;
        }

        return color;
    }

    update(json_data) {
        this.fontSize = json_data["fontSize"];
        this.numAudioVerticalTickmarks = json_data["numAudioVerticalTickmarks"];
        this.numAudioHorizontalTickmarks = json_data["numAudioHorizontalTickmarks"];
        this.numVerticalTickmarksIncrement = json_data["numVerticalTickmarksIncrement"];
        this.waveformStyle = json_data["waveformStyle"];
        this.kickColor = json_data["kickColor"];
        this.snareColor = json_data["snareColor"];
        this.tom1Color = json_data["tom1Color"];
        this.tom2Color = json_data["tom2Color"];
        this.tom3Color = json_data["tom3Color"];
        this.highHatColor = json_data["highHatColor"];
        this.crashColor = json_data["crashColor"];
        this.rideColor = json_data["rideColor"];
        this.midiBlockWidth = json_data["midiBlockWidth"];
        this.labelPadding = json_data["labelPadding"];
    }
}