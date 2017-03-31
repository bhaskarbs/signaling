'use strict';
describe('NotificationFactory Service', function () {
  var NotificationFactory,$http,$q,LanguageService,UrlService,NotificationEntity, alertService,$httpBackend,NotificationFactoryData;
  beforeEach(function () {
    module('saint-config');
    module('saintApp', ['UrlServiceProvider', 'Environment', function (UrlServiceProvider, Environment) {
      UrlServiceProvider.setOptions({'useFixture': false, 'Environment': Environment});
    }]);
    inject(function ($injector) {
      NotificationFactory = $injector.get('NotificationFactory');
      $http = $injector.get('$http');
      $q = $injector.get('$q');
      LanguageService = $injector.get('LanguageService');
      UrlService = $injector.get('UrlService');
      NotificationEntity = $injector.get('NotificationEntity');
      alertService = $injector.get('alertService');
      $httpBackend = $injector.get('$httpBackend');
      NotificationFactoryData = NotificationFactory.data;
    });
    jasmine.getJSONFixtures().fixturesPath = 'base/test/spec/fixtures';
    $httpBackend.whenGET('i18n/resources-locale_en-US.js').respond({});
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
      expect(NotificationFactory).toBeDefined();
    });
    it('should have dependencies', function () {
      expect(NotificationEntity).toBeDefined();
      expect($http).toBeDefined();
      expect($q).toBeDefined();
      expect(UrlService).toBeDefined();
      expect(alertService).toBeDefined();
      expect(LanguageService).toBeDefined();
    });
  it('should have objects', function () {
    expect(NotificationFactoryData).toBeDefined();
    expect(NotificationFactoryData.selectedFilters).toBeDefined();
  });
  it('should have these functions', function () {
    expect(NotificationFactory.filterList).toBeDefined();
    expect(NotificationFactory.notificationList).toBeDefined();
    expect(NotificationFactory.makeNotificationsRead).toBeDefined();
    expect(NotificationFactory.fnGetNotificationMessage).toBeDefined();
    expect(NotificationFactory.getFormattedMessage).toBeDefined();
    expect(NotificationFactory.getFilterConfig).toBeDefined();
  });
  it('filterList() should return promise which executes BACKEND API calls and return successful response objects', function (done) {
    var testCaseUrl = UrlService.getService('GET_NOTIFICATION_FILTER_LIST');
    $httpBackend.whenGET(function (actualUrl) {
      return actualUrl.indexOf(testCaseUrl) > -1;
    }).respond(getJSONFixture('notification-factory.get-filter-list-data.test.json'));
    var promiseObject = NotificationFactory.filterList(testCaseUrl).then(function (result) {
      expect(result.data).toBeDefined();
      expect(result.message).toBeDefined();
      done();
    });
    $httpBackend.flush();
    expect(promiseObject).toBeDefined();
    expect(isAngularPromise(promiseObject)).toBeTruthy();
  });
  it('getFilterConfig() should return promise which executes BACKEND API calls and return successful response objects', function (done) {
    var testCaseUrl = UrlService.getService('GET_NOTIFICATIONS_FILTER_LIST')+ '?$select=EVENT_NOTIFICATION_GROUP_NAME';
    $httpBackend.whenGET(function (actualUrl) {
      return actualUrl.indexOf(testCaseUrl) > -1;
    }).respond(getJSONFixture('notification-factory.get-filter-config-data.test.json'));
    var promiseObject = NotificationFactory.getFilterConfig(testCaseUrl).then(function (result) {
      expect(result.data).toBeDefined();
      expect(result.message).toBeDefined();
      done();
    });
    $httpBackend.flush();
    expect(promiseObject).toBeDefined();
    expect(isAngularPromise(promiseObject)).toBeTruthy();
  });
});
