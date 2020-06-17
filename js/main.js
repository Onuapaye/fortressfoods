let api = new Secret();
// include('./secret.js');

let _map;
let mapDIV = document.getElementById('mapContainer');
const apiKEY = api.apiKey.googleMAP;

// Dynamically create a script tag
let scriptTag = document.createElement('script');

// set the async attribute and defer to true to avoid delay in page load
scriptTag.async = true;
scriptTag.defer = true;

// set the source attribute to the google maps api with the key
scriptTag.src = `https://maps.googleapis.com/maps/api/js?key=${apiKEY}&callback=startMAP`;


// Attach the function to start the map to the window object
window.startMAP = () => {

  // map properties
  let mapProps = { lat: -34.397, lng: 15.644 };

  // set _map to a new google map object
  _map = new google.maps.Map(mapDIV, {
    center: mapProps,
    zoom: 4,
  });

  // set the map marker
  let marker = new google.maps.Marker({
    position: mapProps,
    map: _map
  })
}

document.body.appendChild(scriptTag);

// document.addEventListener('load', function(){
  
// })
$(document).ready(function(){
  $.getJSON('/js/fakerestaurants.json', function(data){
    console.log("data", data[0].restaurantName)
  });
})