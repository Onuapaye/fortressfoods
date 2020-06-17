let api = new Secret();
let map = new MapFortress();

// let _map;
let mapDIV = document.getElementById("mapContainer");
const apiKEY = api.apiKey.googleMAP;

// Dynamically create a script tag
let scriptTag = document.createElement("script");

// set the async attribute and defer to true to avoid delay in page load
scriptTag.async = true;
scriptTag.defer = true;

// set the source attribute to the google maps api with the key
scriptTag.src = `https://maps.googleapis.com/maps/api/js?key=${apiKEY}&callback=startMAP`;

// Attach the function to start the map to the window object
window.startMAP = () => {
  map.initMap(mapDIV);
};

document.body.appendChild(scriptTag);
