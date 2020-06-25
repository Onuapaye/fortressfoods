class MapFortress extends Restaurant {
  constructor() {
    super();
    this.mapCenter = {};
    this.map;
    this.marker;
    this.geometry = null;
    this.mapZoom = 0;
    this.infoWindow;
  }

  /**
   * Initializes the `map object` when passed with a div element and returns the `map object`
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
        this.name = _localRestaurants[i].name;
        this.address = _localRestaurants[i].address;
        this.placeId = `local-data-${i}`;

        let _ratings = _localRestaurants[i].reviews;

        let _totalRatingsArrayCount = _localRestaurants[i].reviews.length;
        let _totalStars = 0;

        // get the ratings value from the ratings array and retrieve the stars
        Object.keys(_ratings).map(function (key) {
          _totalStars += _ratings[key]["rating"];
        });

        // divide the total stars by the total stars count to get the average rating
        this.averageRating = (_totalStars / _totalRatingsArrayCount);

        // create markers
        this.marker = this.createMarker(_map, this.lat, this.lng);

        // fetch and show the reviews
        this.fetchPlaceReviews(true, _localRestaurants[i]);

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
  loadOnlinePlaces(_map, _drag=false) {

    this.placesService = new google.maps.places.PlacesService(_map);

    // check if geolocation is enables by the user
    if (navigator.geolocation) {
      
      // retrieve the current user position or coordinates and pass it as the places location  
      navigator.geolocation.getCurrentPosition((userPosition) => {

        if (_drag === false) {
          this.mapCenter = new google.maps.LatLng(userPosition.coords.latitude, userPosition.coords.longitude);
        } else {
          this.mapCenter = new google.maps.LatLng(_map.getCenter().lat(), _map.getCenter().lng())
        }

        const _requestOptions = {
          location: this.mapCenter,
          radius: "1500",
          type: ["restaurant"],
        };

        this.placesService.nearbySearch(
            _requestOptions,
          (results, status) => {

            if (status === google.maps.places.PlacesServiceStatus.OK) {

              let markerArray = [];
                
              for (let i = 0; i < results.length; i++) {

                this.geometry = { lat: results[i].geometry.location.lat(), lng: results[i].geometry.location.lng() };
                this.name = results[i].name;
                this.averageRating = results[i].rating;
                this.address = results[i].vicinity;
                this.placeId = results[i].place_id;

                this.marker = this.createMarker(_map, this.geometry.lat, this.geometry.lng);

                // push individual markers into the array of markers
                markerArray.push(this.marker);

                this.fetchPlaceReviews(false);
              }            

              // assign the markers the global markers variable
              window.markerGLOBAL = markerArray;
              
              // set the center of the map to user position
              _map.setCenter(this.mapCenter);
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
   * Retrieves the location or restaurants details if it's an online (live) using `google places api`
   * or offline (local or conjured) using the `google street view api`
   * @param {*} local 
   * @param {*} _localData 
   */
  fetchPlaceReviews(local = false, _localData){
    const _url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${this.placeId}&fields=reviews&key=${apiKEY}`;
    let onlineDataArray = []

    if(local == true){
      mapFortress.showReviews(_localData);
    } else {

      $.ajax({
        url: _url,
        type: 'GET',
        dataType: 'JSON',
        async: false,
        success: (_response, _status)=> {
          onlineDataArray.push(_response);

          let _reviewsDataObject;
          for (let i = 0; i < onlineDataArray.length; i++) {
            _reviewsDataObject = onlineDataArray[i].result;
          }
          mapFortress.showReviews(_reviewsDataObject);
        }
      });
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
      title: this.name,
      rating: this.averageRating,
      vicinity: this.address,
      placeId: this.placeId,
      animation: google.maps.Animation.DROP
    });

    return _marker;
  }

  // static addRestaurantPlace(_form){
    
  //   //get the form and serialize it into array
  //   let form = $(_form).serializeArray();

  //   // get or retrieve form input values
  //   this.name = form[0].value;
  //   this.address = form[1].value;
  //   this.averageRating = form[2].value;

  //   // get the location that was
  //   this.lat = globalClickedMapCenter.lat;
  //   this.lng = globalClickedMapCenter.lng;

  //   // create the markers
  //   this.marker = this.createMarker(_mapGLOBAL, this.lat, this.lng);    

  //   // fetch the location image and show the restaurant on the card with its reviews
  //   this.fetchPlaceReviews(true, {});

  //   // close the modal window
  //   $('#bnt-close-add-restaurant-modal').click();
  // }

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
