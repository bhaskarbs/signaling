'use strict';
describe('QueryFactory Service', function () {
  var UserService, QueryFactoryData, QueryFactory, QueryOperatorEntity, QueryDimensionEntity, CaseListFactory, PreferencesFactory, $httpBackend, $http, $q, UrlService, alertService, LanguageService, QueryEntity, CaseListEntity, ConstantService;
  beforeEach(function () {
    module('saint-config');
    module('saintApp', ['UrlServiceProvider', 'Environment', function (UrlServiceProvider, Environment) {
      UrlServiceProvider.setOptions({'useFixture': false, 'Environment': Environment});
    }]);
    inject(function ($injector) {
      UserService = $injector.get('UserService');
      QueryFactory = $injector.get('QueryFactory');
      QueryFactoryData = QueryFactory.data;
      QueryOperatorEntity = $injector.get('QueryOperatorEntity');
      QueryDimensionEntity = $injector.get('QueryDimensionEntity');
      CaseListFactory = $injector.get('CaseListFactory');
      PreferencesFactory = $injector.get('PreferencesFactory');
      $httpBackend = $injector.get('$httpBackend');
      $http = $injector.get('$http');
      $q = $injector.get('$q');
      UrlService = $injector.get('UrlService');
      alertService = $injector.get('alertService');
      LanguageService = $injector.get('LanguageService');
      ConstantService = $injector.get('ConstantService');
      CaseListEntity = $injector.get('CaseListEntity');
      QueryEntity = $injector.get('QueryEntity');

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
    expect(QueryFactory).toBeDefined();
  });
  it('should have dependencies', function () {
    expect(QueryOperatorEntity).toBeDefined();
    expect(QueryDimensionEntity).toBeDefined();
    expect(CaseListFactory).toBeDefined();
    expect(PreferencesFactory).toBeDefined();
    expect($httpBackend).toBeDefined();
    expect($http).toBeDefined();
    expect($q).toBeDefined();
    expect(UrlService).toBeDefined();
    expect(alertService).toBeDefined();
    expect(LanguageService).toBeDefined();
    expect(ConstantService).toBeDefined();
    expect(CaseListEntity).toBeDefined();
    expect(QueryEntity).toBeDefined();
  });
  it('should have objects', function () {
    expect(QueryFactory.screenName).toBeDefined();
    expect(QueryFactoryData).toBeDefined();
    expect(QueryFactoryData.filterCategoryData).toBeDefined();
    expect(QueryFactoryData.sortCategoryData).toBeDefined();
    expect(QueryFactoryData.queryLib).toBeDefined();
    expect(QueryFactoryData.selectedFilters).toBeDefined();
    expect(QueryFactoryData.persistedData).toBeDefined();
    expect(QueryFactoryData.pageMode).toBeDefined();
    expect(QueryFactoryData.querySort.sortedBy).toBeDefined();
    expect(QueryFactoryData.querySort.sortedByName).toBeDefined();
    expect(QueryFactoryData.querySort.sortOrder).toBeDefined();
    expect(QueryFactoryData.querySort.secondarySort).toBeDefined();
    expect(QueryFactoryData.queryContext.key).toBeDefined();
    expect(QueryFactoryData.queryContext.name).toBeDefined();
    expect(QueryFactoryData.queryContext.description).toBeDefined();
    expect(QueryFactoryData.queryContext.setQueries).toBeDefined();
    expect(QueryFactoryData.caseListObject).toBeDefined();
    expect(QueryFactoryData.updateQueryString).toBeDefined();
    expect(QueryFactoryData.updateQuerySet).toBeDefined();
    expect(QueryFactoryData.dimensionsList).toBeDefined();
    expect(QueryFactoryData.operatorsList).toBeDefined();
    expect(QueryFactoryData.userGroupInfo).toBeDefined();
    expect(QueryFactoryData.selectedUserGroupInfo).toBeDefined();
    expect(Object.keys(QueryFactoryData).length).toEqual(15);
  });
  it('should have these functions', function () {
    expect(QueryFactory.computeQuerySavePayload).toBeDefined();
    expect(QueryFactory.syncSharedObjectWithPersistedData).toBeDefined();
    expect(QueryFactory.persistPreference).toBeDefined();
    expect(QueryFactory.formatTileToEntity).toBeDefined();
    expect(QueryFactory.getQueryData).toBeDefined();
    expect(QueryFactory.callSetQueryMapping).toBeDefined();
    expect(QueryFactory.getQueryDetail).toBeDefined();
    expect(QueryFactory.getConfig).toBeDefined();
    expect(QueryFactory.generateOdataQueryParameters).toBeDefined();
    expect(QueryFactory.getFilterContent).toBeDefined();
    expect(QueryFactory.fnUpdateCaseList).toBeDefined();
    expect(QueryFactory.saveQueryToLibrary).toBeDefined();
    expect(QueryFactory.getOperatorDimensionInfo).toBeDefined();
    expect(QueryFactory.getOperatorInfo).toBeDefined();
    expect(QueryFactory.getDimensionInfo).toBeDefined();
    expect(QueryFactory.fnDeleteQueryService).toBeDefined();
    expect(QueryFactory.saveShareQuery).toBeDefined();
    expect(QueryFactory.getSelectedUser).toBeDefined();
    expect(QueryFactory.computeShareQueryPayload).toBeDefined();
    expect(Object.keys(QueryFactory).length).toEqual(21);
  });

  it('getQueryData() should return promise which executes BACKEND API calls and return successful response objects', function (done) {
    var testCaseUrl = UrlService.getService('GET_QUERY_LIBRARY');
    $httpBackend.whenGET(function (actualUrl) {
      return actualUrl.indexOf(testCaseUrl) > -1;
    }).respond(getJSONFixture('query-factory.get-query-data.test.json'));
    var promiseObject = QueryFactory.getQueryData(testCaseUrl).then(function (result) {
      expect(result.data).toBeDefined();
      expect(result.message).toBeDefined();
      done();
    });
    $httpBackend.flush();
    expect(promiseObject).toBeDefined();
    expect(isAngularPromise(promiseObject)).toBeTruthy();
  });
});
