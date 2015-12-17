'use strict';

angular.module('biyblApp')
  .factory('User', function ($resource, $rootScope) {
    return $resource('/api/users/:id/:controller', {
      id: '@_id'
    },
    {
      changePassword: {
        method: 'PUT',
        params: {
          controller:'password'
        }
      },
      get: {
        method: 'GET',
        params: {
          id:'me'
        }
      },
      savePassage: {
        method: 'put',
        params: {
          controller: 'passage'
        }
      },
      getName: {
        method: 'get',
        params: {
          controller: 'name'
        }
      }
	  });
  });
