angular.module('starter.krish', [])

.controller('AccountCtrl', function($scope, DataStore,Distance, Direction) {
  if (Distance) {

  var origin2 = 'Greenwich, England';
  var destinationB = new google.maps.LatLng(50.087, 14.421);
   
   // Distance.getDistance(origin2, destinationB);
  }

  if (Direction) {
    //var origin2 = 'Greenwich, England';
   // var destinationB = new google.maps.LatLng(50.087, 14.421);
   var origin = "RBI Layout, Bangalore";
   var destination = "Konanakunte, Bangalore";
     
      //Direction.getDirection(origin, destination);
  }


  $scope.onMapReady = function(map) {
     

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
        
        
        setMarker(map, new google.maps.LatLng(51.508515, -0.125487), 'London', 'Just some content');
        setMarker(map, new google.maps.LatLng(52.370216, 4.895168), 'Amsterdam', 'More content');
        setMarker(map, new google.maps.LatLng(48.856614, 2.352222), 'Paris', 'Text here');
    

  };
    
     
  

  $scope.settings = {
    enableFriends: true
  };
});
