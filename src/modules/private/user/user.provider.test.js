'use strict';
describe('UserService Service', function () {
  var UserService, userServiceData, UserEntity, $httpBackend, $http, $q, UrlService, alertService, LanguageService, groups, ConstantService;

  beforeEach(function () {
    module('saint-config');
    module('saintApp', ['UrlServiceProvider', 'Environment', function (UrlServiceProvider, Environment) {
      UrlServiceProvider.setOptions({ 'useFixture': false, 'Environment': Environment });
    }]);
    inject(function ($injector) {
      UserService = $injector.get('UserService');
      UserEntity = $injector.get('UserEntity');
      userServiceData = UserService.data;
      $http = $injector.get('$http');
      $q = $injector.get('$q');
      $httpBackend = $injector.get('$httpBackend');
      UrlService = $injector.get('UrlService');
      alertService = $injector.get('alertService');
      LanguageService = $injector.get('LanguageService');
      ConstantService = $injector.get('ConstantService');
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
  });

  it('should have dependencies', function () {
    expect(UserEntity).toBeDefined();
    expect($http).toBeDefined();
    expect($q).toBeDefined();
    expect(UrlService).toBeDefined();
    expect(alertService).toBeDefined();
    expect(LanguageService).toBeDefined();
  });

  it('should have objects', function () {
    expect(userServiceData).toBeDefined();
    expect(userServiceData.list).toBeDefined();
    expect(userServiceData.groups).toBeDefined();
    expect(userServiceData.oUser).toBeDefined();
    expect(Object.keys(userServiceData).length).toEqual(3);
  });

  // TODO I will remove it after verifying builds - Sai
  xit('should have these functions', function () {
    expect(UserService.getGroups).toBeDefined();
    expect(UserService.getGroupUsers).toBeDefined();
    expect(UserService.getUserGroups).toBeDefined();
    expect(UserService.getLogoutToken).toBeDefined();
    expect(UserService.doLogout).toBeDefined();
    expect(UserService.doSessionCleanup).toBeDefined();
    expect(UserService.doBOELogoff).toBeDefined();
    expect(UserService.getUserGroupInfo).toBeDefined();
    expect(UserService.normalizeUserGroupInfo).toBeDefined();
    expect(Object.keys(UserService).length).toEqual(11);
  });

  it('getGroups() should return promise which executes BACKEND API calls and return successful response objects', function (done) {
    var testCaseUrl = UrlService.getService('USER_ROLES');
    $httpBackend.whenGET(function (actualUrl) {
      return actualUrl.indexOf(testCaseUrl) > -1;
    }).respond(getJSONFixture('user-service.get-groups.test.json'));
    var promiseObject = UserService.getGroups().then(function (result) {
      expect(result.data).toBeDefined();
      expect(result.message).toBeDefined();
      done();
    });
    $httpBackend.flush();
    expect(promiseObject).toBeDefined();
    expect(isAngularPromise(promiseObject)).toBeTruthy();
  });

  it('getGroups() should return promise which executes BACKEND API calls and return failed response objects', function (done) {
    var testCaseUrl = UrlService.getService('USER_ROLES');
    $httpBackend.whenGET(function (actualUrl) {
      return actualUrl.indexOf(testCaseUrl) > -1;
    }).respond(null);
    var promiseObject = UserService.getGroups().then(function (result) {
      expect(result.error).toBeDefined();
      expect(result.message).toBeDefined();
      done();
    });
    $httpBackend.flush();
    expect(promiseObject).toBeDefined();
    expect(isAngularPromise(promiseObject)).toBeTruthy();
  });
  it('getGroupUsers() should return promise which executes BACKEND API calls and return successful response objects', function (done) {
    var testCaseUrl = UrlService.getService('ASSIGNED_USERS');

    $httpBackend.whenGET(function (actualUrl) {
      return actualUrl.indexOf(testCaseUrl) > -1;
    }).respond(getJSONFixture('user-service.get-group-users.test.json'));
    var promiseObject = UserService.getGroupUsers(groups).then(function (result) {
      expect(result.data).toBeDefined();
      expect(result.message).toBeDefined();
      done();
    });
    $httpBackend.flush();
    expect(promiseObject).toBeDefined();
    expect(isAngularPromise(promiseObject)).toBeTruthy();
  });

  it('getGroupUsers() should return promise which executes BACKEND API calls and return failed response objects', function (done) {
    var testCaseUrl = UrlService.getService('ASSIGNED_USERS');
    $httpBackend.whenGET(function (actualUrl) {
      return actualUrl.indexOf(testCaseUrl) > -1;
    }).respond(null);
    var promiseObject = UserService.getGroupUsers(groups).then(function (result) {
      expect(result.error).toBeDefined();
      expect(result.message).toBeDefined();
      done();
    });
    $httpBackend.flush();
    expect(promiseObject).toBeDefined();
    expect(isAngularPromise(promiseObject)).toBeTruthy();
  });

  it('getLogoutToken() should return promise which executes BACKEND API calls and return successful response objects', function (done) {
    var testCaseUrl = UrlService.getService('LOGOUT_GET_TOKEN');
    $httpBackend.whenGET(function (actualUrl) {
      return actualUrl.indexOf(testCaseUrl) > -1;
    }).respond(getJSONFixture('user-service.get-logout-token.test.json'));
    var promiseObject = UserService.getLogoutToken().then(function (result) {
      expect(result.data).toBeDefined();
      expect(result.message).toBeDefined();
      done();
    });
    $httpBackend.flush();
    expect(promiseObject).toBeDefined();
    expect(isAngularPromise(promiseObject)).toBeTruthy();
  });

  it('getLogoutToken() should return promise which executes BACKEND API calls and return failed response objects', function (done) {
    var testCaseUrl = UrlService.getService('LOGOUT_GET_TOKEN');
    $httpBackend.whenGET(function (actualUrl) {
      return actualUrl.indexOf(testCaseUrl) > -1;
    }).respond(500, null, null);
    var promiseObject = UserService.getLogoutToken().then(function (result) {
      expect(result.error).toBeDefined();
      expect(result.message).toBeDefined();
      done();
    });
    $httpBackend.flush();
    expect(promiseObject).toBeDefined();
    expect(isAngularPromise(promiseObject)).toBeTruthy();
  });
  it('doLogout() should return promise which executes BACKEND API calls and return successful response objects', function (done) {
    var testCaseUrl = UrlService.getService('LOGOUT_APPLICATION');
    $httpBackend.whenPOST(function (actualUrl) {
      return actualUrl.indexOf(testCaseUrl) > -1;
    }).respond(200, {}, { 'x-sap-login-page': ConstantService.X_CSRF_TOKEN_URL });
    var promiseObject = UserService.doLogout('sometoken').then(function (result) {
      expect(result.data).toBeDefined();
      expect(result.message).toBeDefined();
      done();
    });
    $httpBackend.flush();
    expect(promiseObject).toBeDefined();
    expect(isAngularPromise(promiseObject)).toBeTruthy();
  });

  it('doLogout() should return promise which executes BACKEND API calls and return failed response objects', function (done) {
    var testCaseUrl = UrlService.getService('LOGOUT_APPLICATION');
    $httpBackend.whenPOST(function (actualUrl) {
      return actualUrl.indexOf(testCaseUrl) > -1;
    }).respond(null);
    var promiseObject = UserService.doLogout(null).then(function (result) {
      expect(result.error).toBeDefined();
      expect(result.message).toBeDefined();
      done();
    });
    $httpBackend.flush();
    expect(promiseObject).toBeDefined();
    expect(isAngularPromise(promiseObject)).toBeTruthy();
  });
  it('doSessionCleanup() should return promise which executes BACKEND API calls and return successful response objects', function (done) {
    done();
    //TODO need to write the test case - Manu
  });
  it('doSessionCleanup() should return promise which executes BACKEND API calls and return failed response objects', function (done) {
    done();
    //TODO need to write the test case - Manu
  });
  it('doBOELogoff() should return promise which executes BACKEND API calls and return successful response objects', function (done) {
    var testCaseUrl = UrlService.getService('BOE_LOGOFF');
       $httpBackend.whenPOST(function (actualUrl) {
         return actualUrl.indexOf(testCaseUrl) > -1;
       }).respond({'logonToken':ConstantService.X_CSRF_TOKEN_URL});
       var promiseObject = UserService.doBOELogoff('sometoken').then(function (result) {
         expect(result.data).toBeDefined();
         done();
       });
       $httpBackend.flush();
       expect(promiseObject).toBeDefined();
  });
  it('doBOELogoff() should return promise which executes BACKEND API calls and return failed response objects', function (done) {
    var testCaseUrl = UrlService.getService('BOE_LOGOFF');
           $httpBackend.whenPOST(function (actualUrl) {
             return actualUrl.indexOf(testCaseUrl) > -1;
           }).respond(null);
           var promiseObject = UserService.doBOELogoff(null).then(function (result) {
             expect(result.error).toBeDefined();
             expect(result.message).toBeDefined();
             done();
           });
           $httpBackend.flush();
           expect(promiseObject).toBeDefined();
  });
});
