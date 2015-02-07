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
	//Find places nearby for a source and destination
	var _hotels,
			_hospitals,
			_police,
			_atms;

	function initialize() {

	}

	function callback(results, status) {

	}














})
.controller('TripDetailsCtrl', ['$scope', '$http', 'DistanceServiceMatrix', 'Cost', 'DataStore','$stateParams',function ($scope, $http, DistanceServiceMatrix, Cost, DataStore, $stateParams) {

	$scope.matrixData;
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

		DistanceServiceMatrix.calculateDistances(_inputs).then(function (response) {
		//Parse the response data to pass it to template
			
			$scope.matrixData = parseResponse (response);
		}, function (reason) {
			console.log(reason);
		});

	});
}]);