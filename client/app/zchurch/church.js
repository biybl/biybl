'use strict';

angular.module('biyblApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/:church', {
        templateUrl: 'app/zchurch/church.html',
        controller: 'ChurchCtrl'
      });
  });
