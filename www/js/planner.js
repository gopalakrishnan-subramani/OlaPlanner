angular.module('starter.planner', [])

.factory('Planner', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var plans = [{
    id: 0,
    name: 'Plan 1',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Plan 2',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Plan 3',
    lastText: 'Did you get the ice cream?',
    face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
  }, {
    id: 3,
    name: 'Plan 3',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 4,
    name: 'Plan 4',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
  }];

  return {
    all: function() {
      return plans;
    },
    remove: function(plan) {
      plans.splice(plans.indexOf(plan), 1);
    },
    get: function(planId) {
      for (var i = 0; i < plans.length; i++) {
        if (plans[i].id === parseInt(planId)) {
          return plans[i];
        }
      }
      return null;
    }
  }
})

.factory('DistanceMatrix', ['$http', function ($http) {
  //Find the distance matrix using Google API




  return {
    get: function (sourceDesObj) {
      var _url = "https://maps.googleapis.com/maps/api/distancematrix/json?key=AIzaSyCFsC6RDGPKYR92qRl6IpR5znr5PUCkRjM&origins="+sourceDesObj.sourcename+"&destinations="+sourceDesObj.destinationname+"&mode=driving&language=en-gb";

      //var _url = 'https://maps.googleapis.com/maps/api/distancematrix/json?key=AIzaSyCFsC6RDGPKYR92qRl6IpR5znr5PUCkRjM&origins=Vancouver+BC|Seattle&destinations=San+Francisco|Victoria+BC&mode=bicycling&language=fr-FR';
      
      return $http.get(_url);
    }
  }
}]) 

.controller('PlannerCtrl', function($scope, Planner, DataStore) {
   
  DataStore.getPlans().then(function(plans){
    $scope.plans = plans;
  });

})


.controller('PlannerDetailsCtrl', function($scope, $cordovaDatePicker, $stateParams, $ionicPopup, Planner, DataStore) {
  var plan = DataStore.newPlan();
  var data = {name: 'new plan'};

  $scope.data = data;

  $scope.plan = plan;


  $scope.items = [{title:'Plan1', description:'place-to-place'}];

  if (!$stateParams.planId) {
    console.log('new plan');
    $scope.plan = DataStore.newPlan();
  } else {
    DataStore.getPlan($stateParams.planId).then(function(plan){
       
      $scope.plan = plan;
      $scope.data = {name: plan.get('name')};

      DataStore.getTripsByPlan(plan.id).then(function(trips){
        $scope.trips = trips;
      });

      console.log('got plan');
    });
  }

  $scope.nameChanged = function() {
     
    console.log('name changed', $scope.data.name);

    $scope.plan.set('name', $scope.data.name);

    $scope.plan.save(null, {
      success: function(plan){
        console.log('saved plan');
      },

      error: function(error) {
        console.log('error');
      }
    });

  }

  //$scope.plan = Planner.get($stateParams.planId);




  //$scope.trips = [{id: "D343ffd", source: 'Airport, Bangalore', destination: 'Le Meridien Bangalore'},
  //                {id: "E43ffD", source: 'Le Meridien Bangalore', destination: 'Airport, Bangalore'}
  //                ];

  /*
  $scope.trips = [];

  DataStore.getTrips().then(function(trips){
    $scope.trips = trips;
  });
     */     


  function manageTrip(plan, trip) {

     // An elaborate, custom popup
     var data = {
        source: trip.get('source'),
        destination: trip.get('destination')
     };

     $scope.data = data;

      var tripEditPopup = $ionicPopup.show({
        templateUrl: 'tripedit.html',
        title: 'Trip Details',
        subTitle: 'Please use normal things',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function(e) {
             // if (!$scope.data.source || !$scope.data.destination) {
                //don't allow the user to close unless he enters wifi password
                //e.preventDefault();
              //} else {
                return $scope.data;
              //}
            }
          }
        ]
      });

      tripEditPopup.then(function(data) {
        
        if (data) {
          trip.set('source', data.source);
          trip.set('destination', data.destination);
          if (!trip.get('planId')) {
            trip.set('planId', plan.id.toString());
          }

          trip.save(null, {
            success: function(trip) {
              
              console.log('saved successfully ' + trip.id);
            },

            error: function(error) {
              alert('error ' + error);
            }
          })

        }
        console.log('Tapped!', data);
      });
  }

  $scope.editTrip = function(id) {
     //FIXME: handle datepicker
     //when id is null, new trip
     var trip = null;

     if (!id) {
        trip = new DataStore.newTrip();
        manageTrip($scope.plan, trip);
     } else {
      DataStore.getTrip(id).then(function(trip) {
        manageTrip($scope.plan, trip);
      });
     }
  };

})


.controller('PlannerEditCtrl', function($scope, $stateParams, DistanceMatrix, Planner, DataStore) {
  //Store the source and destination data entered by user
  $scope.planSourceDes = {};
  $scope.distanceMatRes = {};

  $scope.plan = Planner.get($stateParams.planId);
  $scope.message = 'hello';

  //Get distance details  when the user submits the plan form
  $scope.createPlan = function() {
    DistanceMatrix.get($scope.planSourceDes).then(function (res) {
      $scope.distanceMatRes = res;
    });
  };  
});