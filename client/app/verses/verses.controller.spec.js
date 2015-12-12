'use strict';

describe('Controller: VersesCtrl', function () {

  // load the controller's module
  beforeEach(module('biyblApp'));

  var VersesCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    VersesCtrl = $controller('VersesCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
