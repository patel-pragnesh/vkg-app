var map;
var nextMarkerAt = 0;     // Counter for the marker checkpoints.
var nextPoint = null;     // The point where to place the next marker.

var icon = {
  url: "/images/map-gray.png", // url
  scaledSize: new google.maps.Size(8, 8), // scaled size
  //origin: new google.maps.Point(0,0), // origin
  anchor: new google.maps.Point(4, 4) // anchor
};

function initMap(river_id, profiles) {
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

      var bounds = new google.maps.LatLngBounds();
      for (var i = 0; i < points.length; i++) {
        bounds.extend(points[i]);
      }

      var center = bounds.getCenter();

      map = new google.maps.Map(document.getElementById('map_river'), {
        center: center,
        zoom: 14,
        mapTypeId: 'terrain'
      });

      // var marker = new google.maps.Marker({
      //         position: myLatLng,
      //         map: map,
      //         title: 'T 6547',
      //         icon: icon
      //       });

      var path = new google.maps.Polyline({
        path: points,
        geodesic: true,
        strokeColor: '#267CB5',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });

      path.setMap(map);

      map.fitBounds(bounds);

      drawProfiles(points, profiles, river_id);

    }else{

    }
  });
}

//#######################################################################
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

      //TODO megkeresni a kirajzolandó profilokat a tömbben és megjeleníteni
      $.each(profiles_array, function(i,v){
        var profile_obj = profiles_coordinates.find(function (obj) { return obj.name == v; });
        if(profile_obj){
          // var marker = new google.maps.Marker({
          //   position: new google.maps.LatLng(profile_obj.lat, profile_obj.lng),
          //   map: map,
          //   title: 'P_'+v,
          //   icon: icon
          // });
          var latLng = new google.maps.LatLng(profile_obj.lat, profile_obj.lng);
          var custom_marker = new CustomMarker(
            latLng,
            map,
            {
              marker_id: 'P_' + v
            }
          );
        }else{
          //Ha nincs benne akkor el kell menteni
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
             
           }
         }
       });

      

    }else{

    }
  });
}

//#######################################################################
function CustomMarker(latlng, map, args) {
  this.latlng = latlng; 
  this.args = args; 
  this.setMap(map); 
}

CustomMarker.prototype = new google.maps.OverlayView();

CustomMarker.prototype.draw = function() {
  
  var self = this;
  
  var div = this.div;
  
  if (!div) {
  
    div = this.div = document.createElement('div');
    
    div.className = 'marker ' + self.args.marker_id;
    
    div.style.position = 'absolute';
    div.style.cursor = 'pointer';
    div.style.width = '10px';
    div.style.height = '10px';
    div.style.background = 'blue';
    
    if (typeof(self.args.marker_id) !== 'undefined') {
      div.dataset.marker_id = self.args.marker_id;
    }
    
    google.maps.event.addDomListener(div, "click", function(event) {      
      google.maps.event.trigger(self, "click");
    });
    
    var panes = this.getPanes();
    panes.overlayImage.appendChild(div);
  }
  
  var point = this.getProjection().fromLatLngToDivPixel(this.latlng);
  
  if (point) {
    div.style.left = (point.x - 5) + 'px';
    div.style.top = (point.y -5) + 'px';
  }
};

CustomMarker.prototype.remove = function() {
  if (this.div) {
    this.div.parentNode.removeChild(this.div);
    this.div = null;
  } 
};

CustomMarker.prototype.getPosition = function() {
  return this.latlng; 
};