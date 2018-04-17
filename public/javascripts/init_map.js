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
        //mapTypeId: 'terrain'
        styles: [
              {
                  "elementType": "geometry.fill",
                  "stylers": [
                      {
                          "lightness": -5
                      },
                      {
                          "weight": 2
                      }
                  ]
              },
              {
                  "featureType": "administrative.land_parcel",
                  "elementType": "labels",
                  "stylers": [
                      {
                          "visibility": "off"
                      }
                  ]
              },
              {
                  "featureType": "landscape.natural",
                  "elementType": "geometry.fill",
                  "stylers": [
                      {
                          "color": "#f5f5f5"
                      },
                      {
                          "visibility": "on"
                      }
                  ]
              },
              {
                  "featureType": "poi",
                  "elementType": "geometry.fill",
                  "stylers": [
                      {
                          "color": "#d5dcd3"
                      }
                  ]
              },
              {
                  "featureType": "poi",
                  "elementType": "labels.text",
                  "stylers": [
                      {
                          "visibility": "off"
                      }
                  ]
              },
              {
                  "featureType": "poi.business",
                  "stylers": [
                      {
                          "visibility": "off"
                      }
                  ]
              },
              {
                  "featureType": "poi.park",
                  "elementType": "labels.text",
                  "stylers": [
                      {
                          "visibility": "off"
                      }
                  ]
              },
              {
                  "featureType": "road.arterial",
                  "elementType": "geometry.fill",
                  "stylers": [
                      {
                          "color": "#e6e6e6"
                      }
                  ]
              },
              {
                  "featureType": "road.highway",
                  "elementType": "geometry.fill",
                  "stylers": [
                      {
                          "color": "#dfdfdf"
                      }
                  ]
              },
              {
                  "featureType": "road.highway",
                  "elementType": "geometry.stroke",
                  "stylers": [
                      {
                          "color": "#b4b4b4"
                      }
                  ]
              },
              {
                  "featureType": "road.local",
                  "elementType": "labels",
                  "stylers": [
                      {
                          "visibility": "off"
                      }
                  ]
              }
          ]
      });

      var path = new google.maps.Polyline({
        path: points,
        geodesic: true,
        strokeColor: '#267CB5',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });

      path.setMap(map);

      map.fitBounds(bounds);

      //A profilok az MSSQL adatbázisból lesznek megjelenítve
      //drawProfiles(points, profiles, river_id);

    }else{

    }
  });
}

//#######################################################################
function drawProfiles(){

}
//HORCSA: A profilok az MSSQL adatbázisból lesznek megjelenítve
// function drawProfiles(coordinates, profiles, river_id){
//   let profiles_array = profiles.split(',');
//   let profiles_coordinates = [];
//   $.post( "/rivers/profiles_coordinate", 
//   {
//     river_id: river_id,
//   },
//   function( data ) {
//     if(data){

//       $.each(data, function(i, v){
//         profiles_coordinates.push({name: v.profile, lat: v.lat, lng: v.lng});
//       });

//       //TODO megkeresni a kirajzolandó profilokat a tömbben és megjeleníteni
//       $.each(profiles_array, function(i,v){
//         var profile_obj = profiles_coordinates.find(function (obj) { return obj.name == v; });
//         if(profile_obj){
//           var selected = '';
//           if(i==0)
//             selected = 'selected_profile';
//           var cssClassId = v.replace('.','_');
//           var latLng = new google.maps.LatLng(profile_obj.lat, profile_obj.lng);
//           var custom_marker = new CustomMarker(
//             latLng,
//             map,
//             {
//               marker_id: 'P_' + cssClassId,
//               selected: selected,
//               marker_value: v
//             }
//           );
//         }else{
//           //Ha nincs benne akkor el kell menteni
//           nextMarkerAt = Number(v);//100836.4;
//           nextPoint = moveAlongPath(coordinates, nextMarkerAt);
          
//           if (nextPoint) {
//              // Draw the marker on the map.
//              //map.addOverlay(new google.maps.Marker(nextPoint));
//              //console.log(nextPoint);
//              $.post( "/rivers/profiles_coordinate_save", 
//              {
//               river_id: river_id,
//               point_profile: v,
//               point_lat: nextPoint.lat(),
//               point_lng: nextPoint.lng()
//             },
//             function( data ) {
//               if(data){
//               }
//             });             
//            }
//          }
//       });
//     }else{

//     }
//   });
// }

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
    
    div.className = 'marker ' + self.args.marker_id + ' ' +self.args.selected;
    
    div.style.position = 'absolute';
    div.style.cursor = 'pointer';
    div.style.width = '8px';
    div.style.height = '8px';
    //div.style.background = '$color-panel-heading';
    
    if (typeof(self.args.marker_id) !== 'undefined') {
      div.dataset.marker_id = self.args.marker_id;
    }
    
    google.maps.event.addDomListener(div, "click", function(event) {      
      google.maps.event.trigger(self, "click");
      //alert(self.args.marker_value);
      //$('#profile').val(self.args.marker_id);
      $('#profile option').filter(function() { 
          return ($(this).text() == self.args.marker_value); //To select Blue
      }).prop('selected', true);
      $('#profile').trigger('change');
    });

    var tooltip = document.createElement('div');
    tooltip.innerHTML =self.args.marker_value;
    div.appendChild(tooltip);
    
    var panes = this.getPanes();
    panes.overlayImage.appendChild(div);
  }
  
  var point = this.getProjection().fromLatLngToDivPixel(this.latlng);
  
  if (point) {
    div.style.left = (point.x - 4) + 'px';
    div.style.top = (point.y - 4) + 'px';
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