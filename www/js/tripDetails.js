angular.module('starter.tripDetails', [])
.service('DistanceServiceMatrix', function ($http, $q) {

	var map;
	var origin;
	var destination;
	var deferred;

	function callback (response, status) {
	  if (status != google.maps.DistanceMatrixStatus.OK) {
	    deferred.resolve(status);
	  } else {
	  	deferred.resolve(response);
	  }
	}

	this.calculateDistances = function (_sourceDes) {
		deferred = $q.defer();

		origin = _sourceDes.source;
		destination = _sourceDes.destination;

		var service = new google.maps.DistanceMatrixService();

	  service.getDistanceMatrix(
	    {
	      origins: [origin],
	      destinations: [destination],
	      travelMode: google.maps.TravelMode.DRIVING,
	      unitSystem: google.maps.UnitSystem.METRIC,
	      avoidHighways: false,
	      avoidTolls: false
	    }, callback);

	  return deferred.promise;
	}
})
.service('Cost', function () {
	this.getCost = function (distance) {
		var _km = distance.split(" ")[0];
		
		//Replace ',' from 1,234 like strings
		_km = _km.replace(/\,/g, "");

		var _remainKm = _km - 10;
		var _cost;

		if ( _remainKm > 0 ) {
			_cost = 100 + parseInt(_remainKm) * 10;
		} else {
			_cost = 100;
		}

		return _cost;
	}
})
.service('PlacesNearBy', function ($http, $q) {
	//Direction
	var directionsDisplay = new google.maps.DirectionsRenderer();
	var directionsService = new google.maps.DirectionsService();

	//Find places nearby for a source and destination
	var _hotels,
			_hospitals,
			_police,
			_atms,
			map,
			infowindow;

	this.createMap = function (_lat, _long, _inputs) {
	  var pyrmont = new google.maps.LatLng(_lat, _long);

	  map = new google.maps.Map(document.getElementById('map-canvas'), {
	    center: pyrmont,
	    zoom: 15
	  });

	 // directionsDisplay.setMap(map);

	  var directionRequest = {
	  	origin:_inputs.source,
      destination:_inputs.destination,
      travelMode: google.maps.TravelMode.DRIVING
	  };

	  var request = {
	  	origin:_inputs.source,
      destination:_inputs.destination,
      travelMode: google.maps.TravelMode.DRIVING,
	    location: pyrmont,
	    radius: 500,
	    types: ['bank', 'doctor', 'restaurant', 'pharmacy', 'police']
	  };

	  /*directionsService.route(directionRequest, function(response, status) {
	    if (status == google.maps.DirectionsStatus.OK) {
	      directionsDisplay.setDirections(response);
	    }
	  });*/

	  infowindow = new google.maps.InfoWindow();
	  var service = new google.maps.places.PlacesService(map);
	  service.nearbySearch(request, callback);
	}

	function callback(results, status) {
	  if (status == google.maps.places.PlacesServiceStatus.OK) {
	    for (var i = 0; i < results.length; i++) {
	      createMarker(results[i]);
	    }
	  }
	}

	function createMarker(place) {

		var image = {
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
    };

	  var placeLoc = place.geometry.location;
	  var marker = new google.maps.Marker({
	    map: map,
	    icon: image,
	    position: place.geometry.location,
	    title: place.name
	  });
	}
})
.service('Geoencoding', ['$q', function ($q) {
	var deferred;

	//Return the lat long of a particular string
	this.getLatLong = function (placeStr) {
		var geocoder;
		var address = placeStr;

		deferred = $q.defer();

		geocoder = new google.maps.Geocoder();
		geocoder.geocode( { 'address': address}, function(results, status) {
	    if (status == google.maps.GeocoderStatus.OK) {				
				deferred.resolve(results[0].geometry.location);
	    } else {
	       deferred.reject(status);
	    }
	  });

	  return deferred.promise;

	};

}])
.controller('TripDetailsCtrl', ['$scope', '$http', 'DistanceServiceMatrix', 'Cost', 'DataStore','$stateParams', 'Geoencoding', 'PlacesNearBy', function ($scope, $http, DistanceServiceMatrix, Cost, DataStore, $stateParams, Geoencoding, PlacesNearBy) {

	$scope.matrixData;
	$scope.latVal;
	$scope.longVal;

	var _parsedData,
			_matrixItems = [];

	$scope._planId = $stateParams.planId;
	$scope._tripId = $stateParams.tripId;

	//Hard Coding for now Source and Destination
	var _inputs = {
		source: "",
		destination: ""
	};

 	//Parse JSON response coming from service
	function parseResponse (response) {
		var _rows = response.rows,
				length = _rows.length;
				
		for (var i = 0; i < length; i++) {
			_elements = _rows[i]["elements"];
			for (var j = 0; j < _elements.length; j ++) {
				//Add the cost aspect
				_elements[j]["cost"] = Cost.getCost(_elements[j]["distance"]["text"]);
				_matrixItems.push(_elements[j]);				
			}
		}

		return _matrixItems;
	}

	DataStore.getTrip($scope._tripId).then(function (trip) {
		_inputs.source = trip.get('source');
		_inputs.destination = trip.get('destination');

		///Code to Move later - Geoencoding conversion
		Geoencoding.getLatLong(_inputs.destination).then(function (latLong) {
			$scope.latVal = latLong.k;
			$scope.longVal = latLong.D;

			//Create maps
			PlacesNearBy.createMap(latLong.k, latLong.D, _inputs);

		});

		DistanceServiceMatrix.calculateDistances(_inputs).then(function (response) {
		//Parse the response data to pass it to template
			
			$scope.matrixData = parseResponse (response);
		}, function (reason) {
			console.log(reason);
		});

	});


}]);