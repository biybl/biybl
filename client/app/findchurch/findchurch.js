'use strict';

angular.module('biyblApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/findchurch', {
        templateUrl: 'app/findchurch/findchurch.html',
        controller: 'FindchurchCtrl'
      });
  });
