'use strict';

describe('Controller: ChurchCtrl', function () {

  // load the controller's module
  beforeEach(module('biyblApp'));

  var ChurchCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ChurchCtrl = $controller('ChurchCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
