//Taylor Zweigle, 2020
export class Parameters {
    constructor() {
        this.numVerticalTickmarks = 2;
        this.numHorizontalTickmarks = 2;
        this.waveformStyle = "#000000";
    }

    getNumVerticalTickmarks() {
        return this.numVerticalTickmarks;
    }

    getNumHorizontalTickmarks() {
        return this.numHorizontalTickmarks;
    }

    getWaveformStyle() {
        return this.waveformStyle;
    }

    update(json_data) {
        this.numVerticalTickmarks = json_data["numVerticalTickmarks"];
        this.numHorizontalTickmarks = json_data["numHorizontalTickmarks"];
        this.waveformStyle = json_data["waveformStyle"];
    }
}