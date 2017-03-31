'use strict';
describe('TableController Controller', function () {
  var $state, $scope, ConstantService, DateService, LanguageService, alertService, CaseListFactory, loaderService, CaseFactory, TableCtrl;
  beforeEach(function () {
    module('saintApp');
    inject(function ($injector, $controller, $rootScope) {
      $state = $injector.get('$state');
      $scope = $rootScope.$new();
      ConstantService = $injector.get('ConstantService');
      DateService = $injector.get('DateService');
      LanguageService = $injector.get('LanguageService');
      alertService = $injector.get('alertService');
      CaseListFactory = $injector.get('CaseListFactory');
      loaderService = $injector.get('loaderService');
      CaseFactory = $injector.get('CaseFactory');
      spyOn($state, 'go');
      TableCtrl = $controller('TableController', {
        $scope: $scope,
        CaseFactory: CaseFactory,
        CaseListFactory: CaseListFactory,
        ConstantService: ConstantService,
        DateService: DateService,
        loaderService: loaderService
      });
    });
  });

  it('should exists', function () {
    expect(TableCtrl).toBeDefined();
  });


  it('Should have configs defined in it', function () {
    expect($scope.caseListData).toBeDefined();
    expect($scope.caseListTableData).toBeDefined();
    expect($scope.displayedCollection).toBeDefined();
    expect($scope.datesCheck).toBeDefined();
    expect($scope.state).toBeDefined();
    expect($scope.page).toBeDefined();
    expect($scope.caseNumberText).toBeDefined();
    expect($scope.isData).toBeDefined();
  });
  it('Should have Methods defined in it', function () {
    expect($scope.getTableData).toBeDefined();
    expect($scope.getDatesCheckObj).toBeDefined();
    expect($scope.fnInit).toBeDefined();
    expect($scope.fnLoadMoreCases).toBeDefined();
    expect($scope.fnSelectedCaseList).toBeDefined();
    expect($scope.fnIncludeExcludeCasesBtn).toBeDefined();
    expect($scope.fnGetDateString).toBeDefined();
    expect($scope.fnGetCaseDetails).toBeDefined();
    expect($scope.fnSearch).toBeDefined();
  });
  it('should call the method getTableData()', function () {
    $scope.getTableData();
  });
  it('should call the method getDatesCheckObj()', function () {
    $scope.getDatesCheckObj();
  });
  it('should call the method fnInit()', function () {
    $scope.fnInit();
  });
  it('should call the method fnLoadMoreCases()', function () {
    $scope.fnLoadMoreCases();
  });
  it('should call the method fnSelectedCaseList()', function () {
    $scope.fnSelectedCaseList();
  });
  it('should call the method fnGetDateString()', function () {
    $scope.fnGetDateString();
  });
  it('should call the method fnGetCaseDetails()', function () {
    var selObj = {
      caseKey: 164225
    };
    $scope.fnGetCaseDetails(selObj);
    expect($state.go).toHaveBeenCalledWith('caselist.view.details', {caseKey: 164225,id:undefined }, {'reload': true});
  });
  it('should call the method fnSearch()', function () {
    $scope.caseNumberText = '20121102911';
    $scope.fnSearch();
  });
});
