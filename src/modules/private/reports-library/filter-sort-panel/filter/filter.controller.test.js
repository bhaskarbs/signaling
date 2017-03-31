'use strict';
describe('FilterController Controller', function () {
  var scope, ReportFactory, ConstantService, ctrl;
  beforeEach(function () {
    module('saintApp');
    inject(function ($injector,$controller, $rootScope) {
      ReportFactory = $injector.get('ReportFactory');
      ConstantService = $injector.get('ConstantService');
      scope = $rootScope.$new();
      ctrl = $controller('FilterController', {
        $scope: scope,
        ReportFactory : ReportFactory,
        ConstantService : ConstantService
      });
    });
  });

  it('should exists', function () {
    expect(ctrl).toBeDefined();
  });
  it('Should have configs defined in it', function() {
    expect(scope.categoryData).toBeDefined();
    expect(scope.descriptionText).toBeDefined();
    expect(scope.reportData).toBeDefined();
  });
  it('Should have Methods defined in it', function() {
    expect(scope.fnInit).toBeDefined();
    expect(scope.fnClickCategory).toBeDefined();
    expect(scope.fnFilterClick).toBeDefined();
    expect(scope.fnRemoveSpace).toBeDefined();
    expect(scope.fnCheckbox).toBeDefined();
    expect(scope.fnFindSearchString).toBeDefined();
  });
});
