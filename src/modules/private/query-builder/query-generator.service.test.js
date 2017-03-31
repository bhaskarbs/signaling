'use strict';
describe('QueryGeneratorService Service', function () {
  var QueryGeneratorService,DateService,ConstantService;
  beforeEach(function () {
    module('saintApp');
    inject(function ($injector) {
      QueryGeneratorService = $injector.get('QueryGeneratorService');
      DateService = $injector.get('DateService');
      ConstantService = $injector.get('ConstantService');
    });
    jasmine.getJSONFixtures().fixturesPath = 'base/test/spec/fixtures';
  });
});
