angular.module('starter.krish', [])

.controller('AccountCtrl', function($scope, DataStore,Distance, Direction) {
  if (Distance) {

  var origin = 'RBI Layout, Bangalore';
  //var destination = new google.maps.LatLng(50.087, 14.421);
   var destination = "HSR Layout, Bangalore";

    Distance.getDistance(origin, destination).then(function(results){
      alert(results.length);
    });
  }

  if (Direction) {
    //var origin2 = 'Greenwich, England';
   // var destinationB = new google.maps.LatLng(50.087, 14.421);
   var origin = "RBI Layout, Bangalore";
   var destination = "Konanakunte, Bangalore";
     
      //Direction.getDirection(origin, destination);
  }


  $scope.onMapReady = function(map) {
     
        var geocoder = new google.maps.Geocoder();
        
          var address = "RBI Layout, Bangalore";

          geocoder.geocode( { 'address': address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              map.setCenter(results[0].geometry.location);
              alert(JSON.stringify(results[0].geometry.location));
              var marker = new google.maps.Marker({
                  map: map,
                  position: results[0].geometry.location
              });
            } else {
              alert('Geocode was not successful for the following reason: ' + status);
            }
          });





        //map.setCenter(new google.maps.LatLng(12.9667, 77.5667));
            
        var markers = [];
        
        // place a marker
        function setMarker(map, position, title, content) {
            var marker;
            var markerOptions = {
                position: position,
                map: map,
                title: title,
                icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
            };

            marker = new google.maps.Marker(markerOptions);
            markers.push(marker); // add marker to array
            
            google.maps.event.addListener(marker, 'click', function () {
                // close window if not undefined
                if (infoWindow !== void 0) {
                    infoWindow.close();
                }
                // create new window
                var infoWindowOptions = {
                    content: content
                };
                infoWindow = new google.maps.InfoWindow(infoWindowOptions);
                infoWindow.open(map, marker);
            });
        }
        
        
        //setMarker(map, new google.maps.LatLng(12.9667, 77.5667), 'Bangalore', 'Just some content');
       // setMarker(map, new google.maps.LatLng(12.8879878, 77.58181209999998), 'RBI Layout', 'More content');
        //setMarker(map, new google.maps.LatLng(48.856614, 2.352222), 'Paris', 'Text here');
    
  };
    
     
  

  $scope.settings = {
    enableFriends: true
  };
});
