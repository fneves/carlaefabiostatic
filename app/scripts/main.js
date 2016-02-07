console.log('\'Allo \'Allo!'); // eslint-disable-line no-console

$(".anchor").on('click', function(event){

    // Prevent default anchor click behavior
    event.preventDefault();

    // Store hash (#)
    var hash = this.hash;

    // Using jQuery's animate() method to add smooth page scroll
    // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area (the speed of the animation)
    $('html, body').animate({
        scrollTop: $(hash).offset().top
    }, 800, function(){

        // Add hash (#) to URL when done scrolling (default click behavior)
        window.location.hash = hash;
    });
});

function isElementInViewport(elem) {
    var $elem = $(elem);

    // Get the scroll position of the page.
    var scrollElem = ((navigator.userAgent.toLowerCase().indexOf('webkit') != -1) ? 'body' : 'html');
    var viewportTop = $(scrollElem).scrollTop();
    var viewportBottom = viewportTop + $(window).height();

    // Get the position of the element on the page.
    var elemTop = Math.round($elem.offset().top);
    var elemBottom = elemTop + $elem.height();

    return ((elemTop < viewportBottom) && (elemBottom > viewportTop));
}

// Check if it's time to start the animation.
function checkAnimation() {

    var $elem = $('#bigdaytitle');

    // If the animation has already been started
    if ($elem.hasClass('start')) return;


    if (isElementInViewport($elem)) {
        // Start the animation
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        $elem.addClass('start');
        $elem.addClass('animated bounceInRight').one(animationEnd, function() {
            $(this).removeClass('animated bounceInRight');
        });
    } else {
        $elem.removeClass('start');
    }
}

// Capture scroll events
$(window).scroll(function(){
    checkAnimation();
});

jQuery(function($) {
    // Asynchronously Load the map API
    var script = document.createElement('script');
    script.src = "http://maps.googleapis.com/maps/api/js?sensor=false&callback=initialize";
    document.body.appendChild(script);
});

function initialize() {
    var map;
    var bounds = new google.maps.LatLngBounds();
    var mapOptions = {
        mapTypeId: 'roadmap',
        scrollwheel: false
    };

    // Display a map on the page
    map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
    map.setTilt(45);

    // Multiple Markers
    var markers = [
        ['Igreja Matriz, Mação', 39.553900, -7.998413],
        ["Quinta D'Oliveiras, Abrantes", 39.4821629,-8.1627624]
    ];

    // Info Window Content
    var infoWindowContent = [
        ['<div class="info_content">' +
          '<h3>Igreja Matriz de Mação</h3>' +
          '<p>The church where the ceremony will happen</p>' +
          '<p>GPS: 39.553900, -7.998413</p>' +
          '<a href="https://goo.gl/maps/RfStUsGU3DQ2" target="_blank">Open in Google Maps</a>' +
        '</div>'],
        ['<div class="info_content">' +
          '<h3>Quinta D\'Oliveiras</h3>' +
          '<p>The reception will take place here</p>' +
          '<p>GPS: 39.4821629,-8.1627624</p>' +
          '<a href="https://goo.gl/maps/gjebeKPd8eP2" target="_blank">Open in Google Maps</a>' +
        '</div>']
    ];

    // Display multiple markers on a map
    var infoWindow = new google.maps.InfoWindow(), marker, i;

    // Loop through our array of markers & place each one on the map
    for( i = 0; i < markers.length; i++ ) {
        var position = new google.maps.LatLng(markers[i][1], markers[i][2]);
        bounds.extend(position);
        marker = new google.maps.Marker({
            position: position,
            map: map,
            title: markers[i][0]
        });

        // Allow each marker to have an info window
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infoWindow.setContent(infoWindowContent[i][0]);
                infoWindow.open(map, marker);
            }
        })(marker, i));

        // Automatically center the map fitting all markers on the screen
        map.fitBounds(bounds);
    }

    // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
    var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
        this.setZoom(12);
        google.maps.event.removeListener(boundsListener);
    });

}
