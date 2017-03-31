'use strict';
describe('CaseListHeaderController Controller', function () {
  var scope, CaseListFactory, alertService, LanguageService, CaseFactory, ctrl, $q, AuthorizeService;

  beforeEach(function () {
    module('saintApp');
    module('saint-authorize');
    inject(function ($injector,$controller, $rootScope) {
      CaseListFactory = $injector.get('CaseListFactory');
      alertService = $injector.get('alertService');
      CaseFactory = $injector.get('CaseFactory');
      LanguageService = $injector.get('LanguageService');
      scope = $rootScope.$new();
      $q = $injector.get('$q');
      AuthorizeService = $injector.get('AuthorizeService');
      ctrl = $controller('CaseListHeaderController', {
        $scope: scope,
        CaseFactory : CaseFactory,
        LanguageService : LanguageService,
        CaseListFactory : CaseListFactory,
        alertService: alertService,
        AuthorizeService: AuthorizeService
      });
    });
  });
  it('should exists', function () {
    expect(ctrl).toBeDefined();
  });
  it('should behave configs defined in it', function() {
    expect(scope.caseListName).toBeDefined();
    expect(scope.caseListCount).toBeDefined();
    expect(scope.caseListCount.lastRunCount).toEqual('--');
    expect(scope.caseListCount.lastSavedCount).toEqual('--');
    expect(scope.caseListCount.listedCount).toEqual(0);
    expect(scope.caseListCount.addedCount).toEqual(0);
    expect(scope.caseListCount.removedCount).toEqual(0);
    expect(scope.caseListCount.annotatedCount).toEqual(0);
  });
  it('Should have Methods defined in it', function() {
    expect(scope.fnGenerateNameAndCount).toBeDefined();
    expect(scope.fnTrackAllCaseListCount).toBeDefined();
    expect(scope.fnTrackCases).toBeDefined();
    expect(scope.fnWrapperNavigate).toBeDefined();
    expect(scope.fnPersistReportPanelState).toBeDefined();
    expect(scope.fnOnDateChange).toBeDefined();
    expect(scope.fnSaveCaseList).toBeDefined();
    expect(scope.fnResetQuery).toBeDefined();
    expect(scope.fnInit).toBeDefined();
    expect(scope.fnGetSelectedCaseListAllDetails).toBeDefined();
    expect(scope.fnDownloadExcel).toBeDefined();
  });
  it('should call the method fnInit()', function() {
    scope.fnInit();
  });
  it('should call the method fnTrackCases()', function() {
    scope.fnTrackCases('some value');
    expect(CaseFactory.data.trackViewType).toEqual('some value');
  });
  it('should call the method fnTrackAllCaseListCount()', function() {
    scope.fnTrackAllCaseListCount();
  });
  it('should call the method fnGenerateNameAndCount()', function() {
    scope.fnGenerateNameAndCount({'caseListName' : 'caseListName', 'description' : 'description', 'finalQuery' : 'finalQuery'});
  });
  it('should call the method fnPersistReportPanelState()', function(){
    scope.fnPersistReportPanelState();
  });
  it('should call the method fnOnDateChange()', function () {
    scope.fnOnDateChange();
  });
  it('should call the method fnSaveCaseList()', function(){
    scope.caseListName='(Case List Not Saved)';
    scope.fnSaveCaseList();
  });
  it('it should call the method fnResetQuery()',function(){
    scope.fnResetQuery();
  });
  it('should call the method fnGetSelectedCaseListAllDetails()', function(){
    scope.fnGetSelectedCaseListAllDetails();
  });
  it('should export to excel',function(){
    scope.baseCaseListKey = 417;
    scope.fnDownloadExcel();
  });

});
