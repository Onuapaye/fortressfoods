let secret = new Secret();
let mapFortress = new MapFortress();
let placesFortress = new PlacesFortress();

let mapDIV = document.getElementById("mapContainer");
const apiKEY = secret.apiKey.googleMAP;

// Dynamically create a script tag
let scriptTag = document.createElement("script");

// set the source attribute to the google maps api with the key
scriptTag.src = `https://maps.googleapis.com/maps/api/js?key=${apiKEY}&libraries=places&callback=startMAP`;

// set the async attribute and defer to true to avoid delay in page load
scriptTag.async = true;
scriptTag.defer = true;

// append the script tag to the body element
document.body.appendChild(scriptTag);

// Attach the function to start the map to the window object
startMAP = () => {

  // initialize the map
  let _map = mapFortress.initializeMap(mapDIV);
  
  // get the current user location
  mapFortress.showCurrentUserLocation(_map);

  // propagate or populate the markers
  mapFortress.loadOfflinePlaces(_map);
  mapFortress.loadOnlinePlaces(_map);

  // set a global variable to the map object to be accessible app wide
  window._mapGLOBAL = _map;

  // an event listener to the map's click event
  window._mapGLOBAL.addListener('click', (event) => {
    mapFortress.addRestaurant(event, mapFortress.geometry);
  });

  window.google.maps.event.addListener(_mapGLOBAL, 'dragend', ()=>{alert('map-dragged')});

  // window._mapGLOBAL.addListener('bounds_changed', function(){
      // placesFortress.loadOnlinePlaces(window._mapGLOBAL);
  // })


  // expands the 1st item by adding the class show
  $('#collapse0').addClass('show');

};


