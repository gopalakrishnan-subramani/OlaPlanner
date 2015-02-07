angular.module('starter.google.distance', [])
.service('Distance', function ($http, $q) {
        

  //var origin2 = 'Greenwich, England';
  //var destinationB = new google.maps.LatLng(50.087, 14.421);
   
 this.getDistance = function(origin, destination) {
   //alert('called'); //

   var deferred = $q.defer();
    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
    {
      origins: [origin],
      destinations: [destination],
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false
    }, function(response, status){
        if (status != google.maps.DistanceMatrixStatus.OK) {
          alert('Error was: ' + status);
          return deferred.reject(error);
        } else {
          // alert('got');


           var origins = response.originAddresses;
            var destinations = response.destinationAddresses;
             
            var distanceResults = [];
             
            for (var i = 0; i < origins.length; i++) {
              var results = response.rows[i].elements;
               
              for (var j = 0; j < results.length; j++) {
                console.log(JSON.stringify(results[j]));
                distanceResults.push(results[j]);
              }
            }
          
          return deferred.resolve(distanceResults);
        }
      }
    );


    return deferred.promise;
  }

 });
 

