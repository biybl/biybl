'use strict';

angular.module('biyblApp')
  .controller('VersesCtrl', function ($scope, bcvParser, $http, User, $cookieStore) {
    
    var currentUser = {};
    if($cookieStore.get('token')) {
      currentUser = User.get();
    }

    $scope.bcvParser = bcvParser;
    $scope.ref_list = "";

    $scope.get_refs = function() {
    	console.log("VersesCtrl/get_refs/$scope.ref_list at start", $scope.ref_list);
    	bcvParser.parse_ref_and_fetch($scope.ref_list, function() {
    		console.log("VersesCtrl/get_refs callback/$scope.bcvParser.passages", $scope.bcvParser.passages);
    	});
    };

    $scope.save_refs = function() {
        // Create list
        var cs_list = "";
        var first_time = true;
        for (var i=0; i<bcvParser.passages.length;i++) {
            if (first_time) {
                cs_list = cs_list + bcvParser.passages[i]["ref"];
                first_time = false;
            } else {
                cs_list = cs_list + "," + bcvParser.passages[i]["ref"];
            }
        }

        console.log("VersesCtrl/save_refs/final output", cs_list);

        User.savePassage({ id: currentUser._id }, {
          passages: cs_list
        }, function(user) {
            console.log(user);
        }, function(err) {
            console.log(err);
        });
    };

  });
