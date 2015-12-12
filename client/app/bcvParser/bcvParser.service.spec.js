'use strict';

describe('Service: bcvParser', function () {

  // load the service's module
  beforeEach(module('biyblApp'));

  // instantiate service
  var bcvParser;
  beforeEach(inject(function (_bcvParser_) {
    bcvParser = _bcvParser_;
  }));

  it('should do something', function () {
    expect(!!bcvParser).toBe(true);
  });

});
