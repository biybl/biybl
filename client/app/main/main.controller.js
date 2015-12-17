'use strict';

angular.module('biyblApp')
  .controller('MainCtrl', function ($scope, $http, socket, bcvParser, dbpGrabber, Auth, $location) {
    $scope.bcvParser = bcvParser;
    $scope.refs_list = [];

    console.log($scope.User);
    $scope.langu = null;
    $scope.refs = [];
    $scope.ref_list = "";
    $scope.lang_list = [];
    $scope.dbpGrabber = dbpGrabber;

    if (Auth.isLoggedIn()) { $location.path( "/verses" ); };

    $scope.get_refs = function() {
      bcvParser.parse_ref_and_fetch($scope.ref_list, function() {
        // put refs in $scope_refs;
        $scope.refs = [];
        for(var i=0; i< bcvParser.passages.length; i++) {
          $scope.refs.push(bcvParser.passages[i]['ref']);
        }
        if ($scope.langu) {
          $scope.set_language($scope.langu);
        }
      });
    };

    $scope.remove_language = function() {
      $scope.langu = null;
      localStorage.biyblLangu = null;
    };

    $scope.set_language = function(lang) {
      $scope.langu = lang;
      localStorage.biyblLangu = lang;
      bcvParser.set_refs($scope.refs, lang, true);
    };

    // Check localstorage for language 
    if (localStorage.biyblLangu)  {
      $scope.set_language(localStorage.biyblLangu);
      console.log("setting LS langu:", localStorage.biyblLangu);
    }
    
  });
