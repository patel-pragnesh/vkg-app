var map;
var nextMarkerAt = 0;     // Counter for the marker checkpoints.
var nextPoint = null;     // The point where to place the next marker.
// $(document).ready(function () { 
//     initMap();
// });

function initMap(river_id, profiles) {

  var icon = {
      url: "/images/inner-darkblue-circle-full-marker.png", // url
      scaledSize: new google.maps.Size(20, 20), // scaled size
      //origin: new google.maps.Point(0,0), // origin
      anchor: new google.maps.Point(10, 10) // anchor
  };

  $.post( "/rivers/coordinates", 
      {
      river_id: river_id,
      },
      function( data ) {
      if(data){
        var points = [
        ];

        $.each(data, function(i, v){
          points.push(new google.maps.LatLng(v.lat, v.lng));
        });

        //console.log(points);

        map = new google.maps.Map(document.getElementById('map_river'), {
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
            path: points,
            geodesic: true,
            strokeColor: '#267CB5',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });

        hernad_path.setMap(map);

        //console.log(profiles);
        drawProfiles(points, profiles, river_id);

      }else{
        
      }
  });

function drawProfiles(coordinates, profiles, river_id){
  let profiles_array = profiles.split(',');
  let profiles_coordinates = [];
  $.post( "/rivers/profiles_coordinate", 
      {
        river_id: river_id,
      },
      function( data ) {
      if(data){
        
        $.each(data, function(i, v){
          profiles_coordinates.push({name: v.profile, lat: v.lat, lng: v.lng});
        });
        console.log(profiles_coordinates);

        //TODO megkeresni a kirajzolandó profilokat a tömbben és megjeleníteni
        $.each(profiles_array, function(i,v){
          //console.log(v);
          var profile_obj = profiles_coordinates.find(function (obj) { return obj.name == v; });
          //console.log(profile_obj);
          if(profile_obj){
            var marker = new google.maps.Marker({
                  position: new google.maps.LatLng(profile_obj.lat, profile_obj.lng),
                  map: map,
                  title: 'T 6547',
                  icon: icon
                });
          }else{
            //Ha nincs benne akkor el kell menteni
            //console.log(v);
            nextMarkerAt = Number(v);//100836.4;
            nextPoint = moveAlongPath(coordinates, nextMarkerAt);
            
            if (nextPoint) {
               // Draw the marker on the map.
               //map.addOverlay(new google.maps.Marker(nextPoint));
               //console.log(nextPoint);
               $.post( "/rivers/profiles_coordinate_save", 
                {
                  river_id: river_id,
                  point_profile: v,
                  point_lat: nextPoint.lat(),
                  point_lng: nextPoint.lng()
                },
                function( data ) {
                  if(data){
                  }
                });

               // var marker = new google.maps.Marker({
               //    position: nextPoint,
               //    map: map,
               //    title: 'T 6547',
               //    icon: icon
               //  });
               
            }
          }
        });

        

      }else{
        
      }
  });


  
}

  // while (true) {
  //   break;
  //   // Call moveAlongPath which will return the GLatLng with the next
  //   // marker on the path.
  //   nextPoint = moveAlongPath(hernad_coordinates, nextMarkerAt);
  //   //console.log(nextPoint);
  //   if (nextPoint) {
  //      // Draw the marker on the map.
  //      //map.addOverlay(new google.maps.Marker(nextPoint));

  //      var marker = new google.maps.Marker({
  //         position: nextPoint,
  //         map: map,
  //         title: 'T 6547',
  //         icon: icon
  //       });

  //      // Add +1000 meters for the next checkpoint.
  //      nextMarkerAt += 1000;    
  //   }
  //   else {
  //      // moveAlongPath returned null, so there are no more check points.
  //      break;
  //   }            
  // }
}

