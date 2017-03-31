'use strict';
describe('CasesController Controller', function () {
    var scope, $state, ctrl, CaseListFactory;
    var response = {
        data: 'some'
    };
    var response1 = {
        data: 'some'
    };
    beforeEach(function () {
        module('saintApp');
        module('saint-authorize');
        inject(function ($injector, $controller, $rootScope) {
            $state = $injector.get('$state');
            CaseListFactory = $injector.get('CaseListFactory');
            scope = $rootScope.$new();
            ctrl = $controller('CasesController', {
                $scope: scope,
                $state: $state,
                CaseListFactory: CaseListFactory
            });
        });
    });

    it('Should exists', function () {
        expect(ctrl).toBeDefined();
    });

    it('Should have dependencies', function () {
        expect(scope).toBeDefined();
        expect($state).toBeDefined();
        expect(CaseListFactory).toBeDefined();
    });

    it('Should have predefined value', function () {
        expect(scope.caseListData).toBe(CaseListFactory.data);
    });

    it('Should have Methods defined in it', function () {
        expect(scope.fnInit).toBeDefined();
        expect(scope.fnGetOperatorDimensionInfo).toBeDefined();
    });

    it('Should call fnInit() function', function () {
        scope.fnInit();
    });

    it('Should call fnGetOperatorDimensionInfo() function', function () {

        spyOn(CaseListFactory, 'getDimensionInfo').and.callFake(function () {
            return {
                then: function (callback) { return callback(response); }
            };
        });
        spyOn(CaseListFactory, 'getOperatorInfo').and.callFake(function () {
            return {
                then: function (callback) { return callback(response1); }
            };
        });
        scope.fnGetOperatorDimensionInfo();
    });
});

