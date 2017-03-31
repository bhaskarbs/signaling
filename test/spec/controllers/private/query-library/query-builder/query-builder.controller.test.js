'use strict';
describe('QueryLibraryBuilderController Controller', function () {
  var scope, State, QueryRuleEntity, CaseListEntity, stateParams, QueryGroupEntity, CaseListQueryService, CaseListFactory, UrlService, QueryFactory, ConstantService, ctrl, loaderService;
  beforeEach(function () {
    module('saintApp');
    inject(function ($injector, $controller, $rootScope) {
      UrlService = $injector.get('UrlService');
      QueryFactory = $injector.get('QueryFactory');
      ConstantService = $injector.get('ConstantService');
      CaseListFactory = $injector.get('CaseListFactory');
      loaderService = $injector.get('loaderService');
      CaseListQueryService = $injector.get('CaseListQueryService');
      QueryGroupEntity = $injector.get('QueryGroupEntity');

      stateParams = $injector.get('$stateParams');
      CaseListEntity = $injector.get('CaseListEntity');
      QueryRuleEntity = $injector.get('QueryRuleEntity');
      State = $injector.get('$state');


      scope = $rootScope.$new();
      ctrl = $controller('QueryLibraryBuilderController', {
        $scope: scope,
        $rootScope: $rootScope,
        QueryFactory: QueryFactory,
        ConstantService: ConstantService,
        loaderService: loaderService,
        UrlService: UrlService,
        CaseListFactory: CaseListFactory,
        CaseListQueryService: CaseListQueryService,
        QueryGroupEntity: QueryGroupEntity,
        $stateParams: stateParams,
        CaseListEntity: CaseListEntity,
        QueryRuleEntity: QueryRuleEntity,
        $state: State
      });
    });
  });

  it('should exists', function () {
    expect(ctrl).toBeDefined();
  });
  it('Should have configs defined in it', function () {
    expect(scope.conditionKey).toBeDefined();
    expect(scope.filterJsonString).toBeDefined();
    expect(scope.output).toBeDefined();
    expect(scope.conditionKey).toBeDefined();
    expect(scope.operands).toBeDefined();
    expect(scope.dimensions).toBeDefined();
    expect(scope.operators).toBeDefined();
    expect(scope.filter).toBeDefined();
    expect(scope.caseList).toBeDefined();
  });
  it('Should have Methods defined in it', function () {
    expect(scope.setPageMode).toBeDefined();
    expect(scope.getPageMode).toBeDefined();
    expect(scope.togglePageMode).toBeDefined();
    expect(scope.fnHtmlEntities).toBeDefined();
    expect(scope.fnGetOperatorName).toBeDefined();
    expect(scope.fnSetQueryContext).toBeDefined();
    expect(scope.fnComputedString).toBeDefined();
    expect(scope.buildQuerySet).toBeDefined();
    expect(scope.fnRunQuery).toBeDefined();
    expect(scope.fnPopulateQueryBuilder).toBeDefined();
    expect(scope.fnInit).toBeDefined();
  });

  it('setPageMode() should be called', function () {
    scope.setPageMode(ConstantService.EDIT_MODE);
  });
  it('getPageMode() should be called', function () {
    scope.getPageMode();
  });
  it('togglePageMode() should be called', function () {
    scope.setPageMode(ConstantService.EDIT_MODE);
    scope.togglePageMode();
    scope.setPageMode(ConstantService.READ_MODE);
    scope.togglePageMode();
  });
  it('fnHtmlEntities() should be called', function () {
    scope.fnHtmlEntities('contains');
  });

});
