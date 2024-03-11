var mapOptions = {};
var map;
var currMarker;
var marker;




if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
} else {
    console.log("Geolocation is not supported by your browser.");
}

function success(position) {
    console.log('lalala:', position);
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

    var currentIcon = {
        url: '/img/current-indicator.png', // Path to your custom icon image
        scaledSize: new google.maps.Size(40, 40), // Size of the icon
    }


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

function addPinMarker(event) {
    if (marker) {
        marker.setMap(null)
    }

    var endIcon = {
        url: '/img/end-indicator.png', // Path to your custom icon image
        scaledSize: new google.maps.Size(30, 40), // Size of the icon
    }

    marker = new google.maps.Marker({
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
    // Show the stop button
    document.getElementById('start-btn').style.display = 'none';

    // Create a DirectionsService object to use the route method and get a result for our request
    var directionsService = new google.maps.DirectionsService();

    // Bind the DirectionsRenderer to the map
    if (!directionsDisplay.getMap()) {
        directionsDisplay.setMap(map);
    }

    // Create request
    directionsDisplay.setOptions({
        polylineOptions: {
            strokeColor: 'rgb(128, 69, 185)',
            strokeWeight: 10 // Change this to the desired thickness // Change this to the desired color
        }
    });

    // Get current position
    navigator.geolocation.getCurrentPosition((position) => {
        var request = {
            origin: document.getElementById("from").value || {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            },
            destination: document.getElementById("to").value,
            travelMode: google.maps.TravelMode.WALKING, // WALKING, BYCYCLING, TRANSIT
            unitSystem: google.maps.UnitSystem.METRIC
        }

        // Pass the request to the route method
        directionsService.route(request, function (result, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                // Get distance and time
                const output = document.querySelector('#output');
                output.innerHTML = "<div class='journeyDetails' style='text-align: left;'>" + "<span style='background-color: rgba(77, 9, 141, 0.8); color: white; border-radius: 20px; padding: 5px 10px; display: inline-block; margin-bottom: 10px;'>" + result.routes[0].legs[0].duration.text + "</span>  " + result.routes[0].legs[0].distance.text + "</div>";

                directionsDisplay.setDirections({ routes: [] });
                // Display route
                directionsDisplay.setDirections(result);
                startLiveTracking(); // Start live tracking after route calculation
                startProgressBar(30); // Adjust the number of minutes as needed
                setTimeout(function () {
                    $("#dropdown-container").removeClass("d-none");
                    $("#dimmer-overlay").removeClass("d-none");
                }, 2000);
            } else {
                // Delete route from map
                directionsDisplay.setDirections({ routes: [] });
                // Center map in London
                map.setCenter(myLatLng);

                // Show error message
                output.innerHTML = "<div class='alert-danger'><i class='fas fa-exclamation-triangle'></i> Could not retrieve driving distance.</div>";
            }
        });
    })
}


function submitNumber() {
    // Handle the submitted number from the dropdown
    const number = $("#dropdown-number").val();
    console.log("Submitted number:", number);
    startProgressBar(number)

    // Hide the dropdown and dimmer after submission
    $("#dropdown-container").addClass("d-none");
    $("#dimmer-overlay").addClass("d-none");

    // Show the tracking content by sliding it from the bottom
    $("#tracking-content").css("bottom", "0");
    setTimeout(() => {
        startProgressBar(number)
    }, timeout);

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
    console.log('position:', position);
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // Update user marker position
    if (currMarker) {
        currMarker.setPosition({ lat: latitude, lng: longitude });
    } else {
        // Create user marker if not already created
        marker = new google.maps.Marker({
            position: { lat: latitude, lng: longitude },
            map: map,
            title: 'Your Location',
            icon: currentIcon
        });
    }

    // Check if user has reached the destination
    const destination = document.getElementById("to").value;
    const distanceToDestination = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(latitude, longitude), destination);
    if (distanceToDestination < ARRIVAL_THRESHOLD) {
        // User has reached the destination, stop tracking
        stopLiveTracking();
        alert('reached');
        console.log("You have reached your destination!");
    } else {
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
                output.innerHTML = "<div class='journeyDetails'>" + "<br /><span style='background-color: rgba(77, 9, 141, 0.8); color: white; border-radius: 20px; padding: 5px 10px;'>" + result.routes[0].legs[0].distance.text + "</span>.<br /><span style='background-color: grey; color: magenta; border-radius: 20px; padding: 5px 10px;'>" + result.routes[0].legs[0].duration.text + "</span>.</div>";

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
    document.getElementById('start-btn').style.display = 'block';

    // Clear the directions displayed on the map
    directionsDisplay.setDirections({ routes: [] });

    // Remove the destination marker from the map
    if (marker) {
        marker.setMap(null);
        marker = undefined; // Reset marker variable
    }
}

// Constants
const ARRIVAL_THRESHOLD = 50; // Threshold distance (in meters) within which user is considered to have arrived

// Example usage:




// --------------Progress Bar scripts-----------------
var width = 0; // Define width outside of the function
var interval; // Declare interval globally for better control
var paused = false;

function pauseProgressBar() {
    paused = true;
    document.getElementById('pause-btn').style.display = 'none';
    document.getElementById('resume-btn').style.display = 'block';
}

function resumeProgressBar() {
    paused = false;
    document.getElementById('pause-btn').style.display = 'block';
    document.getElementById('resume-btn').style.display = 'none'; // This line hides the resume button
    // Start the timer
}

function startProgressBar(number) {
    var totalTime = number * 60;
    var progressBar = document.getElementById('progress');
    var checkpoint1 = document.getElementById('checkpoint1');
    var checkpoint2 = document.getElementById('checkpoint2');
    var increment = 100 / totalTime; // Calculate increment for each second

    interval = setInterval(timerFunction, 1000); // Start the timer immediately

    function timerFunction() {
        if (!paused) { // Check if the progress bar is not paused
            if (width >= 100) {
                clearInterval(interval);
                // Show success message using SweetAlert
                Swal.fire({
                    title: 'Journey Completed!',
                    text: 'Your journey has been successfully completed. You are so Courageous!',
                    icon: 'success',
                    showCancelButton: true,
                    confirmButtonText: 'Alright',
                    showConfirmButton: true
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Redirect to /safetymap when "Alright" is clicked
                        window.location.href = "/safetymap";
                    }
                });
            } else {
                width += increment; // Increment width
                progressBar.style.width = width + '%';
                console.log('width:', width);
                // Check if reached the first checkpoint
                if (width >= 33 && !checkpoint1.triggered) {
                    clearInterval(interval); // Pause the timer
                    checkpoint1.triggered = true; // Mark the checkpoint as triggered
                    showCheckpointAlert('Are you okay at first checkpoint?', checkpoint2);
                }

                // Check if reached the second checkpoint
                if (width >= 66 && !checkpoint2.triggered) {
                    clearInterval(interval); // Pause the timer
                    checkpoint2.triggered = true; // Mark the checkpoint as triggered
                    showCheckpointAlert('Are you okay at second checkpoint?');
                }
            }
        }
    }



    function showCheckpointAlert(message, nextCheckpoint) {
        Swal.fire({
            title: message,
            showCancelButton: true,
            confirmButtonText: 'Yes, I\'m cool',
            cancelButtonText: 'No, feeling fishy',
            timer: 60000, // 60 seconds timeout (1 minute)
            allowOutsideClick: false,
            timerProgressBar: true, // Disable timer progress bar
            cancelButtonClass: 'bg-danger' // Add custom class to cancel button
        }).then((result) => {
            if (result.isConfirmed) {
                // If confirmed, resume the timer
                interval = setInterval(timerFunction, 1000);
            } else {
                Swal.fire({
                    title: 'really!',
                    text: 'So, we are forwarding alert to your relatives',
                    icon: 'warning',
                    confirmButtonText: 'Yes, hurry up!',
                    showConfirmButton: true, // Ensure the OK button is shown
                    showCancelButton: true,
                    cancelButtonText: "Nop it's ok",
                    allowOutsideClick: false, // Prevent closing by clicking outside the modal
                    allowEscapeKey: false // Prevent closing by pressing Esc key
                }).then((result) => {
                    if (result.isConfirmed) {
                        // If confirmed, resume the timer

                    } else {
                        interval = setInterval(timerFunction, 1000);
                    }
                });
            }
        });
    }
}
