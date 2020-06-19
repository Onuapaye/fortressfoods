let api = new Secret();
let map = new MapFortress();

// let _map;
let mapDIV = document.getElementById("mapContainer");
const apiKEY = api.apiKey.googleMAP;
let _map;

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
  _map = map.initializeMap(mapDIV);

  // propagate or populate the markers
  map.propagateMarker(_map);

  // add the show class to the first item in the ratings list
  $('#collapse0').addClass('show');
};

document.body.appendChild(scriptTag);
