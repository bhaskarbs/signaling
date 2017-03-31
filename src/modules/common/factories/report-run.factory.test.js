'use strict';
describe('ReportRunFactory Service', function () {
  var ReportRunFactory, $window, UrlService, $httpBackend;
  beforeEach(function () {
    module('saint-config');
    module('saintApp', ['UrlServiceProvider', 'Environment', function (UrlServiceProvider, Environment) {
      UrlServiceProvider.setOptions({'useFixture': false, 'Environment': Environment});
    }]);
    inject(function ($injector) {
      ReportRunFactory = $injector.get('ReportRunFactory');
      $window = $injector.get('$window');
      UrlService = $injector.get('UrlService');
      $httpBackend = $injector.get('$httpBackend');
    });
    jasmine.getJSONFixtures().fixturesPath = 'base/test/spec/fixtures';
    $httpBackend.whenGET('i18n/resources-locale_en-US.js').respond({});
    $httpBackend.whenGET('i18n/resources-locale_en-us.js').respond({});
    $httpBackend.whenGET('i18n/resources-locale_en-IN.js').respond({});
  });

  it('should exists', function () {
    expect(ReportRunFactory).toBeDefined();
  });

  it('should have dependencies', function () {
    expect(UrlService).toBeDefined();
  });

  it('should have these functions', function () {
    expect(ReportRunFactory.openGenericReport).toBeDefined();
    expect(Object.keys(ReportRunFactory).length).toEqual(1);
  });

  it('openGenericReport should test window open event', function () {
    spyOn($window, 'open').and.callFake(function () {
      return true;
    });
    ReportRunFactory.openGenericReport(1);
    var arg = window.open.calls.mostRecent().args;
    expect($window.open).toHaveBeenCalled();
    expect($window.open).toHaveBeenCalledWith(arg[0]);
  });

});
