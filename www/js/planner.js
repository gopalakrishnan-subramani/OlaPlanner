angular.module('starter.planner', [])
.service('PlaceAutoComplete', function () {
  this.initialize = function () {
    var input = /** @type {HTMLInputElement} */(
      document.getElementById('pac-input'));
  };
})
.controller('PlannerCtrl', function($scope, DataStore) {
  console.log('refresh plans');

    function refresh() {
        DataStore.getPlans().then(function(plans){
           $scope.plans = plans;
        });
    }

  $scope.deletePlan = function(plan){
    plan.destroy();
    refresh();
  };

   $scope.$on( "$ionicView.enter", function( scopes, states ) {
            //if( states.fromCache && states.stateName == "tab.tabAList" ) {
            //    reloadItems();
           // }

           refresh();

          // alert('helo');
        });
})


.controller('PlannerDetailsCtrl', function($scope, $timeout, $cordovaDatePicker, $stateParams, $ionicPopup, Distance, DataStore, PlaceAutoComplete) {
  var plan = DataStore.newPlan();
  var plan_data = {name: ''};

  $scope.plan_data = plan_data;

  $scope.plan = plan;

  $scope.amount = null;

  $scope.hours = [];
  for(i = 0; i < 24; i++) {
    $scope.hours.push(i);
  }

  $scope.minutes = [];
  for(i = 0; i < 60; i++) {
    $scope.minutes.push(i);
  }

  function refreshTrip() {
    DataStore.getTripsByPlan($scope.plan.id).then(function(trips){
        $scope.trips = trips;
        
        var amount = 0;
        var wait_time_amount = 0;
        var total = 0;

        trips.each(function(trip){
          if (trip.get('distance_value')) {
            amount += (trip.get('distance_value') / 1000.0) * 10.0;
            trip.set('amount', ((trip.get('distance_value') / 1000.0) * 10.0).toFixed(2));

            if (trip.get('planned_hours') && trip.get('planned_hours') <= .5) {
              trip.set('wait_time', trip.get('planned_hours') * 120);
              wait_time_amount += trip.get('planned_hours') * 120;
            }
          }
        });

        $scope.amount = amount.toFixed(2);

        $scope.wait_time_amount = wait_time_amount.toFixed(2);

        $scope.total = (amount + wait_time_amount).toFixed(2);

      });
  }

  if (!$stateParams.planId) {
    console.log('new plan');
    $scope.plan = DataStore.newPlan();
  } else {
    DataStore.getPlan($stateParams.planId).then(function(plan){
       
      $scope.plan = plan;
      $scope.plan_data = {name: plan.get('name')};

      refreshTrip();
       

      console.log('got plan');
    });
  }



  $scope.nameChanged = function() {
     
    console.log('name changed', $scope.plan_data.name);

    $scope.plan.set('name', $scope.plan_data.name);

    $scope.plan.save(null, {
      success: function(plan){
        console.log('saved plan');
        
        //$scope.data.name = plan.get('name');
        $scope.$apply(function () {
          $scope.plan = plan;
          $scope.message = 'plan saved...';
        });

        $timeout(function() {
          $scope.$apply(function () {
            $scope.message = '';
          });

        }, 2000);


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
        destination: trip.get('destination'),
        planned_hours: trip.get('planned_hours'),
        plannedAt: trip.get('plannedAt')
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


          trip.set('plannedAt', data.plannedAt);

           

          try {
               trip.set('planned_hours', parseFloat(data.planned_hours));
          }catch(ex) {

          }
         

          if (!trip.get('planId')) {
            trip.set('planId', plan.id.toString());
          }


          Distance.getDistance(data.source, data.destination).then(function(results){
            if (results.length > 0){
              var distance = results[0];
              trip.set('distance', distance.distance.text);
              trip.set('distance_value', distance.distance.value);
              trip.set('duration', distance.duration.text);
              trip.set('duration_value', distance.duration.value);
 
              trip.save(null, {
                success: function(trip) {
                  
                  console.log('saved successfully ' + trip.id);

                 refreshTrip();

                },

              error: function(error) {
                //alert('error ' + error);
              }
            });


            }
          });

          

        }
        console.log('Tapped!', data);
      });
  }

  $scope.deleteTrip = function(trip){
      trip.destroy();
      refreshTrip();
  };

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

  PlaceAutoComplete.initialize();

});