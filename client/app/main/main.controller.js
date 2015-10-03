'use strict';

angular.module('biyblApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.churches = [];

    $http.get('/api/users/all').success(function(churches) {
      $scope.churches = churches;
      console.log("MainCtrl/loading/$scope.churches", $scope.churches);
      socket.syncUpdates('user', $scope.churches);
    });

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('user');
    });
  });
