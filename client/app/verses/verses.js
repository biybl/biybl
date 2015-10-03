'use strict';

angular.module('biyblApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/verses', {
        templateUrl: 'app/verses/verses.html',
        controller: 'VersesCtrl'
      });
  });
