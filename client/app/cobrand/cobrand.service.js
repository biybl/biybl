'use strict';

angular.module('biyblApp')
  .service('cobrand', function () {
    return {
      
      logo: "/assets/images/BIYBL-Logo.png",
      branded: false,

      setBrand: function(src){
        this.logo = src;
        this.branded = true;
      }
    }
  });
