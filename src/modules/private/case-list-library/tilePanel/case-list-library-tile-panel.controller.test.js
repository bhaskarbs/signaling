'use strict';
describe('CaseListTilePanelController Controller', function () {
  var scope,ConstantService,caseListFactory,UrlService,DateService,$state,loaderService,ctrl;
  beforeEach(function () {
    module('saintApp');
    inject(function ($injector,$controller, $rootScope) {
      ConstantService = $injector.get('ConstantService');
      scope = $rootScope.$new();
      caseListFactory=$injector.get('CaseListFactory');
      UrlService=$injector.get('UrlService');
      DateService=$injector.get('DateService');
      $state = $injector.get('$state');
      spyOn($state, 'go');
      loaderService=$injector.get('loaderService');
      ctrl = $controller('CaseListTilePanelController', {
        $scope: scope,
        ConstantService : ConstantService,
        CaseListFactory:caseListFactory,
        UrlService:UrlService,
        DateService:DateService,
        $state:$state,
        loaderService:loaderService
      });
    });
  });

  it('should exists', function () {
    expect(ctrl).toBeDefined();
  });
  it('Should have configs defined in it', function() {
    expect(scope.myCaseListDataRepo).toBeDefined();
    expect(scope.myCaseListData).toBeDefined();
    expect(scope.totalCaseList).toBeDefined();
    expect(scope.startPageShown).toBeDefined();
    expect(scope.endPageShown).toBeDefined();
    expect(scope.caseListPerPage).toBeDefined();
    expect(scope.caseListServiceData).toBeDefined();
    expect(scope.sortBy).toBeDefined();
    expect(scope.startIndex).toBeDefined();
    expect(scope.endIndex).toBeDefined();
    expect(scope.pagination).toBeDefined();
  });
  it('Should have Methods defined in it', function() {
    expect(scope.fnTileSelected).toBeDefined();
    expect(scope.fnGenerateRequestPayload).toBeDefined();
    expect(scope.fnGetDate).toBeDefined();
    expect(scope.fngetRecordPage).toBeDefined();
    expect(scope.fnpageChanged).toBeDefined();
    expect(scope.fnpageInitialization).toBeDefined();
  });
  it('should call the method fnGenerateRequestPayload', function() {
    scope.fnGenerateRequestPayload();
  });
  it('should call the method fnGetDate', function() {
    scope.fnGetDate();
  });
  it('should call the method fngetRecordPage', function() {
    scope.fngetRecordPage();

  });
  it('should call the method fnpageChanged', function() {
    scope.fnpageChanged();
  });
  it('should call the method fnpageInitialization', function() {
    scope.fnpageInitialization();
  });

});
