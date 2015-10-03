'use strict';

describe('Service: dbpGrabber', function () {

  // load the service's module
  beforeEach(module('biyblApp'));

  // instantiate service
  var dbpGrabber;
  beforeEach(inject(function (_bcvParser_) {
    dbpGrabber = _dbpGrabber_;
  }));

  it('should do something', function () {
    expect(!!dbpGrabber).toBe(true);
  });

});
