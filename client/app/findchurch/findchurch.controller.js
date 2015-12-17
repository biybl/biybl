'use strict';

angular.module('biyblApp')
  .controller('FindchurchCtrl', function ($scope, $http, socket, $rootScope) {
    $scope.churches = [];
    $scope.searchKeyword = "";
    
    $http.get($rootScope.globalURL + '/api/users/all').success(function(churches) {
      $scope.churches = churches;
      socket.syncUpdates('user', $scope.churches);
    });

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('user');
    });
  });
