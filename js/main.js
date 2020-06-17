let api = new Secret();

let map;
let mapDIV = document.getElementById('mapContainer');

console.log('map API ' + api.apiKey.googleMAP);


// Attach the function to start the map to the window object
window.startMAP = () => {

  map = new google.maps.Map(mapDIV, {
    center: { lat: -34.397, lng: 15.644 },
    zoom: 5,
  });
}
