'use strict';
describe('CaseListFactory Service', function () {
  var CaseListFactory, PersistenceFactory, caseListServiceData, $httpBackend, $http, $q, UrlService, alertService, LanguageService, CaseListEntity, ConstantService, QueryOperatorEntity, QueryDimensionEntity, DateService;
  beforeEach(function () {
    module('saint-config');
    module('saintApp', ['UrlServiceProvider', 'Environment', function (UrlServiceProvider, Environment) {
      UrlServiceProvider.setOptions({'useFixture': false, 'Environment': Environment});
    }]);
    inject(function ($injector) {
      CaseListFactory = $injector.get('CaseListFactory');
      PersistenceFactory = $injector.get('PreferencesFactory');
      caseListServiceData = CaseListFactory.data;
      CaseListEntity = $injector.get('CaseListEntity');
      $http = $injector.get('$http');
      $httpBackend = $injector.get('$httpBackend');
      $q = $injector.get('$q');
      UrlService = $injector.get('UrlService');
      alertService = $injector.get('alertService');
      LanguageService = $injector.get('LanguageService');
      ConstantService = $injector.get('ConstantService');
      QueryOperatorEntity = $injector.get('QueryOperatorEntity');
      QueryDimensionEntity = $injector.get('QueryDimensionEntity');
      DateService = $injector.get('DateService');
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
    expect(CaseListFactory).toBeDefined();
  });
  it('should have dependencies', function () {
    expect(CaseListEntity).toBeDefined();
    expect($http).toBeDefined();
    expect($q).toBeDefined();
    expect(UrlService).toBeDefined();
    expect(alertService).toBeDefined();
    expect(LanguageService).toBeDefined();
    expect(ConstantService).toBeDefined();

  });
  it('should have objects', function () {
    expect(caseListServiceData).toBeDefined();
    expect(caseListServiceData.caseListLib).toBeDefined();
    expect(caseListServiceData.selectedFilters).toBeDefined();
    expect(caseListServiceData.persistedData).toBeDefined();
    expect(caseListServiceData.selectedCaseListKey).toBeDefined();
    expect(caseListServiceData.caseListSort).toBeDefined();
    expect(caseListServiceData.caseListSort.sortedBy).toBeDefined();
    expect(caseListServiceData.caseListSort.sortedByName).toBeDefined();
    expect(caseListServiceData.caseListSort.sortOrder).toBeDefined();
    expect(caseListServiceData.countries).toBeDefined();
    expect(caseListServiceData.excludeInclude).toBeDefined();
    expect(caseListServiceData.chartSelected).toBeDefined();
    expect(caseListServiceData.selectedChartsList).toBeDefined();
    expect(caseListServiceData.clickedChart).toBeDefined();
    expect(caseListServiceData.caseListObject).toBeDefined();
    expect(caseListServiceData.updateQuerySet).toBeDefined();
    expect(caseListServiceData.clickedChart).toBeDefined();
    expect(caseListServiceData.dimensionsList).toBeDefined();
    expect(caseListServiceData.operatorsList).toBeDefined();
    expect(caseListServiceData.checkServiceCount).toBeDefined();
    expect(caseListServiceData.enableSave).toBeDefined();
    expect(Object.keys(caseListServiceData).length).toEqual(21);
  });
  it('should have these functions', function () {
    expect(CaseListFactory.syncSharedObjectWithPersistedData).toBeDefined();
    expect(CaseListFactory.persistPreference).toBeDefined();
    expect(CaseListFactory.getCaseListData).toBeDefined();
    expect(CaseListFactory.getConfig).toBeDefined();
    expect(CaseListFactory.getFilterContent).toBeDefined();
    expect(CaseListFactory.getSelectedCaseListDetails).toBeDefined();
    expect(CaseListFactory.callSetQueryMapping).toBeDefined();
    expect(CaseListFactory.mapResponseToCaseListEntity).toBeDefined();
    expect(CaseListFactory.getSelectedCaseListAllDetails).toBeDefined();
    expect(CaseListFactory.getChartDimensions).toBeDefined();
    expect(CaseListFactory.getCountryDetails).toBeDefined();
    expect(CaseListFactory.getVisualChartsDetails).toBeDefined();
    expect(CaseListFactory.getAllCasesCount).toBeDefined();
    expect(CaseListFactory.doCreateCaseList).toBeDefined();
    expect(CaseListFactory.fnUpdateCaseList).toBeDefined();
    expect(CaseListFactory.getOperatorInfo).toBeDefined();
    expect(CaseListFactory.getDimensionInfo).toBeDefined();
    expect(Object.keys(CaseListFactory).length).toEqual(27);
  });

  //FIXME should be aligned to new service, NEXT CHANGE
  xit('getCaseListData() should return promise which executes BACKEND API calls and return successful response objects', function (done) {
    var testCaseUrl = UrlService.getService('CASELIST_FILTER_BY_CATEGORY');
    $httpBackend.whenGET(function (actualUrl) {
      return actualUrl.indexOf(testCaseUrl) > -1;
    }).respond(getJSONFixture('case-list-factory.get-case-list-data.test.json'));
    var promiseObject = CaseListFactory.getCaseListData(testCaseUrl).then(function (result) {
      expect(result.data).toBeDefined();
      expect(result.message).toBeDefined();
      done();
    });
    $httpBackend.flush();
    expect(promiseObject).toBeDefined();
    expect(isAngularPromise(promiseObject)).toBeTruthy();
  });

  xit('getReports() should return promise which executes BACKEND API calls and return failed response objects', function (done) {
    var testCaseUrl = UrlService.getService('CASELIST_FILTER_BY_CATEGORY');
    $httpBackend.whenGET(function (actualUrl) {
      return actualUrl.indexOf(testCaseUrl) > -1;
    }).respond(null);
    var promiseObject = CaseListFactory.getCaseListData(testCaseUrl).then(function (result) {
      expect(result.error).toBeDefined();
      expect(result.message).toBeDefined();
      done();
    });
    $httpBackend.flush();
    expect(promiseObject).toBeDefined();
    expect(isAngularPromise(promiseObject)).toBeTruthy();
  });
});
