'use strict';

angular.module('biyblApp')
  .controller('VersesCtrl', function ($scope, bcvParser) {
    
    $scope.bcvParser = bcvParser;
    $scope.ref_list = "";

    $scope.get_refs = function() {
    	console.log("VersesCtrl/get_refs/$scope.ref_list at start", $scope.ref_list);
    	bcvParser.parse_ref_and_fetch(ref_list, function() {
    		console.log("VersesCtrl/get_refs callback/$scope.bcvParser.passages", $scope.bcvParser.passages);
    	});
    };

  });
