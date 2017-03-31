'use strict';

describe('BarChartService Service', function () {

  var BarChartService, CaseListFactory, ConstantService;

  beforeEach(function () {
    module('saint-config');
    module('saint-authorize');
    module('saintApp', ['UrlServiceProvider', 'Environment', function (UrlServiceProvider, Environment) {
      UrlServiceProvider.setOptions({'useFixture': false, 'Environment': Environment});
    }]);
    inject(function ($injector) {
      BarChartService = $injector.get('BarChartService');
      CaseListFactory = $injector.get('CaseListFactory');
      ConstantService = $injector.get('ConstantService');
    });
  });
  it('BarChartService should exists', function () {
    expect(BarChartService).toBeDefined();
  });
  it('BarChartService should have dependencies', function () {
    expect(CaseListFactory).toBeDefined();
    expect(ConstantService).toBeDefined();
  });
  it('BarChartService should have functions', function () {
    expect(BarChartService.createGraph).toBeDefined();
    expect(Object.keys(BarChartService).length).toEqual(1);
  });
});

