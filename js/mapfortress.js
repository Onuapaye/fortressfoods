class MapFortress extends Restaurant {
  constructor() {
    super();
    this.mapCenter = {};
    this.map;
    this.marker;
    this.newPlace = null;
    this.geometry = null;
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
  
    this.lat = 48.8737815;
    this.lng = 2.3501649;
    this.mapZoom = 15;

    // map position
    this.mapCenter = { lat: this.lat, lng: this.lng };

    // set map to a new google map object
    this.map = this.createMap(mapDIV, this.mapCenter, this.mapZoom);

    // set the map marker
    this.marker = this.createMarker(this.map, this.lat, this.lng);

    return this.map;
  }

  /**
   * Loads data from a local `JSON Object` and populate their respective `markers`
   * on the `map` and it takes the `Google Map Object` as it's parameter
   * @param {*} _map 
   */
  loadOfflinePlaces(_map){
    // load map data from the fake json restaurant file using jQuery AJAX calls
    const _localRestaurants = this.getLocalRestaurantsFromJSON();
    let markerArray = [];

    if (_localRestaurants.length > 0) {

      for (let i = 0; i < _localRestaurants.length; i++) {

        this.lat = _localRestaurants[i].lat;
        this.lng = _localRestaurants[i].long;
        this.name = _localRestaurants[i].restaurantName;
        let _ratings = _localRestaurants[i].ratings;

        let _totalRatingsArrayCount = _localRestaurants[i].ratings.length;
        let _totalStars = 0;

        // get the ratings value from the ratings array and retrieve the stars
        Object.keys(_ratings).map(function (key) {
          _totalStars += _ratings[key]["stars"];
        });

        // divide the total stars by the total stars count to get the average rating
        this.stars = (_totalStars / _totalRatingsArrayCount)

        // create markers
        this.marker = this.createMarker(_map, this.lat, this.lng);
        this.marker.title = this.name;
        this.marker.rating = this.stars;
        this.marker.animation = google.maps.Animation.DROP;

        //push individual markers into the markers array
        markerArray.push(this.marker);
      }
    }

    window.markerGLOBAL = markerArray;
  }

  /**
   * Loads all places of restaurants from `Google Places API` and populates them on the `map`
   * with their respective `markers` and it takes the `Google Map Object` as it's parameter
   * @param {*} _map 
   */
  loadOnlinePlaces(_map) {

    let _placesService = new google.maps.places.PlacesService(_map);

    // check if geolocation is enables by the user
    if (navigator.geolocation) {
      
      // retrieve the current user position or coordinates and pass it as the places location  
      navigator.geolocation.getCurrentPosition((userPosition) => {

        let _location = new google.maps.LatLng(userPosition.coords.latitude, userPosition.coords.longitude);

        const _requestOptions = {
          location: _location,
          radius: "1500",
          type: ["restaurant"],
        };

        _placesService.nearbySearch(
            _requestOptions,
          (results, status) => {

            if (status === google.maps.places.PlacesServiceStatus.OK) {

              let markerArray = [];
                
              for (let i = 0; i < results.length; i++) {

                this.geometry = { lat: results[i].geometry.location.lat(), lng: results[i].geometry.location.lng()}
                this.marker = this.createMarker(_map, this.geometry.lat, this.geometry.lng);
                this.marker.title = results[i].name;
                this.marker.rating = results[i].rating;

                // push individual markers into the array of markers
                markerArray.push(this.marker);
              }            
              // assign the markers the global markers variable
              window.markerGLOBAL = markerArray;
              
              // set the center of the map to user position
              _map.setCenter(_location);
            }
          }
        );
      });
    } else {
      // loads only the local json restaurant if user location is not found
      window.markerGLOBAL = this.loadOfflinePlaces(_map);
    }
  }

  /**
   * Reads a `JSON` object and propagates it's `lat` and `lng` values on the map which
   * is passed to it's call else it propagates a default marker
   * @param {*} _map
   */
  propagateMarker(_map) {
    // load map data from the fake json restaurant file using jQuery AJAX calls
    const jsonData = this.getLocalRestaurantsFromJSON();

    if (jsonData.length > 0) {

      // let markerArray = [];

      // for (let i = 0; i < jsonData.length; i++) {

      //   this.lat = jsonData[i].lat;
      //   this.lng = jsonData[i].long;
      //   this.name = jsonData[i].restaurantName;
      //   let _ratings = jsonData[i].ratings;

      //   // let _ratingStars = 0;
      //   let _totalCount = jsonData[i].ratings.length;
      //   let _totalStars = 0;

      //   // get the ratings value from the ratings array and retrieve the stars
      //   Object.keys(_ratings).map(function (key) {
      //     _totalStars += _ratings[key]["stars"];
      //   });

      //   // divide the total stars by the total stars count to get the average rating
      //   this.stars = (_totalStars / _totalCount)

      //   // create markers
      //   const _marker = this.createMarker(_map, this.lat, this.lng);
      //   console.log("MapFortress -> propagateMarker -> _marker", _marker)
      //   _marker.title = this.name;
      //   _marker.rating = this.stars;
      //   _marker.animation = google.maps.Animation.DROP;

      //   //push individual markers into the markers array
      //   markerArray.push(_marker);

        //display the reviews
        // mapFortress.displayReviews(
        //   jsonData[i].ratings,
        //   i,
        //   this.name,
        //   jsonData[i].address,
        //   jsonData.length,
        //   this.lat,
        //   this.lng
        // );
      // }

      // set the global markers variable to the value from the markers array
      // window.markerGLOBAL = this.loadLocalPlaces(_map);
    } else {
      // map position and zoom level
      this.mapCenter = { lat: 48.8737815, lng: 2.3501649 };
      this.lat = this.mapCenter.lat;
      this.lng = this.mapCenter.lng;

      this.mapZoom = 12;

      // set _map to a new google map object
      this.map = this.createMap(mapDIV, this.mapCenter, this.mapZoom);

      // set the map marker
      this.marker = this.createMarker(this.map, this.lat, this.lng);
      this.marker.title = _name;
      this.marker.rating = _stars;
      this.marker.animation = google.maps.Animation.DROP;
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
      zIndex: 1
    });

    return _map;
  }

  /**
   * Returns a marker object after creating it using the parsed parameters
   * @param {*} _map
   * @param {*} _lat
   * @param {*} _long
   */
  createMarker(_map, _lat, _lng) {
    let _marker = new google.maps.Marker({
      position: new google.maps.LatLng(_lat, _lng),
      map: _map,
      animation: google.maps.Animation.DROP
    });

    console.log("MapFortress -> createMarker -> _marker", _marker)
    return _marker;
  }

  /**
   * Filters markers on the map base on ratings (number of stars) and displays or hides them
   * @param {*} _htmlElement 
   */
  static filterMarkerStars(_htmlElement) {

    // retrieve the selected element value from the value attribute
    const filterType = $(_htmlElement).attr("value");

    let _marker = window.markerGLOBAL;

    $.each(_marker, (index, marker) => {

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
        if (star === 4) {
          marker.setVisible(true);
        } else {
          marker.setVisible(false);
        }
      }

      if (filterType === "type3") {
        if (star === 5) {
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
  showCurrentUserLocation(_map) {
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
          this.marker = this.createMarker(_map, position.lat, position.lng);
          this.marker.setIcon(new google.maps.MarkerImage("http://maps.google.com/mapfiles/ms/icons/green-dot.png"));
          this.marker.icon.scaledSize = new google.maps.Size(50, 50);
          this.marker.setAnimation(google.maps.Animation.BOUNCE);
          this.marker.setTitle("U are here");

          // this.infoWindow.setContent("User location found successfully.");
          // this.infoWindow.open(_map);
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


}
