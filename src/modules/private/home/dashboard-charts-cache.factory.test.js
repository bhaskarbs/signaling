'use strict';
describe('DashboardChartsCacheFactory Factory', function () {
var DashboardChartsCacheFactory, svgElementMap, cuid, svg, isImage, svgData;
  beforeEach(function () {
    module('saint-config');
    module('saintApp', ['UrlServiceProvider', 'Environment', function (UrlServiceProvider, Environment) {
      UrlServiceProvider.setOptions({'useFixture': false, 'Environment': Environment});
    }]);
    inject(function ($injector) {
     DashboardChartsCacheFactory = $injector.get('DashboardChartsCacheFactory');
    });
    jasmine.getJSONFixtures().fixturesPath = 'base/test/spec/fixtures';
  });

    cuid= 'AaodYYSWA6xJqk.cIIUbKGA';
    svg='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAYgAAAEoCAYAAABCX2bIAACAAElEQVR42uy9d1sb2ZY1Ph';
    isImage=true;

    svgElementMap = [];

  it('should exists', function () {
    expect(DashboardChartsCacheFactory).toBeDefined();
  });

  it('should have these functions', function () {
     expect(DashboardChartsCacheFactory.setSvgElementMap).toBeDefined();
     expect(DashboardChartsCacheFactory.getSvgElementMap).toBeDefined();
  });

  it('setSvgElementMap() should set the values of cuid, svg and isImage into map object', function () {
    DashboardChartsCacheFactory.setSvgElementMap(cuid,svg,isImage);
  });

  it('getSvgElementMap() should return the values map of cuid, svg and isImage', function () {
      svgData = DashboardChartsCacheFactory.getSvgElementMap();
    });

});
