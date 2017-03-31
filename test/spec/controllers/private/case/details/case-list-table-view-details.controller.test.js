'use strict';
describe('CaseDetailsController Controller', function () {
  var ctrl, scope, state, caseFactory, rootScope, alertService, languageService, loaderService;
  beforeEach(function () {
    module('saintApp');
    inject(function ($injector, $controller, $rootScope) {
      scope = $rootScope.$new();
      state = $injector.get('$state');
      caseFactory = $injector.get('CaseFactory');
      rootScope = $rootScope;
      alertService = $injector.get('alertService');
      languageService = $injector.get('LanguageService');
      loaderService = $injector.get('loaderService');
      scope.paramsObj = {
        baseCaseKey: '22',
        caseKey: 173970
      };
      scope.caseDetails = {};
      scope.caseSuspectProducts = [];
      scope.caseEvents = [];
      scope.primaryOnsetDate = null;
      scope.lConstants = languageService.CONSTANTS;
      scope.result = null;
      ctrl = $controller('CaseDetailsController', {
        $scope: scope,
        $state: state,
        CaseFactory: caseFactory,
        $rootScope: rootScope,
        alertService: alertService,
        LanguageService: languageService,
        loaderService: loaderService
      });
    });
  });

  it('should exists', function () {
    expect(ctrl).toBeDefined();
  });
  it('Should have configs defined in it', function () {
    expect(state).toBeDefined();
    expect(scope.paramsObj).toBeDefined();
    expect(scope.caseDetails).toBeDefined();
    expect(scope.caseSuspectProducts).toBeDefined();
    expect(scope.caseEvents).toBeDefined();
    expect(scope.primaryOnsetDate).toBeDefined();
    expect(scope.lConstants).toBeDefined();
    expect(scope.result).toBeDefined();
  });

  it('Should have Methods defined in it', function () {
    //Working on it. Please don't delete.
   // expect(scope.fnGetCaseListDatesCheck).toBeDefined();
    /* expect(scope.fnGetSelectedCaseDetails).toBeDefined();
     expect(scope.fnGetCaseSuspectProducts).toBeDefined();
     expect(scope.fnGetCaseEvents).toBeDefined();
     expect(scope.fnGetSubmissionHistory).toBeDefined();
     expect(scope.fnSaveAnnotation).toBeDefined();
     expect(scope.fnInit).toBeDefined();*/
    expect(caseFactory.getCaseListDatesCheck).toBeDefined();
    expect(caseFactory.getSelectedCaseDetails).toBeDefined();
    expect(caseFactory.getCaseSuspectProducts).toBeDefined();
    expect(caseFactory.getCaseEvents).toBeDefined();
    expect(caseFactory.getICSRSubmissions).toBeDefined();
    expect(caseFactory.getCaseSubmissionHistoryPeriodic).toBeDefined();
    expect(caseFactory.fnAnnotationSave).toBeDefined();
  });

  it('should call the method fnGetCaseListDatesCheck()', function () {
    //Working on it. Please don't delete.
    //scope.fnGetCaseListDatesCheck();
  });
  it('should call the method fnGetSelectedCaseDetails()', function () {
    //Working on it. Please don't delete.
    // scope.fnGetSelectedCaseDetails();
  });
  it('should call the method fnGetCaseSuspectProducts()', function () {
    //Working on it. Please don't delete.
    //  scope.fnGetCaseSuspectProducts();
  });
  it('should call the method fnGetCaseEvents()', function () {
    //Working on it. Please don't delete.
    //  scope.fnGetCaseEvents();
  });
  it('should call the method fnGetSubmissionHistory()', function () {
    //Working on it. Please don't delete.
    // scope.fnGetSubmissionHistory();
  });
  it('should call the method fnSaveAnnotation()', function () {
    //Working on it. Please don't delete.
    // scope.fnSaveAnnotation();
  });
  it('should call the method fnInit()', function () {
    //Working on it. Please don't delete.
    scope.fnInit();
  });


});
