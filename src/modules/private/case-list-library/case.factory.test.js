'use strict';
describe('CaseFactory Service', function () {
  var CaseFactory, CaseEntity, $http, $q, UrlService, alertService, LanguageService, DateService, caseListTableData, $httpBackend;
  beforeEach(function () {
    module('saint-config');
    module('saintApp', ['UrlServiceProvider', 'Environment', function (UrlServiceProvider, Environment) {
      UrlServiceProvider.setOptions({'useFixture': false, 'Environment': Environment});
    }]);
    inject(function ($injector) {
      CaseFactory = $injector.get('CaseFactory');
      caseListTableData = CaseFactory.data;
      CaseEntity = $injector.get('CaseEntity');
      $http = $injector.get('$http');
      $httpBackend = $injector.get('$httpBackend');
      $q = $injector.get('$q');
      UrlService = $injector.get('UrlService');
      alertService = $injector.get('alertService');
      LanguageService = $injector.get('LanguageService');
      DateService = $injector.get('DateService');
    });
    jasmine.getJSONFixtures().fixturesPath = 'base/test/spec/fixtures';
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
    expect(CaseFactory).toBeDefined();
  });
  it('should have dependencies', function () {
    expect(CaseEntity).toBeDefined();
    expect($http).toBeDefined();
    expect($q).toBeDefined();
    expect(UrlService).toBeDefined();
    expect(alertService).toBeDefined();
    expect(LanguageService).toBeDefined();
    expect(DateService).toBeDefined();
  });
  it('should have objects', function () {
    expect(caseListTableData).toBeDefined();
    expect(caseListTableData.selectedCaseList).toBeDefined();
    expect(caseListTableData.cases).toBeDefined();
    expect(caseListTableData.casesOperationType).toBeDefined();
    expect(Object.keys(caseListTableData).length).toEqual(4);
  });
  it('should have these functions', function () {
    expect(CaseFactory.buildUrl).toBeDefined();
    expect(CaseFactory.getDistinctCases).toBeDefined();
    expect(CaseFactory.getCaseEvents).toBeDefined();
    expect(CaseFactory.getCaseSuspectProducts).toBeDefined();
    expect(CaseFactory.getCaseSubmissionHistoryPeriodic).toBeDefined();
    expect(CaseFactory.getSelectedCaseDetails).toBeDefined();
    expect(CaseFactory.getCaseListDatesCheck).toBeDefined();
    expect(CaseFactory.uploadCases).toBeDefined();
    expect(CaseFactory.getCaseIds).toBeDefined();
    expect(CaseFactory.getTopCaseIds).toBeDefined();
    expect(CaseFactory.fnAnnotationSave).toBeDefined();
    expect(CaseFactory.includeExcludeCases).toBeDefined();
    expect(CaseFactory.formatTrackCaseToEntity).toBeDefined();
    expect(CaseFactory.getTrackingCaseList).toBeDefined();
    expect(CaseFactory.getGenerateOdataQueryParameters).toBeDefined();
    expect(CaseFactory.getCaseAnnotationDetails).toBeDefined();
    expect(CaseFactory.fnAnnotationSave).toBeDefined();
    expect(Object.keys(CaseFactory).length).toEqual(21);
  });

  it('getDistinctCases() should return promise which executes BACKEND API calls and return successful response objects', function (done) {
    var testCaseUrl = UrlService.getService('CASE_LIST_TABLE_VIEW');
    $httpBackend.whenGET(function (actualUrl) {
      return actualUrl.indexOf(testCaseUrl) > -1;
    }).respond(getJSONFixture('case-factory.get-distinct-cases.test.json'));
    var promiseObject = CaseFactory.getDistinctCases(testCaseUrl).then(function (result) {
      expect(result.data).toBeDefined();
      expect(result.message).toBeDefined();
      done();
    });
    $httpBackend.flush();
    expect(promiseObject).toBeDefined();
    expect(isAngularPromise(promiseObject)).toBeTruthy();
  });

  it('getDistinctCases() should return promise which executes BACKEND API calls and return failed response objects', function (done) {
    var testCaseUrl = UrlService.getService('CASE_LIST_TABLE_VIEW');
    $httpBackend.whenGET(function (actualUrl) {
      return actualUrl.indexOf(testCaseUrl) > -1;
    }).respond(null);
    var promiseObject = CaseFactory.getDistinctCases(testCaseUrl).then(function (result) {
      expect(result.error).toBeDefined();
      expect(result.message).toBeDefined();
      done();
    });
    $httpBackend.flush();
    expect(promiseObject).toBeDefined();
    expect(isAngularPromise(promiseObject)).toBeTruthy();
  });

  it('getDistinctCases() should return promise which executes BACKEND API calls and return failed response objects', function (done) {
    var testCaseUrl = UrlService.getService('CASE_LIST_TABLE_VIEW');
    $httpBackend.whenGET(function (actualUrl) {
      return actualUrl.indexOf(testCaseUrl) > -1;
    }).respond(500,'');
    var promiseObject = CaseFactory.getDistinctCases(testCaseUrl).then(function (result) {
      expect(result.error).toBeDefined();
      expect(result.message).toBeDefined();
      done();
    });
    $httpBackend.flush();
    expect(promiseObject).toBeDefined();
    expect(isAngularPromise(promiseObject)).toBeTruthy();
  });

  it('getCaseEvents() should return promise which executes BACKEND API calls and return successful response objects', function (done) {
    var testCaseUrl = UrlService.getService('GET_ALL_CASES_LIST');
    $httpBackend.whenGET(function (actualUrl) {
      return actualUrl.indexOf(testCaseUrl) > -1;
    }).respond(getJSONFixture('case-factory.get-case-events.test.json'));
    var promiseObject = CaseFactory.getCaseEvents(testCaseUrl).then(function (result) {
      expect(result.data).toBeDefined();
      expect(result.message).toBeDefined();
      done();
    });
    $httpBackend.flush();
    expect(promiseObject).toBeDefined();
    expect(isAngularPromise(promiseObject)).toBeTruthy();
  });

  it('getCaseEvents() should return promise which executes BACKEND API calls and return failed response objects', function (done) {
    var testCaseUrl = UrlService.getService('GET_ALL_CASES_LIST');
    $httpBackend.whenGET(function (actualUrl) {
      return actualUrl.indexOf(testCaseUrl) > -1;
    }).respond(null);
    var promiseObject = CaseFactory.getCaseEvents(testCaseUrl).then(function (result) {
      expect(result.error).toBeDefined();
      expect(result.message).toBeDefined();
      done();
    });
    $httpBackend.flush();
    expect(promiseObject).toBeDefined();
    expect(isAngularPromise(promiseObject)).toBeTruthy();
  });

  it('getCaseEvents() should return promise which executes BACKEND API calls and return failed response objects', function (done) {
    var testCaseUrl = UrlService.getService('GET_ALL_CASES_LIST');
    $httpBackend.whenGET(function (actualUrl) {
      return actualUrl.indexOf(testCaseUrl) > -1;
    }).respond(500,'');
    var promiseObject = CaseFactory.getCaseEvents(testCaseUrl).then(function (result) {
      expect(result.error).toBeDefined();
      expect(result.message).toBeDefined();
      done();
    });
    $httpBackend.flush();
    expect(promiseObject).toBeDefined();
    expect(isAngularPromise(promiseObject)).toBeTruthy();
  });

  it('getCaseSuspectProducts() should return promise which executes BACKEND API calls and return successful response objects', function (done) {
    var testCaseUrl = UrlService.getService('GET_ALL_CASES_LIST');
    $httpBackend.whenGET(function (actualUrl) {
      return actualUrl.indexOf(testCaseUrl) > -1;
    }).respond(getJSONFixture('case-factory.get-case-suspect-products.test.json'));
    var promiseObject = CaseFactory.getCaseSuspectProducts(testCaseUrl).then(function (result) {
      expect(result.data).toBeDefined();
      expect(result.message).toBeDefined();
      done();
    });
    $httpBackend.flush();
    expect(promiseObject).toBeDefined();
    expect(isAngularPromise(promiseObject)).toBeTruthy();
  });

  it('getCaseSuspectProducts() should return promise which executes BACKEND API calls and return failed response objects', function (done) {
    var testCaseUrl = UrlService.getService('GET_ALL_CASES_LIST');
    $httpBackend.whenGET(function (actualUrl) {
      return actualUrl.indexOf(testCaseUrl) > -1;
    }).respond(null);
    var promiseObject = CaseFactory.getCaseSuspectProducts(testCaseUrl).then(function (result) {
      expect(result.error).toBeDefined();
      expect(result.message).toBeDefined();
      done();
    });
    $httpBackend.flush();
    expect(promiseObject).toBeDefined();
    expect(isAngularPromise(promiseObject)).toBeTruthy();
  });

  it('getCaseSuspectProducts() should return promise which executes BACKEND API calls and return failed response objects', function (done) {
    var testCaseUrl = UrlService.getService('GET_ALL_CASES_LIST');
    $httpBackend.whenGET(function (actualUrl) {
      return actualUrl.indexOf(testCaseUrl) > -1;
    }).respond(500,'');
    var promiseObject = CaseFactory.getCaseSuspectProducts(testCaseUrl).then(function (result) {
      expect(result.error).toBeDefined();
      expect(result.message).toBeDefined();
      done();
    });
    $httpBackend.flush();
    expect(promiseObject).toBeDefined();
    expect(isAngularPromise(promiseObject)).toBeTruthy();
  });

  it('getCaseSubmissionHistoryPeriodic() should return promise which executes BACKEND API calls and return successful response objects', function (done) {
    var testCaseUrl = UrlService.getService('GET_ALL_CASES_LIST');
    $httpBackend.whenGET(function (actualUrl) {
      return actualUrl.indexOf(testCaseUrl) > -1;
    }).respond(getJSONFixture('case-factory.get-case-submission-history-periodic.test.json'));
    var promiseObject = CaseFactory.getCaseSubmissionHistoryPeriodic(testCaseUrl).then(function (result) {
      expect(result.data).toBeDefined();
      expect(result.message).toBeDefined();
      done();
    });
    $httpBackend.flush();
    expect(promiseObject).toBeDefined();
    expect(isAngularPromise(promiseObject)).toBeTruthy();
  });

  it('getCaseSubmissionHistoryPeriodic() should return promise which executes BACKEND API calls and return failed response objects', function (done) {
    var testCaseUrl = UrlService.getService('GET_ALL_CASES_LIST');
    $httpBackend.whenGET(function (actualUrl) {
      return actualUrl.indexOf(testCaseUrl) > -1;
    }).respond(null);
    var promiseObject = CaseFactory.getCaseSubmissionHistoryPeriodic(testCaseUrl).then(function (result) {
      expect(result.error).toBeDefined();
      expect(result.message).toBeDefined();
      done();
    });
    $httpBackend.flush();
    expect(promiseObject).toBeDefined();
    expect(isAngularPromise(promiseObject)).toBeTruthy();
  });

  it('getCaseSubmissionHistoryPeriodic() should return promise which executes BACKEND API calls and return failed response objects', function (done) {
    var testCaseUrl = UrlService.getService('GET_ALL_CASES_LIST');
    $httpBackend.whenGET(function (actualUrl) {
      return actualUrl.indexOf(testCaseUrl) > -1;
    }).respond(500,'');
    var promiseObject = CaseFactory.getCaseSubmissionHistoryPeriodic(testCaseUrl).then(function (result) {
      expect(result.error).toBeDefined();
      expect(result.message).toBeDefined();
      done();
    });
    $httpBackend.flush();
    expect(promiseObject).toBeDefined();
    expect(isAngularPromise(promiseObject)).toBeTruthy();
  });

  it('getSelectedCaseDetails() should return promise which executes BACKEND API calls and return successful response objects', function (done) {
    var testCaseUrl = UrlService.getService('GET_ALL_CASES_LIST');
    $httpBackend.whenGET(function (actualUrl) {
      return actualUrl.indexOf(testCaseUrl) > -1;
    }).respond(getJSONFixture('case-factory.get-selected-case-details.test.json'));
    var promiseObject = CaseFactory.getSelectedCaseDetails(testCaseUrl).then(function (result) {
      expect(result.data).toBeDefined();
      expect(result.message).toBeDefined();
      done();
    });
    $httpBackend.flush();
    expect(promiseObject).toBeDefined();
    expect(isAngularPromise(promiseObject)).toBeTruthy();
  });

  it('getSelectedCaseDetails() should return promise which executes BACKEND API calls and return failed response objects', function (done) {
    var testCaseUrl = UrlService.getService('GET_ALL_CASES_LIST');
    $httpBackend.whenGET(function (actualUrl) {
      return actualUrl.indexOf(testCaseUrl) > -1;
    }).respond(null);
    var promiseObject = CaseFactory.getSelectedCaseDetails(testCaseUrl).then(function (result) {
      expect(result.error).toBeDefined();
      expect(result.message).toBeDefined();
      done();
    });
    $httpBackend.flush();
    expect(promiseObject).toBeDefined();
    expect(isAngularPromise(promiseObject)).toBeTruthy();
  });

  it('getSelectedCaseDetails() should return promise which executes BACKEND API calls and return failed response objects', function (done) {
    var testCaseUrl = UrlService.getService('GET_ALL_CASES_LIST');
    $httpBackend.whenGET(function (actualUrl) {
      return actualUrl.indexOf(testCaseUrl) > -1;
    }).respond(500,'');
    var promiseObject = CaseFactory.getSelectedCaseDetails(testCaseUrl).then(function (result) {
      expect(result.error).toBeDefined();
      expect(result.message).toBeDefined();
      done();
    });
    $httpBackend.flush();
    expect(promiseObject).toBeDefined();
    expect(isAngularPromise(promiseObject)).toBeTruthy();
  });

  it('getCaseListDatesCheck() should return promise which executes BACKEND API calls and return successful response objects', function (done) {
    var testCaseUrl = UrlService.getService('DATE_FLAG_PARAMS');
    $httpBackend.whenGET(function (actualUrl) {
      return actualUrl.indexOf(testCaseUrl) > -1;
    }).respond(getJSONFixture('case-factory.get-case-list-dates-check.test.json'));
    var promiseObject = CaseFactory.getCaseListDatesCheck(testCaseUrl).then(function (result) {
      expect(result.data).toBeDefined();
      expect(result.message).toBeDefined();
      done();
    });
    $httpBackend.flush();
    expect(promiseObject).toBeDefined();
    expect(isAngularPromise(promiseObject)).toBeTruthy();
  });

  it('getCaseListDatesCheck() should return promise which executes BACKEND API calls and return failed response objects', function (done) {
    var testCaseUrl = UrlService.getService('DATE_FLAG_PARAMS');
    $httpBackend.whenGET(function (actualUrl) {
      return actualUrl.indexOf(testCaseUrl) > -1;
    }).respond(null);
    var promiseObject = CaseFactory.getCaseListDatesCheck(testCaseUrl).then(function (result) {
      expect(result.error).toBeDefined();
      expect(result.message).toBeDefined();
      done();
    });
    $httpBackend.flush();
    expect(promiseObject).toBeDefined();
    expect(isAngularPromise(promiseObject)).toBeTruthy();
  });

  it('getCaseListDatesCheck() should return promise which executes BACKEND API calls and return failed response objects', function (done) {
    var testCaseUrl = UrlService.getService('DATE_FLAG_PARAMS');
    $httpBackend.whenGET(function (actualUrl) {
      return actualUrl.indexOf(testCaseUrl) > -1;
    }).respond(500,'');
    var promiseObject = CaseFactory.getCaseListDatesCheck(testCaseUrl).then(function (result) {
      expect(result.error).toBeDefined();
      expect(result.message).toBeDefined();
      done();
    });
    $httpBackend.flush();
    expect(promiseObject).toBeDefined();
    expect(isAngularPromise(promiseObject)).toBeTruthy();
  });

  it('uploadCases() should return promise which executes BACKEND API calls and return successful response objects', function (done) {
    var testCaseUrl = UrlService.getService('CASES_UPLOAD');
    $httpBackend.whenPOST(function (actualUrl) {
      return actualUrl.indexOf(testCaseUrl) > -1;
    }).respond(getJSONFixture('case-factory.upload-cases.test.json'));
    var promiseObject = CaseFactory.uploadCases(testCaseUrl).then(function (result) {
      expect(result).toBeDefined();
      expect(result.message).toBeDefined();
      done();
    });
    $httpBackend.flush();
    expect(promiseObject).toBeDefined();
    expect(isAngularPromise(promiseObject)).toBeTruthy();
  });

  it('uploadCases() should return promise which executes BACKEND API calls and return failed response objects', function (done) {
    var testCaseUrl = UrlService.getService('CASES_UPLOAD');
    $httpBackend.whenPOST(function (actualUrl) {
      return actualUrl.indexOf(testCaseUrl) > -1;
    }).respond(null);
    var promiseObject = CaseFactory.uploadCases(testCaseUrl).then(function (result) {
      expect(result.error).toBeDefined();
      expect(result.message).toBeDefined();
      done();
    });
    $httpBackend.flush();
    expect(promiseObject).toBeDefined();
    expect(isAngularPromise(promiseObject)).toBeTruthy();
  });

  it('uploadCases() should return promise which executes BACKEND API calls and return failed response objects', function (done) {
    var testCaseUrl = UrlService.getService('CASES_UPLOAD');
    $httpBackend.whenPOST(function (actualUrl) {
      return actualUrl.indexOf(testCaseUrl) > -1;
    }).respond(500,'');
    var promiseObject = CaseFactory.uploadCases(testCaseUrl).then(function (result) {
      expect(result.error).toBeDefined();
      expect(result.message).toBeDefined();
      done();
    });
    $httpBackend.flush();
    expect(promiseObject).toBeDefined();
    expect(isAngularPromise(promiseObject)).toBeTruthy();
  });

  it('getCaseIds() should return promise which executes BACKEND API calls and return successful response objects', function (done) {
    var testCaseUrl = UrlService.getService('INCLUDE_SELECT_CASE');
    $httpBackend.whenGET(function (actualUrl) {
      return actualUrl.indexOf(testCaseUrl) > -1;
    }).respond(getJSONFixture('case-factory.get-case-ids.test.json'));
    var promiseObject = CaseFactory.getCaseIds(testCaseUrl).then(function (result) {
      expect(result.data).toBeDefined();
      expect(result.message).toBeDefined();
      done();
    });
    $httpBackend.flush();
    expect(promiseObject).toBeDefined();
    expect(isAngularPromise(promiseObject)).toBeTruthy();
  });

  it('getCaseIds() should return promise which executes BACKEND API calls and return failed response objects', function (done) {
    var testCaseUrl = UrlService.getService('INCLUDE_SELECT_CASE');
    $httpBackend.whenGET(function (actualUrl) {
      return actualUrl.indexOf(testCaseUrl) > -1;
    }).respond(null);
    var promiseObject = CaseFactory.getCaseIds(testCaseUrl).then(function (result) {
      expect(result.error).toBeDefined();
      expect(result.message).toBeDefined();
      done();
    });
    $httpBackend.flush();
    expect(promiseObject).toBeDefined();
    expect(isAngularPromise(promiseObject)).toBeTruthy();
  });

  it('getCaseIds() should return promise which executes BACKEND API calls and return failed response objects', function (done) {
    var testCaseUrl = UrlService.getService('INCLUDE_SELECT_CASE');
    $httpBackend.whenGET(function (actualUrl) {
      return actualUrl.indexOf(testCaseUrl) > -1;
    }).respond(500,'');
    var promiseObject = CaseFactory.getCaseIds(testCaseUrl).then(function (result) {
      expect(result.error).toBeDefined();
      expect(result.message).toBeDefined();
      done();
    });
    $httpBackend.flush();
    expect(promiseObject).toBeDefined();
    expect(isAngularPromise(promiseObject)).toBeTruthy();
  });

  it('getTopCaseIds() should return promise which executes BACKEND API calls and return successful response objects', function (done) {
    var testCaseUrl = UrlService.getService('INCLUDE_SELECT_CASE');
    $httpBackend.whenGET(function (actualUrl) {
      return actualUrl.indexOf(testCaseUrl) > -1;
    }).respond(getJSONFixture('case-factory.get-top-case-ids.test.json'));
    var promiseObject = CaseFactory.getTopCaseIds(testCaseUrl).then(function (result) {
      expect(result.data).toBeDefined();
      expect(result.message).toBeDefined();
      done();
    });
    $httpBackend.flush();
    expect(promiseObject).toBeDefined();
    expect(isAngularPromise(promiseObject)).toBeTruthy();
  });

  it('getTopCaseIds() should return promise which executes BACKEND API calls and return failed response objects', function (done) {
    var testCaseUrl = UrlService.getService('INCLUDE_SELECT_CASE');
    $httpBackend.whenGET(function (actualUrl) {
      return actualUrl.indexOf(testCaseUrl) > -1;
    }).respond(null);
    var promiseObject = CaseFactory.getTopCaseIds(testCaseUrl).then(function (result) {
      expect(result.error).toBeDefined();
      expect(result.message).toBeDefined();
      done();
    });
    $httpBackend.flush();
    expect(promiseObject).toBeDefined();
    expect(isAngularPromise(promiseObject)).toBeTruthy();
  });

  it('getTopCaseIds() should return promise which executes BACKEND API calls and return failed response objects', function (done) {
    var testCaseUrl = UrlService.getService('INCLUDE_SELECT_CASE');
    $httpBackend.whenGET(function (actualUrl) {
      return actualUrl.indexOf(testCaseUrl) > -1;
    }).respond(500,'');
    var promiseObject = CaseFactory.getTopCaseIds(testCaseUrl).then(function (result) {
      expect(result.error).toBeDefined();
      expect(result.message).toBeDefined();
      done();
    });
    $httpBackend.flush();
    expect(promiseObject).toBeDefined();
    expect(isAngularPromise(promiseObject)).toBeTruthy();
  });

  it('includeExcludeCases() should return promise which executes BACKEND API calls and return successful response objects', function (done) {
    var testCaseUrl = UrlService.getService('INCLUDE_EXCLUDE_CASES');
    $httpBackend.whenPOST(function (actualUrl) {
      return actualUrl.indexOf(testCaseUrl) > -1;
    }).respond(getJSONFixture('case-factory.include-exclude-cases.test.json'));
    var promiseObject = CaseFactory.includeExcludeCases(testCaseUrl).then(function (result) {
      expect(result).toBeDefined();
      expect(result.message).toBeDefined();
      done();
    });
    $httpBackend.flush();
    expect(promiseObject).toBeDefined();
    expect(isAngularPromise(promiseObject)).toBeTruthy();
  });

  it('includeExcludeCases() should return promise which executes BACKEND API calls and return failed response objects', function (done) {
    var testCaseUrl = UrlService.getService('INCLUDE_EXCLUDE_CASES');
    $httpBackend.whenPOST(function (actualUrl) {
      return actualUrl.indexOf(testCaseUrl) > -1;
    }).respond(500,'');
    var promiseObject = CaseFactory.includeExcludeCases(testCaseUrl).then(function (result) {
      expect(result.error).toBeDefined();
      expect(result.message).toBeDefined();
      done();
    });
    $httpBackend.flush();
    expect(promiseObject).toBeDefined();
    expect(isAngularPromise(promiseObject)).toBeTruthy();
  });

  it('getCaseAnnotationDetails() should return promise which executes BACKEND API calls and return successful response objects', function (done) {
    var testCaseUrl = UrlService.getService('GET_CASE_ANNOTATION');
    $httpBackend.whenGET(function (actualUrl) {
      return actualUrl.indexOf(testCaseUrl) > -1;
    }).respond(getJSONFixture('case-factory.get-case-annotation-details.test.json'));
    var promiseObject = CaseFactory.getCaseAnnotationDetails(testCaseUrl).then(function (result) {
      expect(result).toBeDefined();
      expect(result.message).toBeDefined();
      done();
    });
    $httpBackend.flush();
    expect(promiseObject).toBeDefined();
    expect(isAngularPromise(promiseObject)).toBeTruthy();
  });

  it('getCaseAnnotationDetails() should return promise which executes BACKEND API calls and return failed response objects', function (done) {
    var testCaseUrl = UrlService.getService('GET_CASE_ANNOTATION');
    $httpBackend.whenGET(function (actualUrl) {
      return actualUrl.indexOf(testCaseUrl) > -1;
    }).respond(500,'');
    var promiseObject = CaseFactory.getCaseAnnotationDetails(testCaseUrl).then(function (result) {
      expect(result.error).toBeDefined();
      expect(result.message).toBeDefined();
      done();
    });
    $httpBackend.flush();
    expect(promiseObject).toBeDefined();
    expect(isAngularPromise(promiseObject)).toBeTruthy();
  });

   it('fnAnnotationSave() should return promise which executes BACKEND API calls and return successful response objects', function (done) {
     var testCaseUrl = UrlService.getService('SAVE_ANNOTATIONS');
     $httpBackend.whenPOST(function (actualUrl) {
       return actualUrl.indexOf(testCaseUrl) > -1;
     }).respond(getJSONFixture('case-factory.fn-annotation-save.test.json'));
     var promiseObject = CaseFactory.fnAnnotationSave(testCaseUrl).then(function (result) {
       expect(result).toBeDefined();
       expect(result.message).toBeDefined();
       done();
     });
     $httpBackend.flush();
     expect(promiseObject).toBeDefined();
     expect(isAngularPromise(promiseObject)).toBeTruthy();
   });

   it('fnAnnotationSave() should return promise which executes BACKEND API calls and return failed response objects', function (done) {
     var testCaseUrl = UrlService.getService('SAVE_ANNOTATIONS');
     $httpBackend.whenPOST(function (actualUrl) {
       return actualUrl.indexOf(testCaseUrl) > -1;
     }).respond(500,'');
     var promiseObject = CaseFactory.fnAnnotationSave(testCaseUrl).then(function (result) {
       expect(result.error).toBeDefined();
       expect(result.message).toBeDefined();
       done();
     });
     $httpBackend.flush();
     expect(promiseObject).toBeDefined();
     expect(isAngularPromise(promiseObject)).toBeTruthy();
   });
});
