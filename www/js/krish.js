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
.controller('AccountCtrl', function($scope, DataStore, Distance) {
  if (Distance) {

  var origin2 = 'Greenwich, England';
  var destinationB = new google.maps.LatLng(50.087, 14.421);
   
    Distance.getDistance(origin2, destinationB);
  }

   

  $scope.settings = {
    enableFriends: true
  };
});
