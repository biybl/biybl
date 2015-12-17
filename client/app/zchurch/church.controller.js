'use strict';

angular.module('biyblApp')
  .controller('ChurchCtrl', function ($scope, $route, $routeParams, User, bcvParser, $http, dbpGrabber, Auth, $sce) {
    
    $scope.bcvParser = bcvParser;
    $scope.church = $routeParams.church;
    $scope.church_name = "";
    $scope.sermonNotes = "";
    $scope.refs = [];
    $scope.langSub = "";

    $scope.getChurch = function(callback) {
	    User.getName({ id: $scope.church }, {
	    }, function(user) {
	        console.log(user);
            $scope.church_name = user.church_name;
	    	$scope.sermonNotes = user.sermonNotes;
            $scope.langSub = user.lang_sub;
            console.log("langSub", $scope.langSub);

	        $scope.refs = user.passages.split(',');
            console.log("bcvParser", bcvParser.passages);
            console.log("bcvParser length", bcvParser.passages.length);
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
        localStorage.removeItem('biyblLangu');
    };

    $scope.set_language = function(lang) {
    	$scope.langu = lang;
    	console.log("lang", lang);
        localStorage.biyblLangu = lang;
    	$scope.getChurch(function() {
    		console.log("in get_passages");
	    	bcvParser.set_refs($scope.refs, lang, true);
	    	console.log("Passages", bcvParser.passages);
            console.log("bcvParser length", bcvParser.passages.length);
    	});
    };

    $scope.getChurch(function(){});

    // Check localstorage for language 
    if (localStorage.biyblLangu)  {
      $scope.set_language(localStorage.biyblLangu);
      console.log("setting LS langu:", localStorage.biyblLangu);
    }

    $scope.to_trusted = function(html_code) {
        return $sce.trustAsHtml(html_code);
    };

    $scope.filterLangSub = function(items) {
        var result = {};
        angular.forEach(items, function(value, key) {
            if ($scope.langSub.indexOf(key) > -1) {
                result[key] = value;
            }
        });
        return result;
    };

  });
