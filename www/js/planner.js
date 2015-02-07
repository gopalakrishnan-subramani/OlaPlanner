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

.controller('PlannerCtrl', function($scope, Planner) {
  $scope.plans = Planner.all();
})


.controller('PlannerDetailsCtrl', function($scope, $stateParams, Planner) {
  $scope.plan = Planner.get($stateParams.planId);
})


.controller('PlannerEditCtrl', function($scope, $stateParams, DistanceMatrix, Planner) {
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