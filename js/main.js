let secret = new Secret();
let mapFortress = new MapFortress();

let mapDIV = document.getElementById("mapContainer");
const apiKEY = secret.apiKey.googleMAP;
// window._mapGLOBAL;

// Dynamically create a script tag
let scriptTag = document.createElement("script");

// set the async attribute and defer to true to avoid delay in page load
scriptTag.async = true;
scriptTag.defer = true;

// set the source attribute to the google maps api with the key
scriptTag.src = `https://maps.googleapis.com/maps/api/js?key=${apiKEY}&callback=startMAP`;

// Attach the function to start the map to the window object
window.startMAP = () => {

  // initialize the map
  let _map = mapFortress.initializeMap(mapDIV);
  
  // get the current user location
  mapFortress.getCurrentUserLocation(_map);

  // propagate or populate the markers
  mapFortress.propagateMarker(_map);

  // set a global variable to the map object to be accessible app wide
  window._mapGLOBAL = _map;

  // add the show class to the first item in the ratings list
  $('#collapse0').addClass('show');
};

document.body.appendChild(scriptTag);
