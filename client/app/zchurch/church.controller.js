'use strict';

angular.module('biyblApp')
  .controller('ChurchCtrl', function ($scope, $route, $routeParams, User, bcvParser, $http, dbpGrabber) {
    
    $scope.bcvParser = bcvParser;

    $scope.church_name = $routeParams.church;
    $scope.langu = null;
    $scope.refs = "";
    $scope.lang_list = [];
    $scope.dbpGrabber = dbpGrabber;

    console.log($scope.dbpGrabber.langmap);

    $scope.get_passages = function (callback) {
    	// Get verses for the church
    	console.log("starting");
		$http.get('/api/users/' + $scope.church_name + '/passage')
		.then(function(response) {
	      $scope.refs = response.data[0].passages.split(',');
	      console.log("MainCtrl/loading/$scope.churches", $scope.refs);
	      if (callback) callback();
		}, function(err){
	      console.log("MainCtrl/loading/$scope.churches", err);
	      if (callback) callback();
		});
    };


    $scope.set_language = function(lang) {
    	$scope.langu = lang;
    	console.log("lang", lang);
    	$scope.get_passages(function() {
    		console.log("in get_passages");
	    	bcvParser.clear_texts();
    		console.log("cleared");
    		console.log("refs", $scope.refs.length);
	    	for(var i=0; i < $scope.refs.length; i++) {
    			console.log("call bcvParser verse", $scope.refs[i]);
    			console.log("call bcvParser lang", lang);
	    		bcvParser.fetch($scope.refs[i],lang);
	    	}    		
	    	console.log("Passages", bcvParser.passages);
    	});
    };

    $scope.get_passages(function(){});

  });
