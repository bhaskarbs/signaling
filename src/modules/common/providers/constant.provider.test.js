'use strict';

describe('ConstantService Service', function () {

  var ConstantService;

  beforeEach(function () {
    module('saintApp');
    inject(function ($injector) {
      ConstantService = $injector.get('ConstantService');
    });
  });
  it('should exists', function () {
    expect(ConstantService).toBeDefined();
  });
});
