'use strict';
describe('PersistenceFactory Service', function () {
  var ReportFactory, Timeout, PersistenceEntity, PersistenceFactory, UserService, userServiceData, $httpBackend, $http, $q, UrlService, alertService, LanguageService, groups, ConstantService;

  beforeEach(function () {
    module('saint-config');
    module('saintApp', ['UrlServiceProvider', 'Environment', function (UrlServiceProvider, Environment) {
      UrlServiceProvider.setOptions({'useFixture': false, 'Environment': Environment});
    }]);
    inject(function ($injector) {
      Timeout = $injector.get('$timeout');
      UserService = $injector.get('UserService');
      PersistenceFactory = $injector.get('PreferencesFactory');
      ReportFactory = $injector.get('ReportFactory');
      userServiceData = UserService.data;
      $http = $injector.get('$http');
      $httpBackend = $injector.get('$httpBackend');
      $q = $injector.get('$q');
      UrlService = $injector.get('UrlService');
      alertService = $injector.get('alertService');
      LanguageService = $injector.get('LanguageService');
      ConstantService = $injector.get('ConstantService');
      PersistenceEntity = $injector.get('PreferencesEntity');
    });

    groups = [{
      'actualRoleName': 'Deloitte.Innovation.saint.Admin::SafetyReportingAdministrator',
      'roleId': '193600',
      'roleName': 'SafetyReportingAdministrator'
    }];
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
    expect(UserService).toBeDefined();
    expect(PersistenceEntity).toBeDefined();
  });

  it('should have dependencies', function () {
    expect(Timeout).toBeDefined();
    expect($http).toBeDefined();
    expect($q).toBeDefined();
    expect(UrlService).toBeDefined();
    expect(alertService).toBeDefined();
    expect(LanguageService).toBeDefined();
    expect(ConstantService).toBeDefined();
  });

  it('should have these objects', function () {
    expect(PersistenceFactory.timeoutDuration).toBeDefined();
    expect(PersistenceFactory.timeoutPromise).toBeDefined();
    expect(PersistenceFactory.persistencePoolObjectQueue).toBeDefined();
  });

  it('should have these functions', function () {
    expect(PersistenceFactory.stopTimeout).toBeDefined();
    expect(PersistenceFactory.startTimeout).toBeDefined();
    expect(PersistenceFactory.doBackendPersist).toBeDefined();
    expect(PersistenceFactory.pushPersistencePoolObjectQueue).toBeDefined();
    expect(PersistenceFactory.shiftPersistencePoolObjectQueue).toBeDefined();
    expect(PersistenceFactory.persistPreference).toBeDefined();
    expect(PersistenceFactory.dataEntityMapper).toBeDefined();
    expect(PersistenceFactory.saveUserPreferenceData).toBeDefined();
    expect(PersistenceFactory.getUserPreferencedData).toBeDefined();
    expect(Object.keys(PersistenceFactory).length).toEqual(12);
  });

  it('getUserPreferencedData() should return promise which fetches all the user persisted data', function (done) {
    var testCaseUrl = UrlService.getService('PERSISTED_USER_DATA');
    $httpBackend.whenGET(function (actualUrl) {
      return actualUrl.indexOf(testCaseUrl) > -1;
    }).respond(getJSONFixture('preference-factory.get-user-persisted-data.test.json'));
    var promiseObject = PersistenceFactory.getUserPreferencedData(ConstantService.MANAGE_REPORTS_SCREEN, function () {
    }).then(function (result) {
      expect(result.data).toBeDefined();
      expect(result.message).toBeDefined();
      done();
    });
    $httpBackend.flush();
    expect(promiseObject).toBeDefined();
    expect(isAngularPromise(promiseObject)).toBeTruthy();
  });

  it('persistPreference() should add the payload to the pool object in order of POST, PUT and DELETE', function () {
    expect(Object.keys(PersistenceFactory.persistencePoolObjectQueue).length).toEqual(0);

    PersistenceFactory.persistPreference('REPORT_PANEL_STATE', ConstantService.HIDDEN, ConstantService.MANAGE_REPORTS_SCREEN, function (data) {
      if (data) {
        ReportFactory.data.persistedData = data; // DELETE will update this shared data
      }
      return ReportFactory.data.persistedData;
    });
    expect(Object.keys(PersistenceFactory.persistencePoolObjectQueue).length).toEqual(1);

    expect(PersistenceFactory.persistencePoolObjectQueue[0].method).toEqual('POST');
    PersistenceFactory.persistPreference('REPORT_PANEL_STATE', ConstantService.EXPANDED, ConstantService.MANAGE_REPORTS_SCREEN,  function (data) {
      if (data) {
        ReportFactory.data.persistedData = data; // DELETE will update this shared data
      }
      return ReportFactory.data.persistedData;
    });
    expect(Object.keys(PersistenceFactory.persistencePoolObjectQueue).length).toEqual(2);
    expect(PersistenceFactory.persistencePoolObjectQueue[1].method).toEqual('PUT');

    expect(PersistenceFactory.persistencePoolObjectQueue[0].method).toEqual('POST');
    PersistenceFactory.persistPreference('REPORT_PANEL_STATE',null, ConstantService.MANAGE_REPORTS_SCREEN,  function (data) {
      if (data) {
        ReportFactory.data.persistedData = data; // DELETE will update this shared data
      }
      return ReportFactory.data.persistedData;
    });
    expect(Object.keys(PersistenceFactory.persistencePoolObjectQueue).length).toEqual(3);
    expect(PersistenceFactory.persistencePoolObjectQueue[2].method).toEqual('DELETE');
  });

  it('dataEntityMapper() testing the entity object',function(){
    var obj = {'FK_USER_ID_KEY':1,'KEY':'CURR_REPORT_ID','VALUE':22,'SCREEN_NAME':'MANAGE_REPORTS'};
    expect(PersistenceFactory.dataEntityMapper(obj)).toEqual({'userId':1,
        'persistedKey':'CURR_REPORT_ID','persistedValue':22,'userScreenName':'MANAGE_REPORTS', isSessionBased: undefined});
  });

});
