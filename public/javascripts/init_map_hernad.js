var map;
var nextMarkerAt = 0;     // Counter for the marker checkpoints.
var nextPoint = null;     // The point where to place the next marker.
// $(document).ready(function () { 
//     initMap();
// });

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
      center: {lng:20.93023457617614,lat:47.99061467092415},
      zoom: 14,
      mapTypeId: 'terrain'
  });
  var myLatLng = {lng:20.93023457617614,lat:47.99061467092415};

  var icon = {
      url: "/images/inner-darkblue-circle-full-marker.png", // url
      scaledSize: new google.maps.Size(20, 20), // scaled size
      //origin: new google.maps.Point(0,0), // origin
      anchor: new google.maps.Point(10, 10) // anchor
  };

  // var marker = new google.maps.Marker({
  //         position: myLatLng,
  //         map: map,
  //         title: 'T 6547',
  //         icon: icon
  //       });

  var hernad_path = new google.maps.Polyline({
      path: hernad_coordinates,
      geodesic: true,
      strokeColor: '#267CB5',
      strokeOpacity: 1.0,
      strokeWeight: 2
  });

  hernad_path.setMap(map);

  while (true) {
    break;
    // Call moveAlongPath which will return the GLatLng with the next
    // marker on the path.
    nextPoint = moveAlongPath(hernad_coordinates, nextMarkerAt);
    //console.log(nextPoint);
    if (nextPoint) {
       // Draw the marker on the map.
       //map.addOverlay(new google.maps.Marker(nextPoint));

       var marker = new google.maps.Marker({
          position: nextPoint,
          map: map,
          title: 'T 6547',
          icon: icon
        });

       // Add +1000 meters for the next checkpoint.
       nextMarkerAt += 1000;    
    }
    else {
       // moveAlongPath returned null, so there are no more check points.
       break;
    }            
  }
}

