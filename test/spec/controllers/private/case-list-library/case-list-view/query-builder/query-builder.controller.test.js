'use strict';
describe('QueryBuilderController Controller', function() {
  var scope, ctrl, CaseListFactory, QueryGroupEntity, QueryRuleEntity, CaseListQueryService, QuerySetEntity, CaseListEntity, $stateParams, SaintService, AuthorizeService, QueryBuilderEntity;
 beforeEach(function() {
        module('saintApp');
        module('saint-authorize');
        inject(function($injector, $controller, $rootScope) {
           scope = $rootScope.$new();
            CaseListFactory=$injector.get('CaseListFactory');
            QueryGroupEntity=$injector.get('QueryGroupEntity');
            QueryRuleEntity=$injector.get('QueryRuleEntity');
            CaseListQueryService=$injector.get('CaseListQueryService');
            AuthorizeService = $injector.get('AuthorizeService');
            QuerySetEntity=$injector.get('QuerySetEntity');
            SaintService = $injector.get('SaintService');
            CaseListEntity=$injector.get('CaseListEntity');
          QueryBuilderEntity = $injector.get('QueryBuilderEntity');
            $stateParams=$injector.get('$stateParams');
            ctrl = $controller('QueryBuilderController', {
                $scope: scope,
                CaseListFactory:CaseListFactory,
                QueryGroupEntity:QueryGroupEntity,
                QueryRuleEntity:QueryRuleEntity,
                CaseListQueryService:CaseListQueryService,
                QuerySetEntity:QuerySetEntity,
                CaseListEntity:CaseListEntity,
              QueryBuilderEntity: QueryBuilderEntity,
              AuthorizeService: AuthorizeService,
                $stateParams:$stateParams,
                SaintService: SaintService

            });
        });
    });
    it('Should exists', function() {
        expect(ctrl).toBeDefined();
    });
    it('Should have dependencies', function() {
        expect(scope).toBeDefined();
        expect(CaseListFactory).toBeDefined();
        expect(QueryGroupEntity).toBeDefined();
        expect(QueryRuleEntity).toBeDefined();
        expect(CaseListQueryService).toBeDefined();
        expect(QuerySetEntity).toBeDefined();
        expect(CaseListEntity).toBeDefined();
        expect($stateParams).toBeDefined();
        expect(QueryBuilderEntity).toBeDefined();

    });
    it('Should have predefined values', function() {
        expect( scope.conditionKey).toBe('dataType');
        expect(scope.operands).toEqual([{key: 1, name: 'AND'}, {key: 0, name: 'OR'}]);
        expect(scope.dimensions).toEqual([]);
        expect(scope.operators).toEqual([]);
    });
     xit('Should have methods in it',function(){
        expect(scope.fnInit).toBeDefined();
        expect(scope.fnAppendIncludeExcludeCount).toBeDefined();
        expect(scope.$watch).toBeDefined();
        expect(scope.saveAnalyticalQuery).toBeDefined();
        expect(scope.composeGroupObject).toBeDefined();
        expect(scope.fnPopulateQueryBuilder).toBeDefined();
       expect(scope.fnSetOperation).toBeDefined();
    });
  xit('Should call the fnPopulateQueryBuilder', function () {
        jasmine.getJSONFixtures().fixturesPath = 'base/test/spec/fixtures';
        var object = getJSONFixture('query-builder-controller.fn-populate-query-builder.test.json');
        var group = object.groupObject;
        scope.operators = object.operators;
        scope.dimensions = object.dimensions;
        var destination = {};
        scope.fnPopulateQueryBuilder(group,destination);
     });
});
