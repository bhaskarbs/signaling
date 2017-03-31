'use strict';
describe('IncludeExcludeController Controller', function () {
  var $state, $scope, ConstantService, LanguageService, alertService, CaseListFactory, loaderService, CaseFactory, IncludeExcludeController, AuthorizeService;
  var caseListId = {
    data: 9
  };
  var caseToUpload = {
    data: []
  };
  beforeEach(function () {
    module('saintApp');
    module('saint-authorize');
    inject(function ($injector, $controller, $rootScope) {
      $state = $injector.get('$state');
      $scope = $rootScope.$new();
      ConstantService = $injector.get('ConstantService');
      LanguageService = $injector.get('LanguageService');
      alertService = $injector.get('alertService');
      CaseListFactory = $injector.get('CaseListFactory');
      loaderService = $injector.get('loaderService');
      CaseFactory = $injector.get('CaseFactory');
      AuthorizeService = $injector.get('AuthorizeService');
      IncludeExcludeController = $controller('IncludeExcludeController', {
        $scope: $scope,
        CaseFactory: CaseFactory,
        CaseListFactory: CaseListFactory,
        ConstantService: ConstantService,
        loaderService: loaderService,
        AuthorizeService: AuthorizeService
      });
    });
  });

  it('should exists', function () {
    expect(IncludeExcludeController).toBeDefined();
  });


  it('Should have configs defined in it', function () {
    expect(caseListId).toBeDefined();
    expect(caseToUpload).toBeDefined();
    expect($scope.caseListData).toBeDefined();
    expect($scope.cases).toBeDefined();
    expect($scope.state).toBeDefined();
    expect($scope.caseListWithOutNull).toBeDefined();
    expect($scope.inValidCases).toBeDefined();
    expect($scope.validCases).toBeDefined();
    expect($scope.isFileAvailableError).toBeDefined();
    expect($scope.caseIds).toBeDefined();
  });
  it('Should have Methods defined in it', function () {
    expect($scope.fnSelectCase).toBeDefined();
    expect($scope.fnSearchCase).toBeDefined();
    expect($scope.fnChosenCase).toBeDefined();
    expect($scope.fnCasesListSave).toBeDefined();
    expect($scope.fnOnCancel).toBeDefined();
  });
  it('should call the method fnSelectCase()', function () {
    $scope.fnSelectCase();
  });
  it('should call the method fnSearchCase()', function () {
    $scope.fnSearchCase();
  });
  it('should call the method fnChosenCase()', function () {
    $scope.fnChosenCase();
  });
  it('should call the method fnCasesListSave()', function () {
    $scope.fnCasesListSave();
  });
  it('should call the method fnOnCancel()', function () {
    $scope.fnOnCancel();
  });
});
