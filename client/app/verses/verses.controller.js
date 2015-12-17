'use strict';

angular.module('biyblApp')
  .controller('VersesCtrl', function ($scope, bcvParser, dbpGrabber, $http, User, $cookieStore, $timeout) {
    
    var currentUser = {};
    if($cookieStore.get('token')) {
      currentUser = User.get(function(){
        console.log("in callback");
        console.log("name", currentUser.name);
        $scope.church = currentUser.name;
        $scope.getChurch(function() {
            console.log("in get_passages");
            bcvParser.set_refs($scope.refs, 'en', true);
            console.log("Passages", bcvParser.passages);
        });        
      });
    }

    $scope.bcvParser = bcvParser;
    $scope.dbpGrabber = dbpGrabber;

    $scope.ref_list = "";
    $scope.saving_refs = false;
    $scope.refs_saved = false;
    $scope.refs = [];
    $scope.sermonNotes = "";
    $scope.langSub = "";

/*    $scope.froalaOptions = {
        toolbarButtons : ["bold", "italic", "underline", "|", "align", "formatOL", "formatUL"]
     }*/
    //$scope.church = 'citychurch';

    $scope.getChurch = function(callback) {
        User.getName({ id: $scope.church }, {
        }, function(user) {
            console.log(user);
            $scope.church_name = user.church_name;
            $scope.sermonNotes = user.sermonNotes;
            $scope.langSub = user.lang_sub;
            $scope.refs = user.passages.split(',');
            $scope.ref_list = $scope.refs.join(',');
            console.log("user.lang_sub", user.lang_sub);
            console.log("user", user);
            if (callback) callback();
        }, function(err) {
            if (callback) callback();
            console.log(err);
        });
    }

    /*$scope.getChurch(function() {
        console.log("in get_passages");
        bcvParser.set_refs($scope.refs, 'en', true);
        console.log("Passages", bcvParser.passages);
    });*/

    $scope.get_refs = function() {
    	console.log("VersesCtrl/get_refs/$scope.ref_list at start", $scope.ref_list);
    	bcvParser.parse_ref_and_fetch($scope.ref_list, function() {
    		console.log("VersesCtrl/get_refs callback/$scope.bcvParser.passages", $scope.bcvParser.passages);
    	});
    };

    $scope.save_refs = function() {
        // Create list
        $scope.refs_saved = false;
        $scope.saving_refs = true;

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

        console.log("VersesCtrl/save_refs/final sermonNotes", $scope.sermonNotes);

        User.savePassage({ id: currentUser._id }, {
          passages: cs_list,
          sermonNotes: $scope.sermonNotes,
          langSub: $scope.langSub
        }, function(user) {
            $scope.saving_refs = false;
            $scope.refs_saved = true;
            console.log(user);
        }, function(err) {
            console.log(err);
        });
    };

    $scope.appendList = function(langKey) {
        // If it's on the list remove
        if ($scope.langSub.indexOf(langKey) > -1) {
            console.log("in the top if");
            console.log("langKey", langKey);
            console.log("$scope.langsub", $scope.langSub);
            $scope.langSub = $scope.langSub.replace(langKey,"");
        } else {
            console.log("in the bottom else");
            console.log("langKey", langKey);
            console.log("$scope.langsub", $scope.langSub);
            $scope.langSub = $scope.langSub + " " + langKey;
        }
        $scope.langSub = $scope.langSub.trim();
        console.log("LangSub at end of function:", $scope.langSub);      
        $scope.save_refs();
    };

  });
