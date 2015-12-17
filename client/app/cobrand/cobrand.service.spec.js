'use strict';

describe('Service: cobrand', function () {

  // load the service's module
  beforeEach(module('biyblApp'));

  // instantiate service
  var cobrand;
  beforeEach(inject(function (_cobrand_) {
    cobrand = _cobrand_;
  }));

  it('should do something', function () {
    expect(!!cobrand).toBe(true);
  });

});
