class Secret {
    constructor(){
        this.mapSource = ""
    }

    _ApiKeys = {
        googleMAP: "AIzaSyAtXL9HlpCEfae66pSD6YcMZdQFRyQrTzM",
        otherAPI: "yet to provide",
    }
    get apiKey() {
        return this._ApiKeys
    }
    set apiKey(value) {
        this._ApiKeys = value
    }

}