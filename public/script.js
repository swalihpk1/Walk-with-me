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


    mapOptions = {
        center: { lat: latitude, lng: longitude },
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.TERRAIN
    };


    map = new google.maps.Map(document.getElementById('googleMap'), mapOptions);

    var currentIcon = {
        url: '/img/current-indicator.png',
        scaledSize: new google.maps.Size(40, 40),
    }



    currMarker = new google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: map,
        title: 'Your Location',
        icon: currentIcon
    });



    google.maps.event.addListener(map, 'click', function (event) {
        addPinMarker(event)
    });


    google.maps.event.addListener(map, 'touchend', function (event) {
        addPinMarker(event)
    });
}

function addPinMarker(event) {
    if (marker) {
        marker.setMap(null)
    }

    var endIcon = {
        url: '/img/end-indicator.png', 
        scaledSize: new google.maps.Size(30, 40), 
    }

    marker = new google.maps.Marker({
        position: event.latLng,
        map: map,
        title: 'Destination',
        icon: endIcon
    });


    document.getElementById("to").value = event.latLng.lat() + ", " + event.latLng.lng();
}

function error() {
    console.log("Unable to retrieve your location");
}





google.maps.event.addDomListener(window, 'load');

var directionsDisplay = new google.maps.DirectionsRenderer();

function calcRoute() {

    document.getElementById('start-btn').style.display = 'none';


    var directionsService = new google.maps.DirectionsService();


    if (!directionsDisplay.getMap()) {
        directionsDisplay.setMap(map);
    }


    directionsDisplay.setOptions({
        polylineOptions: {
            strokeColor: 'rgb(128, 69, 185)',
            strokeWeight: 10 
        }
    });


    navigator.geolocation.getCurrentPosition((position) => {
        var request = {
            origin: document.getElementById("from").value || {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            },
            destination: document.getElementById("to").value,
            travelMode: google.maps.TravelMode.WALKING,
            unitSystem: google.maps.UnitSystem.METRIC
        }


        directionsService.route(request, function (result, status) {
            if (status == google.maps.DirectionsStatus.OK) {

                const output = document.querySelector('#output');
                output.innerHTML = "<div class='journeyDetails' style='text-align: left;'>" + "<span style='background-color: rgba(77, 9, 141, 0.8); color: white; border-radius: 20px; padding: 5px 10px; display: inline-block; margin-bottom: 10px;'>" + result.routes[0].legs[0].duration.text + "</span>  " + result.routes[0].legs[0].distance.text + "</div>";

                directionsDisplay.setDirections({ routes: [] });

                directionsDisplay.setDirections(result);
                startLiveTracking(); 
                startProgressBar(30); 
                setTimeout(function () {
                    $("#dropdown-container").removeClass("d-none");
                    $("#dimmer-overlay").removeClass("d-none");
                }, 2000);
            } else {

                directionsDisplay.setDirections({ routes: [] });

                map.setCenter(myLatLng);


                output.innerHTML = "<div class='alert-danger'><i class='fas fa-exclamation-triangle'></i> Could not retrieve driving distance.</div>";
            }
        });
    })
}


function submitNumber() {

    const number = $("#dropdown-number").val();
    console.log("Submitted number:", number);
    startProgressBar(number)


    $("#dropdown-container").addClass("d-none");
    $("#dimmer-overlay").addClass("d-none");


    $("#tracking-content").css("bottom", "0");
    setTimeout(() => {
        startProgressBar(number)
    }, timeout);

}



var options = {
    types: ['(cities)']
}

var input1 = document.getElementById("from");
var autocomplete1 = new google.maps.places.Autocomplete(input1, options);

var input2 = document.getElementById("to");
var autocomplete2 = new google.maps.places.Autocomplete(input2, options);



function error(err) {
    console.error(`Error obtaining your location: ${err.message}`);
}

var watchId; 


function startLiveTracking() {
    if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(trackUser, error);
        map.setZoom(47);
    } else {
        console.log("Geolocation is not supported by your browser.");
    }
}


function trackUser(position) {
    console.log('position:', position);
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;


    if (currMarker) {
        currMarker.setPosition({ lat: latitude, lng: longitude });
    } else {

        marker = new google.maps.Marker({
            position: { lat: latitude, lng: longitude },
            map: map,
            title: 'Your Location',
            icon: currentIcon
        });
    }


    const destination = document.getElementById("to").value;
    const distanceToDestination = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(latitude, longitude), destination);
    if (distanceToDestination < ARRIVAL_THRESHOLD) {

        stopLiveTracking();
        alert('reached');
        console.log("You have reached your destination!");
    } else {

        var request = {
            origin: { lat: latitude, lng: longitude },
            destination: destination,
            travelMode: google.maps.TravelMode.WALKING,
            unitSystem: google.maps.UnitSystem.METRIC
        };

        var directionsService = new google.maps.DirectionsService();
        directionsService.route(request, function (result, status) {
            if (status == google.maps.DirectionsStatus.OK) {

                const output = document.querySelector('#output');
                output.innerHTML = "<div class='journeyDetails'>" + "<br /><span style='background-color: rgba(77, 9, 141, 0.8); color: white; border-radius: 20px; padding: 5px 10px;'>" + result.routes[0].legs[0].distance.text + "</span>.<br /><span style='background-color: grey; color: magenta; border-radius: 20px; padding: 5px 10px;'>" + result.routes[0].legs[0].duration.text + "</span>.</div>";

                directionsDisplay.setDirections({ routes: [] });

                directionsDisplay.setDirections(result);
            } else {

                const output = document.querySelector('#output');
                output.innerHTML = "<div class='alert-danger'><i class='fas fa-exclamation-triangle'></i> Could not retrieve walking distance.</div>";
            }
        });
    }
}

function stopLiveTracking() {
    if (watchId) {
        navigator.geolocation.clearWatch(watchId);
        watchId = undefined;
    }
    document.getElementById('start-btn').style.display = 'block';


    directionsDisplay.setDirections({ routes: [] });


    if (marker) {
        marker.setMap(null);
        marker = undefined; 
    }
}

const ARRIVAL_THRESHOLD = 50; 



// --------------Progress Bar scripts-----------------
var width = 0; 
var interval; 
var paused = false;

function pauseProgressBar() {
    paused = true;
    document.getElementById('pause-btn').style.display = 'none';
    document.getElementById('resume-btn').style.display = 'block';
}

function resumeProgressBar() {
    paused = false;
    document.getElementById('pause-btn').style.display = 'block';
    document.getElementById('resume-btn').style.display = 'none';
}

function startProgressBar(number) {
    var totalTime = number * 60;
    var progressBar = document.getElementById('progress');
    var checkpoint1 = document.getElementById('checkpoint1');
    var checkpoint2 = document.getElementById('checkpoint2');
    var increment = 100 / totalTime; 

    interval = setInterval(timerFunction, 1000); 

    function timerFunction() {
        if (!paused) { 
            if (width >= 100) {
                clearInterval(interval);

                Swal.fire({
                    title: 'Journey Completed!',
                    text: 'Your journey has been successfully completed. You are so Courageous!',
                    icon: 'success',
                    timer: 3000,
                    onClose: () => {

                        window.location.href = "/";
                    }
                });

            } else {
                width += increment; 
                progressBar.style.width = width + '%';
                console.log('width:', width);
              
                if (width >= 33 && !checkpoint1.triggered) {
                    clearInterval(interval); 
                    checkpoint1.triggered = true; 
                    showCheckpointAlert('Are you okay at first checkpoint?', checkpoint2);
                }


                if (width >= 66 && !checkpoint2.triggered) {
                    clearInterval(interval);
                    checkpoint2.triggered = true; 
                    showCheckpointAlert('Are you okay at second checkpoint?');
                }
            }
        }
    }



    async function showCheckpointAlert(message, nextCheckpoint) {
        let response = await fetch('check-point', {
            method: 'GET'
        });
        let data = await response.json();
        console.log(data.quote.quote)
        Swal.fire({
            title: message,
            text: data.quote.quote,
            showCancelButton: true,
            confirmButtonText: 'Yes, I\'m cool',
            cancelButtonText: 'No, feeling fishy',
            timer: 60000, 
            allowOutsideClick: false,
            timerProgressBar: true,
            cancelButtonClass: 'bg-danger' 
        }).then((result) => {
            if (result.isConfirmed) {

                interval = setInterval(timerFunction, 1000);
            } else {
                Swal.fire({
                    title: 'really!',
                    text: 'So, we are forwarding alert to your relatives',
                    icon: 'warning',
                    confirmButtonText: 'Yes, hurry up!',
                    showConfirmButton: true, 
                    showCancelButton: true,
                    cancelButtonText: "Nop it's ok",
                    allowOutsideClick: false,
                    allowEscapeKey: false 
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        let message = `🚨 URGENT ALERT:🚨  \n    
                        We hope you're well.  We're reaching out because your friend hasn't responded to our recent messages, and we want to ensure her safety.
                        
                        For your information:
                        - Last Known Location: https://www.google.com/maps/dir//11.1895,75.8698/@11.1895,75.8698,15z/data=!4m2!4m1!3e2?entry=ttu 
                        
                        We kindly ask for your assistance in checking on her to make sure she is not in any danger. If possible, please try reaching out to her or physically check her location.
                        `;
                    
                    try {
                        let response = await fetch('/sendwhatsAppMessages', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                message: message,
                            }),
                        });
                        await response.json();
                    }catch(error){
                        console.log(error,"error fetching")
                    }
                    } else {
                        interval = setInterval(timerFunction, 1000);
                    }
                });
            }
        });
    }
}
