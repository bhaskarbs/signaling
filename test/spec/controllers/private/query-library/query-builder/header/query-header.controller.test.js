'use strict';
describe('QueryLibraryHeaderController Controller', function () {
  var scope, QueryFactory, ConstantService, ctrl;
  beforeEach(function () {
    module('saintApp');
    inject(function ($injector, $controller, $rootScope) {
      QueryFactory = $injector.get('QueryFactory');
      ConstantService = $injector.get('ConstantService');
      scope = $rootScope.$new();
      ctrl = $controller('QueryLibraryHeaderController', {
        $scope: scope,
        $rootScope: $rootScope,
        QueryFactory: QueryFactory,
        ConstantService: ConstantService
      });
    });
  });

  it('should exists', function () {
    expect(ctrl).toBeDefined();
  });
  it('Should have configs defined in it', function () {
    expect(scope.queryFactoryData).toBeDefined();
  });
  it('Should have Methods defined in it', function () {
    expect(scope.fnSaveQuery).toBeDefined();
    expect(scope.fnEditButtonClicked).toBeDefined();
  });

  it('fnSaveQuery() should be called', function () {
    scope.fnSaveQuery(ConstantService.READ_MODE);
  });
  it('fnEditButtonClicked() should be called', function () {
    scope.togglePageMode = function () {
    };
    scope.fnEditButtonClicked();
  });

});
