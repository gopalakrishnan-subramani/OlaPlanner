
angular.module('starter.google.direction', [])
.service('Direction', function ($http, $q) {
        

  //var origin2 = 'Greenwich, England';
  //var destinationB = new google.maps.LatLng(50.087, 14.421);
   
 this.getDirection = function(origin, destination) {
   var deferred = $q.defer();

   var directionsService = new google.maps.DirectionsService();


	var request = {
	  origin:origin,
	  destination:destination,
	  travelMode: google.maps.TravelMode.DRIVING
	};

	directionsService.route(request, function(response, status) {
		if (status == google.maps.DirectionsStatus.OK) {
	  		//directionsDisplay.setDirections(response);
	  		alert(JSON.stringify(response));
	  		console.log(JSON.stringify(response));
	  		return deferred.resolve(response);

		} else {
			return deferred.reject({});
		}

	});

	return deferred.promise;
  }

 });
 

