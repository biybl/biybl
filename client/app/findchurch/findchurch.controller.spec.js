'use strict';

describe('Controller: FindchurchCtrl', function () {

  // load the controller's module
  beforeEach(module('biyblApp'));

  var FindchurchCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FindchurchCtrl = $controller('FindchurchCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
