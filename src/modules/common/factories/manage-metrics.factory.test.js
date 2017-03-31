'use strict';
/* FIXME: Veer is working on this */
describe('Manage Metric Service', function () {
  var ManageMetrics, $httpBackend, ManageMetricsData, $http, $q, UrlService, alertService, LanguageService;
  beforeEach(function () {
    module('saint-config');
    module('saintApp', ['UrlServiceProvider', function (UrlServiceProvider) {
      UrlServiceProvider.setOptions({'useFixture': false});
    }]);
    inject(function ($injector) {
      ManageMetrics = $injector.get('ManageMetricsFactory');
      ManageMetricsData = ManageMetrics.data;
      //ProductEntity = $injector.get('ProductEntity');
      //IngredientEntity = $injector.get('IngredientEntity');
      $q = $injector.get('$q');
      $httpBackend = $injector.get('$httpBackend');
      $http = $injector.get('$http');
      UrlService = $injector.get('UrlService');
      alertService = $injector.get('alertService');
      LanguageService = $injector.get('LanguageService');
    });
    jasmine.getJSONFixtures().fixturesPath = 'base/test/spec/fixtures';
    $httpBackend.whenGET('i18n/resources-locale_en-US.js').respond({});
    $httpBackend.whenGET('i18n/resources-locale_en-us.js').respond({});
    $httpBackend.whenGET('i18n/resources-locale_en-IN.js').respond({});
  });
  var isAngularPromise = function (value) {
    if (typeof value.then !== 'function') {
      return false;
    }
    var promiseThenSrc = String($q.defer().promise.then);
    var valueThenSrc = String(value.then);
    return promiseThenSrc === valueThenSrc;
  };

  it('should exists', function () {
    expect(ManageMetrics).toBeDefined();
  });

  it('should have dependencies', function () {
    expect($http).toBeDefined();
    expect($q).toBeDefined();
    expect(UrlService).toBeDefined();
    expect(alertService).toBeDefined();
    expect(LanguageService).toBeDefined();

  });

  it('should have objects', function () {
    expect(ManageMetricsData).toBeDefined();
    expect(Object.keys(ManageMetricsData).length).toEqual(0);
  });

  it('should have these functions', function () {
    expect(ManageMetrics.getSavedMetricsCharts).toBeDefined();
    expect(ManageMetrics.data).toBeDefined();
    expect(Object.keys(ManageMetrics).length).toEqual(4);
  });

  it('getSavedMetricsCharts() should return promise which executes BACKEND API calls and return successful response objects', function (done) {
    var testCaseUrl = UrlService.getService('GET_SAVED_LUMIRA_IDS');
    $httpBackend.whenGET(function (actualUrl) {
      return actualUrl.indexOf(testCaseUrl) > -1;
    }).respond(getJSONFixture('manage-metrics.get-saved-metrics-charts.test.json'));
    var promiseObject = ManageMetrics.getSavedMetricsCharts().then(function (result) {
      expect(result.data).toBeDefined();
      expect(result.message).toBeDefined();
      done();
    });
    $httpBackend.flush();
    expect(promiseObject).toBeDefined();
    expect(isAngularPromise(promiseObject)).toBeTruthy();
  });
  it('getSavedMetricsCharts() should return promise which executes BACKEND API calls and return failed response objects', function (done) {
    var testCaseUrl = UrlService.getService('GET_SAVED_LUMIRA_IDS');
    $httpBackend.whenGET(function (actualUrl) {
      return actualUrl.indexOf(testCaseUrl) > -1;
    }).respond(null);
    var promiseObject = ManageMetrics.getSavedMetricsCharts().then(function (result) {
      expect(result.error).toBeDefined();
      expect(result.message).toBeDefined();
      done();
    });
    $httpBackend.flush();
    expect(promiseObject).toBeDefined();
    expect(isAngularPromise(promiseObject)).toBeTruthy();
  });
});
