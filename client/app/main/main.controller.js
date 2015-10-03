'use strict';

angular.module('biyblApp')
  .controller('MainCtrl', function ($scope, $http, socket, bcvParser, dbpGrabber) {
    $scope.bcvParser = bcvParser;
    $scope.refs_list = [];

    console.log($scope.User);
    $scope.langu = null;
    $scope.refs = [];
    $scope.ref_list = "";
    $scope.lang_list = [];
    $scope.dbpGrabber = dbpGrabber;

    $scope.get_refs = function() {
      bcvParser.parse_ref_and_fetch($scope.ref_list, function() {
        // put refs in $scope_refs;
        $scope.refs = [];
        for(var i=0; i< bcvParser.passages.length; i++) {
          console.log("i", i);
          $scope.refs.push(bcvParser.passages[i]['ref']);
        }
        console.log("Scope.refs", $scope.refs);
        if ($scope.langu) {
          $scope.set_language($scope.langu);
        }
      });
    };

    $scope.remove_language = function() {
      $scope.langu = null;
    };

    $scope.set_language = function(lang) {
      $scope.langu = lang;
      bcvParser.set_refs($scope.refs, lang, true);
    };

  });
