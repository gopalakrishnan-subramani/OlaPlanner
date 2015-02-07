angular.module('starter.pulak', [])
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
*/
.controller('FriendsCtrl', function($scope, Locations) {
  $scope.friends = Locations.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Locations) {
  $scope.friend = Locations.get($stateParams.friendId);
})
/*
.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
*/