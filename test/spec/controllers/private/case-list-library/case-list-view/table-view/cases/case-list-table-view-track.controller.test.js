'use strict';
describe('CaseListTableView Track Controller', function () {
  var trackType, ctrl, scope, state, caseFactory, caselistFactory, saintService, constantService, rootScope, alertService, languageService, loaderService, dataService, urlService, AuthorizeService;
  beforeEach(function () {
    module('saintApp');
    module('saint-authorize');
    inject(function ($injector,$controller, $rootScope) {

      scope = $rootScope.$new();
      state = $injector.get('$state');
      caseFactory = $injector.get('CaseFactory');
      caselistFactory = $injector.get('CaseListFactory');
      saintService = $injector.get('SaintService');
      constantService = $injector.get('ConstantService');
      rootScope = $rootScope;
      alertService = $injector.get('alertService');
      languageService = $injector.get('LanguageService');
      loaderService = $injector.get('loaderService');
      dataService = $injector.get('DateService');
      urlService = $injector.get('UrlService');
      AuthorizeService = $injector.get('AuthorizeService');
      trackType=[ constantService.CASE_LIST_ADDED,
                      constantService.CASE_LIST_REMOVED,
                      constantService.CASE_LIST_ANNOTATED
                    ];
      ctrl = $controller('TrackCasesController', {
        $scope: scope,
        $state: state,
        CaseFactory: caseFactory,
        CaseListFactory: caselistFactory,
        SaintService: saintService,
        ConstantService: constantService,
        $rootScope: rootScope,
        alertService: alertService,
        LanguageService: languageService,
        loaderService: loaderService,
        DateService: dataService,
        UrlService: urlService,
        AuthorizeService: AuthorizeService
      });
    });
  });

  it('should exists', function () {
    expect(ctrl).toBeDefined();
  });
  it('Should have configs defined in it', function() {
    expect(scope.caseData).toBeDefined();
    expect(scope.columnMetadata).toBeDefined();
    expect(scope.caseListPerPage).toBeDefined();
    expect(scope.totalCaseList).toBeDefined();
    expect(scope.caseListData).toBeDefined();
    expect(scope.trackType).toBeDefined();
    expect(scope.startIndex).toBeDefined();
    expect(scope.endIndex).toBeDefined();
    expect(scope.pageCount).toBeDefined();
    expect(scope.doLoadCaselist).toBeDefined();
  });

  it('Should have Methods defined in it', function() {
    expect(scope.fnLoadCaseList).toBeDefined();
    expect(scope.fnGetModalTitle).toBeDefined();
    expect(scope.fnConfigureColumnMetadata).toBeDefined();
    expect(scope.fnGetColumnData).toBeDefined();
    expect(scope.fnOnCancel).toBeDefined();
    expect(scope.fnGetDate).toBeDefined();
    expect(scope.fnGetRecordPage).toBeDefined();
    expect(scope.fnInit).toBeDefined();
  });

  it('should call the method fnGetModalTitle() with optimal output', function() {
    for( var i=0; i<trackType.length; i++){
      scope.trackType = trackType[i];
      var expectation = '';
      switch(i){
        case 0: expectation='private-case-list-library.BUNDLE_CASE_ADDED';break;
        case 1: expectation='private-case-list-library.BUNDLE_CASE_REMOVED';break;
        case 2: expectation='private-case-list-library.BUNDLE_CASE_ANNOTATED';break;
      }
      expect(scope.fnGetModalTitle()).toEqual(expectation);
    }
  });

  it('should call the method fnConfigureColumnMetadata() with optimal output', function() {
    scope.trackType = constantService.CASE_LIST_ADDED;
    scope.fnConfigureColumnMetadata();
    expect(scope.columnMetadata.length).toEqual(4);
    scope.trackType = constantService.CASE_LIST_REMOVED;
    scope.fnConfigureColumnMetadata();
    expect(scope.columnMetadata.length).toEqual(4);
    scope.trackType = constantService.CASE_LIST_ANNOTATED;
    scope.fnConfigureColumnMetadata();
    expect(scope.columnMetadata.length).toEqual(3);
  });

  it('should call the method fnGetColumnData()', function() {
    for( var i=0; i<trackType.length; i++){
      for( var j=1; j<=4; j++) {
        scope.trackType = trackType[i];
        scope.fnGetColumnData({}, j);
      }
    }
  });

  it('should call the method fnOnCancel()', function() {
    scope.fnOnCancel();
  });
  it('should call the method fnGetRecordPage()', function() {
    scope.fnGetRecordPage();
  });
  it('should call the method fnInit ', function() {
    scope.fnInit();
  });

});
