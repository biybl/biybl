'use strict';

angular.module('biyblApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth, cobrand) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }, {
      'title': 'About',
      'link': '/about'
    }, {
      'title': 'Find Your Church',
      'link': '/findchurch'
    } ];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.cobrand = cobrand;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };

    $scope.activeClick = function(route) {
      if (route === $location.path()) {
        $scope.isCollapsed = true;
      }
    }
  });
