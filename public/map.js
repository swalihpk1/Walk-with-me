var mapOptions = {};
var map;
var currMarker;
var desMarker;

var startIcon = {
  url: '/img/curr-start-indicator.png', // Path to your custom icon image
  scaledSize: new google.maps.Size(40, 40), // Size of the icon
}

var currentIcon = {
  url: '/img/current-indicator.png', // Path to your custom icon image
  scaledSize: new google.maps.Size(40, 40), // Size of the icon
}

var endIcon = {
  url: '/img/end-indicator.png', // Path to your custom icon image
  scaledSize: new google.maps.Size(30, 40), // Size of the icon
}



if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(success, error);
} else {
  console.log("Geolocation is not supported by your browser.");
}

function success(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  console.log(`Your current location: Latitude: ${latitude}, Longitude: ${longitude}`);

  // Define map options after getting the user's position
  mapOptions = {
    center: { lat: latitude, lng: longitude },
    zoom: 17, // Adjust the zoom level as desired
    mapTypeId: google.maps.MapTypeId.TERRAIN
  };

  // Create the map
  map = new google.maps.Map(document.getElementById('googleMap'), mapOptions);

 

  // Create a marker for the current location
   currMarker = new google.maps.Marker({
    position: { lat: latitude, lng: longitude },
    map: map,
    title: 'Your Location',
    icon: currentIcon
  });

  

  // Add click listener to set destination on map click
  google.maps.event.addListener(map, 'click', function (event) {
    addPinMarker(event)
  });

  // Add listener for touch events (for mobile devices)
  google.maps.event.addListener(map, 'touchend', function (event) {
    addPinMarker(event)
  });
}

function addPinMarker(event){
  if(desMarker){
    desMarker.setMap(null)
  }


  desMarker = new google.maps.Marker({
      position: event.latLng,
      map: map,
      title: 'Destination',
      icon: endIcon
    });

    // Update destination input field with coordinates
    document.getElementById("to").value = event.latLng.lat() + ", " + event.latLng.lng();
}

function error() {
  console.log("Unable to retrieve your location");
}




// Load the map when the window is fully loaded
google.maps.event.addDomListener(window, 'load');

var directionsDisplay = new google.maps.DirectionsRenderer();

function calcRoute() {
  //create map
  document.getElementById('start-btn').style.display = 'none'
  document.getElementById('stop-btn').style.display = 'block'
  console.log(mapOptions)
  //create a DirectionsService object to use the route method and get a result for our request
  var directionsService = new google.maps.DirectionsService();
  
  //create a DirectionsRenderer object which we will use to display the route
  

  //bind the DirectionsRenderer to the map
  if(!directionsDisplay.getMap()){
      directionsDisplay.setMap(map);
  }
  //create request
  directionsDisplay.setOptions({
    polylineOptions: {
        strokeColor: 'rgb(128, 69, 185)',
        strokeWeight: 10 // Change this to the desired thickness // Change this to the desired color
    }
});


  navigator.geolocation.getCurrentPosition((position) => {
    var request = {
      origin: document.getElementById("from").value || {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      },
      destination: document.getElementById("to").value,
      travelMode: google.maps.TravelMode.WALKING, //WALKING, BYCYCLING, TRANSIT
      unitSystem: google.maps.UnitSystem.METRIC
    }
    console.log('origin:', request.origin);
    //pass the request to the route method
    directionsService.route(request, function (result, status) {
      if (status == google.maps.DirectionsStatus.OK) {
      
        //Get distance and time
        const output = document.querySelector('#output');
        output.innerHTML = "<div class='alert-info'>" + ".<br /> Walking distance <i class='fas fa-road'></i> : " + result.routes[0].legs[0].distance.text + ".<br />Duration <i class='fas fa-hourglass-start'></i> : " + result.routes[0].legs[0].duration.text + ".</div>";
        directionsDisplay.setDirections({ routes: [] });
        //display route
        directionsDisplay.setDirections(result);
        startLiveTracking(); // Start live tracking after route calculation
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

var watchId; // Variable to store the watch position ID

// Function to start live tracking
function startLiveTracking() {
  if (navigator.geolocation) {
    watchId = navigator.geolocation.watchPosition(trackUser, error);
    map.setZoom(47); // Adjust the zoom level as desired
  } else {
    console.log("Geolocation is not supported by your browser.");
  }
}

// Function to track user's position
function trackUser(position) {
    console.log('position:',position);
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  // Update user marker position
  if (currMarker) {
    currMarker.setPosition({ lat: latitude, lng: longitude });
  } else {
    // Create user marker if not already created
    currMarker = new google.maps.Marker({
      position: { lat: latitude, lng: longitude },
      map: map,
      title: 'Your Location',
      icon: currentIcon
    });
  }

  currMarker.setIcon(startIcon);

  // Check if user has reached the destination
  const destination = document.getElementById("to").value;
  const distanceToDestination = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(latitude, longitude), destination);
  if (distanceToDestination < ARRIVAL_THRESHOLD) {
    // User has reached the destination, stop tracking
    stopLiveTracking();
    alert('reached');
    console.log("You have reached your destination!");
  }else{
          // Recalculate route and update output
          var request = {
            origin: { lat: latitude, lng: longitude },
            destination: destination,
            travelMode: google.maps.TravelMode.WALKING,
            unitSystem: google.maps.UnitSystem.METRIC
        };

        var directionsService = new google.maps.DirectionsService();
        directionsService.route(request, function (result, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                // Update distance and duration in the output
                const output = document.querySelector('#output');
                output.innerHTML = "<div class='alert-info'>" + "<br /> Walking distance <i class='fas fa-road'></i> : " + result.routes[0].legs[0].distance.text + ".<br />Duration <i class='fas fa-hourglass-start'></i> : " + result.routes[0].legs[0].duration.text + ".</div>";
                directionsDisplay.setDirections({ routes: [] });
                // Display updated route
                directionsDisplay.setDirections(result);
            } else {
                // Show error message
                const output = document.querySelector('#output');
                output.innerHTML = "<div class='alert-danger'><i class='fas fa-exclamation-triangle'></i> Could not retrieve walking distance.</div>";
            }
        });
  }
}

// Function to stop live tracking
function stopLiveTracking() {
  if (watchId) {
    navigator.geolocation.clearWatch(watchId);
    watchId = undefined;
  }
  document.getElementById('start-btn').style.display = 'block'
  document.getElementById('stop-btn').style.display = 'none'
  currMarker.setIcon(currentIcon);
      // Clear the directions displayed on the map
      directionsDisplay.setDirections({ routes: [] });

      // Remove the destination marker from the map
  if (marker) {
    desMarker.setMap(null);
    desMarker = undefined; // Reset marker variable
  }
}

// Constants
const ARRIVAL_THRESHOLD = 50; // Threshold distance (in meters) within which user is considered to have arrived

// Example usage:


