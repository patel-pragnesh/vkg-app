Number.prototype.toRad = function() {
    return this * Math.PI / 180;
}

Number.prototype.toDeg = function() {
    return this * 180 / Math.PI;
}

google.maps.LatLng.prototype.moveTowards = function(point, distance) {   
    var lat1 = this.lat().toRad();
    var lon1 = this.lng().toRad();
    var lat2 = point.lat().toRad();
    var lon2 = point.lng().toRad();         
    var dLon = (point.lng() - this.lng()).toRad();

    // Find the bearing from this point to the next.
    var brng = Math.atan2(Math.sin(dLon) * Math.cos(lat2),
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * 
    Math.cos(dLon));

    var angDist = distance / 6371000;  // Earth's radius.

    // Calculate the destination point, given the source and bearing.
    lat2 = Math.asin(Math.sin(lat1) * Math.cos(angDist) + 
    Math.cos(lat1) * Math.sin(angDist) * 
    Math.cos(brng));

    lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(angDist) *
    Math.cos(lat1), 
    Math.cos(angDist) - Math.sin(lat1) *
    Math.sin(lat2));

    if (isNaN(lat2) || isNaN(lon2)) return null;

    return new google.maps.LatLng(lat2.toDeg(), lon2.toDeg());
}

google.maps.LatLng.prototype.kmTo = function(a){ 
    var e = Math, ra = e.PI/180; 
    var b = this.lat() * ra, c = a.lat() * ra, d = b - c; 
    var g = this.lng() * ra - a.lng() * ra; 
    var f = 2 * e.asin(e.sqrt(e.pow(e.sin(d/2), 2) + e.cos(b) * e.cos 
    (c) * e.pow(e.sin(g/2), 2))); 
    return f * 6378.137; 
}

google.maps.Polyline.prototype.inKm = function(n){ 
    var a = this.getPath(n), len = a.getLength(), dist = 0; 
    //console.log(a);
    for (var i=0; i < len-1; i++) { 
       dist += a.getAt(i).kmTo(a.getAt(i+1)); 
    }
    //console.log(dist);
    return dist; 
}

function moveAlongPath(points, distance, index) {     
    //console.log(points.length);   
    index = index || 0;  // Set index to 0 by default.

    if (index < points.length-1) {
        console.log("index: " + index);
        // There is still at least one point further from this point.
        //console.log(points[index].lat());
        // Construct a GPolyline to use the getLength() method.
        var polyline = new google.maps.Polyline(
            {path:[points[index], points[index + 1]]}
        );
        //console.log(polyline.getPath());
        // console.log(polyline[0].lat());
        // Get the distance from this point to the next point in the polyline.
        var distanceToNextPoint = polyline.inKm();
        console.log(distance +' <= '+ distanceToNextPoint*1000);
        if (distance <= distanceToNextPoint*1000) {
            console.log('1');
            // distanceToNextPoint is within this point and the next. 
            // Return the destination point with moveTowards().
            return points[index].moveTowards(points[index + 1], distance);
        }
        else {
            console.log('2');
            // The destination is further from the next point. Subtract
            // distanceToNextPoint from distance and continue recursively.
            return moveAlongPath(points, distance - distanceToNextPoint*1000, index + 1);
        }
    }
    else {
        // There are no further points. The distance exceeds the length  
        // of the full path. Return null.
        return null;
    }  
}

// while (true) {
//       // Call moveAlongPath which will return the GLatLng with the next
//       // marker on the path.
//       nextPoint = moveAlongPath(hernad_coordinates_test, nextMarkerAt);

//       if (nextPoint) {
//          // Draw the marker on the map.
//          map.addOverlay(new google.maps.Marker(nextPoint));

//          // var marker = new google.maps.Marker({
//     //         position: myLatLng,
//     //         map: map,
//     //         title: 'T 6547',
//     //         icon: icon
//     //       });

//          // Add +1000 meters for the next checkpoint.
//          nextMarkerAt += 1000;    
//       }
//       else {
//          // moveAlongPath returned null, so there are no more check points.
//          break;
//       }            
// }