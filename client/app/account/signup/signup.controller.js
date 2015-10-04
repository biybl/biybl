'use strict';

angular.module('biyblApp')
  .controller('SignupCtrl', function ($scope, Auth, $location, $timeout) {

    $scope.user = {
      church_name: "",
      name: "",
      email: "",
      password: ""
    };
    $scope.errors = {};
    $scope.checking_name = false;
    $scope.un_ok = false;

    var un_timer;
    var cname_timer;

    $scope.fill_un = function() {
      // Create suggested slug
      var name = $scope.user.church_name;
      name = name.replace(/\bthe\b(\s+)?/ig, "");
      name = name.replace(/\bchurch|assembly|tabernacle|christian\b(\s+)?/ig, "");
      name = name.replace(/\bSaint\b(\s+)?/ig, "st");
      name = name.replace(/\W/g, '');
      $scope.user.name = name.toLowerCase();
      //$scope.check_name();
    };

    $scope.un_change = function() {
      //console.log("un_change");
      //console.log("Timeout", un_timer);
      //$timeout.cancel(un_timer);
      //console.log("Timeout", un_timer);
      //un_timer = $timeout($scope.check_name(),1000);
    };

    $scope.check_name = function() {
      //check with DB
      //update if necessary
      //console.log("im in");
      //$scope.checking_name = true;
      //$timeout.cancel(cname_timer);
      //cname_timer = $timeout(function(){$scope.checking_name = false;},1000);
      //$scope.ok = true;
    };

    $scope.register = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.createUser({
          church_name: $scope.user.church_name,
          name: $scope.user.name,
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          // Account created, redirect to home
          $location.path('/verses');
        })
        .catch( function(err) {
          err = err.data;
          $scope.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
        });
      }
    };

  });
