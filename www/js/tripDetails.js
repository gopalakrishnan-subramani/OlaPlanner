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
.controller('TripDetailsCtrl', ['$scope', '$http', 'DistanceServiceMatrix', function ($scope, $http, DistanceServiceMatrix) {

	$scope.matrixData;

	//Hard Coding for now Source and Destination
	var _inputs = {
		source: "bangalore",
		destination: "mysore"
	};

	var _parsedData,
			_matrixItems = [];

	//Parse JSON response coming from service
	function parseResponse (response) {
		var _rows = response.rows,
				length = _rows.length;
				
		for (var i = 0; i < length; i++) {
			_elements = _rows[i]["elements"];
			for (var j = 0; j < _elements.length; j ++) {
				_matrixItems.push(_elements[j]);				
			}
		}

		$scope.matrixData = _matrixItems;
		console.log($scope.matrixData);
	}

	DistanceServiceMatrix.calculateDistances(_inputs).then(function (response) {
		//Parse the response data to pass it to template
		parseResponse (response);
	}, function (reason) {
		console.log(reason);
	});

}]);