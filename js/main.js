// A constant variable to hold the Google Map API
const mapAPI = "AIzaSyBJYkMZRnRfxTgWZ6Ei-1-ATWOGLhgXN7Y";

let map;
let mapDIV = document.getElementById('mapContainer');

// console.log('map value ' + mapDIV);

// dynamically load the google maps API without inline script
// let scriptTag = document.createElement('script');

// Attach the function to start the map to the window object
// window.startMAP = function() {

//   map = new google.maps.Map(mapDIV, {
//     center: { lat: -34.397, lng: 15.644 },
//     zoom: 8,
//   });
// }

// set the script source attribute value
// scriptTag.src = `https://maps.googleapis.com/maps/api/js?key=${mapAPI}&callback=${startMAP}`;

// set the defer to true
// scriptTag.defer = true;

// set the async to true also to load faster
// scriptTag.async = true;

// append
// document.head.appendChild(scriptTag);
