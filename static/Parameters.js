//Taylor Zweigle, 2020
export class Parameters {
    constructor() {
        this.numVerticalTickmarks = 2;
        this.numHorizontalTickmarks = 2;
        this.waveformStyle = "#000000";
        this.kickColor = "#000000";
        this.snareColor = "#000000";
        this.tom1Color = "#000000";
        this.tom2Color = "#000000";
        this.tom3Color = "#000000";
        this.highHatColor = "#000000";
        this.crashColor = "#000000";
        this.rideColor = "#000000";
    }

    getNumVerticalTickmarks() { return this.numVerticalTickmarks; }
    getNumHorizontalTickmarks() { return this.numHorizontalTickmarks; }
    getWaveformStyle() { return this.waveformStyle; }

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
        this.numVerticalTickmarks = json_data["numVerticalTickmarks"];
        this.numHorizontalTickmarks = json_data["numHorizontalTickmarks"];
        this.waveformStyle = json_data["waveformStyle"];
        this.kickColor = json_data["kickColor"];
        this.snareColor = json_data["snareColor"];
        this.tom1Color = json_data["tom1Color"];
        this.tom2Color = json_data["tom2Color"];
        this.tom3Color = json_data["tom3Color"];
        this.highHatColor = json_data["highHatColor"];
        this.crashColor = json_data["crashColor"];
        this.rideColor = json_data["rideColor"];
    }
}