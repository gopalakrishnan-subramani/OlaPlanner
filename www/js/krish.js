angular.module('starter.krish', [])
/*
.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})
*/
.controller('AccountCtrl', function($scope, DataStore) {
  if (DataStore) {
    

      DataStore.getPlans().then(function(plans){
        plans.each(function(plan){
          console.log(plan.get('source'));
        });
      });
    // Create a new instance of that class.
        


    DataStore.getPlan("C1wwO7sWGb").then(function (plan) {

    },
    function(err) {
      alert("Error " + err);
    }
    );
  }

  $scope.settings = {
    enableFriends: true
  };
});
