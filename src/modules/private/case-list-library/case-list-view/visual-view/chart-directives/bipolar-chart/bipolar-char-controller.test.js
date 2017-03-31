'use strict';
describe('BipolarChartController Controller', function () {
  var scope,ConstantService,ctrl,CaseListFactory,AuthorizeService;
  beforeEach(function () {
    module('saintApp');
    module('saint-authorize');
    inject(function ($injector,$controller, $rootScope) {

      ConstantService = $injector.get('ConstantService');
      CaseListFactory=$injector.get('CaseListFactory');
      AuthorizeService=$injector.get('AuthorizeService');
      scope = $rootScope.$new();

      ctrl = $controller('BipolarChartController', {
        $scope: scope,
        ConstantService : ConstantService,
        CaseListFactory:CaseListFactory,
        AuthorizeService: AuthorizeService
      });
    });
  });

  it('should exists', function () {
    expect(ctrl).toBeDefined();
  });

  it('should have Methods defined in it', function() {
    expect(scope.fnInit).toBeDefined();

  });

  it('should call the method fnInit()', function() {
    scope.data=[{'name': 'Listed','value': 50},{'name': 'Unlisted','value': 30}];

    scope.fnInit();
  });

});
