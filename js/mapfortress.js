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
    this.mapZoom = 0;
    this.infoWindow;
  }

  /**
   * Initializes the map object when passed with the div element and returns the map object
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

    return this.map;
  }

  /**
   * Reads a `JSON` object and propagates it's `lat` and `lng` values on the map which
   * is passed to it's call else it propagates a default marker
   * @param {*} _map
   */
  propagateMarker(_map) {
    // load map data from the fake json restaurant file using jQuery AJAX calls
    const jsonData = this.getRestaurantsJSON();

    if (jsonData.length > 0) {
      let markerArray = [];
      for (let i = 0; i < jsonData.length; i++) {
        let latLng = new google.maps.LatLng(jsonData[i].lat, jsonData[i].long);

        let _lat = jsonData[i].lat;
        let _lng = jsonData[i].long;
        let _name = jsonData[i].restaurantName;
        let _ratings = jsonData[i].ratings;
        let _stars = 0;

        // get the ratings value from the ratings array and retrieve the stars
        Object.keys(_ratings).map(function (key) {
          _stars = _ratings[key]["stars"];
        });

        const _marker = this.addMarker(_map, _lat, _lng, _name, _stars);

        // set a global variable for markers
        markerArray.push(_marker);

        mapFortress.displayReviews(
          jsonData[i].ratings,
          i,
          _name,
          jsonData[i].address,
          jsonData.length,
          _lat,
          _lng
        );
      }

      window.markerGLOBAL = markerArray;
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
   * Creates a new map object and returns it passed on the passed parameters
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
   * Returns a marker object after creating it using the parsed parameters
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


  static bis = (ele) => {
   this.filterMarkerByStars(ele)
  }

  static filterMarkerByStars(_htmlElement) {

    // retrieve the selected element value from the value attribute
    const filterType = $(_htmlElement).attr("value");

    let mkr = window.markerGLOBAL;

    $.each(mkr, (index, marker) => {
      let star = marker.rating;
      if (filterType === "type0") {
        if (star <= 2) {
          marker.setVisible(true);
        } else {
          marker.setVisible(false);
        }
      }

      if (filterType === "type1") {
        if (star > 2 && star <= 4) {
          marker.setVisible(true);
        } else {
          marker.setVisible(false);
        }
      }

      if (filterType === "type2") {
        if (star == 4) {
          marker.setVisible(true);
        } else {
          marker.setVisible(false);
        }
      }

      if (filterType === "type3") {
        if (star == 5) {
          marker.setVisible(true);
        } else {
          marker.setVisible(false);
        }
      }

      if (filterType === "type4") {
        marker.setVisible(true);
      }

    });
  }


  /**
   * Gets the current user `Geolocation` when passed with the map object. This is achieved only when the user accepts
   * the prompt from Geolocation wanting to know the user location
   * @param {*} _map
   */
  getCurrentUserLocation(_map) {
    this.infoWindow = new google.maps.InfoWindow();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (userPosition) => {
          let position = {
            lat: userPosition.coords.latitude,
            lng: userPosition.coords.longitude,
          };

          this.infoWindow.setPosition(position);

          // show the current user location with a different color marker
          this.marker = this.addMarker(_map, position.lat, position.lng);
          this.marker.setIcon(
            new google.maps.MarkerImage(
              "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
            )
          );
          this.marker.icon.scaledSize = new google.maps.Size(50, 50);
          this.marker.setAnimation(google.maps.Animation.BOUNCE);
          this.marker.setTitle("U are here");

          this.infoWindow.setContent("User location found successfully.");
          this.infoWindow.open(_map);
          _map.setCenter(position);
        },
        () => {
          this.handleLocationError(true, this.infoWindow, _map.getCenter());
        }
      );
    } else {
      // browser doe not support google Geolocation
      this.handleLocationError(false, this.infoWindow, _map.getCenter());
    }
  }

  /**
   * Error handling message to indicate if a `User's` was successfully Geolocated or not and shows the appropriate error message
   * @param {*} browserHasGeolocation
   * @param {*} infoWindow
   * @param {*} position
   */
  handleLocationError(browserHasGeolocation, infoWindow, position) {
    infoWindow.setPosition(position);
    infoWindow.setContent(
      browserHasGeolocation
        ? "Error: Geolocation failed."
        : "Error: Your browser does not support geolocation."
    );
    infoWindow.open(this.map);
  }

  createNewPlace = () => {};

  loadPlaces = () => {};
}
