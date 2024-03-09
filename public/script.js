//javascript.js
//set map options
  // Check if Geolocation is supported
  var mapOptions = {};
  var map;
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  } else {
    console.log("Geolocation is not supported by your browser.");
  }
  
  function success(position) {
    console.log('lalala:',position);
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
  
    console.log(`Your current location: Latitude: ${latitude}, Longitude: ${longitude}`);
  
    // Define map options after getting the user's position
    mapOptions = {
      center: { lat: latitude, lng: longitude },
      zoom: 28, // Adjust the zoom level as desired
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
  
    // Create the map
    map = new google.maps.Map(document.getElementById('googleMap'), mapOptions);
  
    // Create a marker for the current location
    new google.maps.Marker({
      position: { lat: latitude, lng: longitude },
      map: map,
      title: 'Your Location'
    });

       // Add click listener to set destination on map click
       google.maps.event.addListener(map, 'click', function(event) {
          // Create a new marker for the clicked location
          marker = new google.maps.Marker({
            position: event.latLng,
            map: map,
            title: 'Destination'
          });

          // Update destination input field with coordinates
          document.getElementById("to").value = event.latLng.lat() + ", " + event.latLng.lng();
        });

        // Add listener for touch events (for mobile devices)
google.maps.event.addListener(map, 'touchend', function(event) {
         // Create a new marker for the clicked location
         marker = new google.maps.Marker({
            position: event.latLng,
            map: map,
            title: 'Destination'
          });

          // Update destination input field with coordinates
          document.getElementById("to").value = event.latLng.lat() + ", " + event.latLng.lng();
});
  }
  
  function error() {
    console.log("Unable to retrieve your location");
  }
  
  // Load the map when the window is fully loaded
  google.maps.event.addDomListener(window, 'load');
  

function calcRoute(){
//create map
console.log(mapOptions)


//create a DirectionsService object to use the route method and get a result for our request
var directionsService = new google.maps.DirectionsService();

//create a DirectionsRenderer object which we will use to display the route
var directionsDisplay = new google.maps.DirectionsRenderer();

//bind the DirectionsRenderer to the map
directionsDisplay.setMap(map);
    //create request

    navigator.geolocation.getCurrentPosition((position)=> {
      var request = {
        origin: document.getElementById("from").value || {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      } ,
        destination: document.getElementById("to").value,
        travelMode: google.maps.TravelMode.WALKING, //WALKING, BYCYCLING, TRANSIT
        unitSystem: google.maps.UnitSystem.METRIC
    }
    console.log('origin:',request.origin);
      //pass the request to the route method
      directionsService.route(request, function (result, status) {
        if (status == google.maps.DirectionsStatus.OK) {

            //Get distance and time
            const output = document.querySelector('#output');
            output.innerHTML = "<div class='alert-info'>"  + "<br /> Walking distance <i class='fas fa-road'></i> : " + result.routes[0].legs[0].distance.text + ".<br />Duration <i class='fas fa-hourglass-start'></i> : " + result.routes[0].legs[0].duration.text + ".</div>";
            //display route
            directionsDisplay.setDirections(result);
        } else {
            //delete route from map
            directionsDisplay.setDirections({ routes: [] });
            //center map in London
            map.setCenter(myLatLng);

            //show error message
            output.innerHTML = "<div class='alert-danger'><i class='fas fa-exclamation-triangle'></i> Could not retrieve driving distance.</div>";
        }
    });
    })
}

//create autocomplete objects for all inputs
var options = {
    types: ['(cities)']
}

var input1 = document.getElementById("from");
var autocomplete1 = new google.maps.places.Autocomplete(input1, options);

var input2 = document.getElementById("to");
var autocomplete2 = new google.maps.places.Autocomplete(input2, options);
 
  
  // Function to handle errors during positioning
  function error(err) {
    console.error(`Error obtaining your location: ${err.message}`);
  }

