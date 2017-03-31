'use strict';
describe('VerticalBarChartController Controller', function () {
  var scope, ConstantService, ctrl, CaseListFactory, AuthorizeService;
  beforeEach(function () {
    module('saintApp');
    module('saint-authorize');
    inject(function ($injector, $controller, $rootScope) {

      ConstantService = $injector.get('ConstantService');
      CaseListFactory = $injector.get('CaseListFactory');
      AuthorizeService = $injector.get('AuthorizeService');
      scope = $rootScope.$new();

      ctrl = $controller('VerticalBarChartController', {
        $scope: scope,
        ConstantService: ConstantService,
        CaseListFactory: CaseListFactory,
        AuthorizeService: AuthorizeService
      });
    });
  });

  it('should exists', function () {
    expect(ctrl).toBeDefined();
  });

  it('should have methods defined in it', function () {
    expect(scope.fnInit).toBeDefined();

  });

  it('should call the method fnInit()', function () {
    scope.data = [{
      'name': 'Number 1',
      'value': 4
    },
      {
        'name': 'Number 2',
        'value': 8
      }];
    scope.fnInit();
  });

});
