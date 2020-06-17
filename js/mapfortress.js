class MapFortress extends Restaurant {
  constructor() {
    super();
    this.mapCenter = {};
    this.map = null;
    // this.marker = null;
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
  initMap(mapDIV) {
    this.mapZoom = 15;
    this.lat = 48.79623;
    this.lng = 2.37058;

    // map position
    this.mapCenter = { lat: this.lat, lng: this.lng };

    // set map to a new google map object
    let _map = MapFortress.createMap(mapDIV, this.mapCenter, this.mapZoom);
    this.map = _map;
    
    // set the map marker
    let _marker = MapFortress.addMarker(_map, this.lat, this.lng);
  }

  static propagateMarker(_map) {
    // load map data from the fake json restaurant file using jQuery AJAX calls
    $.ajax({
      type: "GET",
      url: "/js/fakerestaurants.json",
      dataType: "json",
      async: true,
      success: (data, status) => {
        if (status === "success") {
          // loop through the json file to add the markers
          data.forEach((item) => {
            let _marka = MapFortress.addMarker(
              _map,
              item.lat,
              item.long,
              item.restaurantName,
              item.ratings.stars
            );
          });
        }
      },
      error: (xhr) => {
        // map position and zoom level
        this.mapCenter = { lat: 48.8737815, lng: 2.3501649 };
        this.lat = this.mapCenter.lat;
        this.lng = this.mapCenter.lng;

        this.mapZoom = 12;

        // set _map to a new google map object
        this.map = MapFortress.createMap(mapDIV, this.mapCenter, this.mapZoom);

        // set the map marker
        this.marker = MapFortress.addMarker(this.map, this.lat, this.lng);

        const msg = `Error: ${xhr.status} -> File not found. Default map setting is loaded`;
        console.log("MapFortress -> initMap -> xhr", msg);
      },
    });
  }

  /**
   * Creates the google map object and sets it initial properties
   * @param {*} mapDIV
   * @param {*} mapCenter
   * @param {*} mapZoom
   */
  static createMap(mapDIV, mapCenter, mapZoom) {
    let _map = new google.maps.Map(mapDIV, {
      center: mapCenter,
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
  static addMarker = (_map, _lat, _long, _title, _stars) => {
    let _marker = new google.maps.Marker({
      position: new google.maps.LatLng(_lat, _long),
      map: _map,
      title: _title,
      rating: _stars,
      animation: google.maps.Animation.BOUNCE,
    });

    return _marker;
  };

  createNewPlace = () => {};

  loadPlaces = () => {};
}
