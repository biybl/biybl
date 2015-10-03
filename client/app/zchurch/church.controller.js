'use strict';

angular.module('biyblApp')
  .controller('ChurchCtrl', function ($scope, $route, $routeParams, User, bcvParser, $http, dbpGrabber, Auth) {
    
    $scope.bcvParser = bcvParser;
    $scope.church = $routeParams.church;
    $scope.church_name = "";
    $scope.refs = [];

    $scope.getChurch = function(callback) {
	    User.getName({ id: $scope.church }, {
	    }, function(user) {
	        console.log(user);
	    	$scope.church_name = user.church_name;
	        $scope.refs = user.passages.split(',');
	        if (callback) callback();
	    }, function(err) {
	        if (callback) callback();
	        console.log(err);
	    });
	}

    console.log($scope.User);
    $scope.langu = null;
    $scope.refs = "";
    $scope.lang_list = [];
    $scope.dbpGrabber = dbpGrabber;

    console.log($scope.dbpGrabber.langmap);


    $scope.remove_language = function() {
    	$scope.langu = null;
    };

    $scope.set_language = function(lang) {
    	$scope.langu = lang;
    	console.log("lang", lang);
    	$scope.getChurch(function() {
    		console.log("in get_passages");
	    	bcvParser.set_refs($scope.refs, lang, true);
	    	console.log("Passages", bcvParser.passages);
    	});
    };

    $scope.getChurch(function(){});

  });
