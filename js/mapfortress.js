class MapFortress extends Restaurant {
  constructor() {
    super();
    this.mapCenter = {};
    this.map;
    this.marker;
    this.newPlace = null;
    this.geoMetry = null;
    this.newCenter = {};
    this.activePlace = {};
    this.mapMarkers = [];
    this.mapZoom = 0;
  }

  /**
   * Initializes the map object when passed with the div element
   * @param {*} mapDIV
   */
  initializeMap(mapDIV) {
    this.mapZoom = 10;
    this.lat = 48.8737815;
    this.lng = 2.3501649;

    // map position
    this.mapCenter = { lat: this.lat, lng: this.lng };

    // set map to a new google map object
    this.map = this.createMap(mapDIV, this.mapCenter, this.mapZoom);

    // set the map marker
    this.marker = this.addMarker(this.map, this.lat, this.lng);

    // MapFortress.propagateMarker(this.map);

    return this.map;
  }

  propagateMarker(_map) {
    // load map data from the fake json restaurant file using jQuery AJAX calls
    const jsonMarkers = this.getJSON();

    if (jsonMarkers.length > 0) {
      for (let i = 0; i < jsonMarkers.length; i++) {
        let latLng = new google.maps.LatLng(
          jsonMarkers[i].lat,
          jsonMarkers[i].long
        );

        const marker = new google.maps.Marker({
          position: latLng,
          map: _map,
          title: jsonMarkers[i].restaurantName,
        });
      }
    } else {

      // map position and zoom level
      this.mapCenter = { lat: 48.8737815, lng: 2.3501649 };
      this.lat = this.mapCenter.lat;
      this.lng = this.mapCenter.lng;

      this.mapZoom = 12;

      // set _map to a new google map object
      this.map = this.createMap(mapDIV, this.mapCenter, this.mapZoom);

      // set the map marker
      this.marker = this.addMarker(this.map, this.lat, this.lng);
    }
  }

  /**
   * Creates the google map object and sets it initial properties
   * @param {*} mapDIV
   * @param {*} mapCenter
   * @param {*} mapZoom
   */
  createMap(mapDIV, mapCenter, mapZoom) {
    let _map = new google.maps.Map(mapDIV, {
      center: new google.maps.LatLng(mapCenter.lat, mapCenter.lng),
      zoom: mapZoom,
    });

    return _map;
  }

  /**
   * Add a new marker to the existing map
   * @param {*} _map
   * @param {*} _lat
   * @param {*} _long
   */
  addMarker(_map, _lat, _long, _title, _stars) {
    let _marker = new google.maps.Marker({
      position: new google.maps.LatLng(_lat, _long),
      map: _map,
      title: _title,
      rating: _stars,
      animation: google.maps.Animation.DROP,
    });

    return _marker;
  }

  createNewPlace = () => {};

  loadPlaces = () => {};

  /**
   * Returns a json file for fake restaurants, used for testing purposes
   */
  getJSON() {
    var json = [
      {
        restaurantName: "Bronco",
        address: "39 Rue des Petites Écuries, 75010 Paris",
        lat: 48.8737815,
        long: 2.3501649,
        ratings: [
          {
            stars: 4,
            comment: "Great! But not many veggie options.",
          },
          {
            stars: 5,
            comment: "My favorite restaurant!",
          },
        ],
      },
      {
        restaurantName: "Babalou",
        address: "4 Rue Lamarck, 75018 Paris",
        lat: 48.8865035,
        long: 2.3442197,
        ratings: [
          {
            stars: 5,
            comment: "Tiny pizzeria next to Sacre Coeur!",
          },
          {
            stars: 3,
            comment: "Meh, it was fine.",
          },
        ],
      },
      {
        restaurantName: "Bismark Foods",
        address: "5 Rue du Lion d'Or, 94400 Paris",
        lat: 48.79623,
        long: 2.37058,
        ratings: [
          {
            stars: 5,
            comment: "A cool joint for the friends and family!",
          },
          {
            stars: 3,
            comment: "I will always be here to chill small.",
          },
        ],
      },
    ];

    return json;
  }
}
