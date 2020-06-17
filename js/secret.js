class Secret {
    constructor(){
        this.mapSource = ""
    }

    _ApiKeys = {
        googleMAP: "AIzaSyACfyPWJyg6g5ha1rtxGCYwMTz6D_UpPCs",
        otherAPI: "yet to provide",
    }
    get apiKey() {
        return this._ApiKeys
    }
    set apiKey(value) {
        this._ApiKeys = value
    }

}