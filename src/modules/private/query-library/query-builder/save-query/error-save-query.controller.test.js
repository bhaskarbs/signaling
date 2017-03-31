'use strict';
describe('ErrorSaveQueryController Controller', function () {
  var scope, QueryFactory, ConstantService, loaderService, ctrl;
  beforeEach(function () {
    module('saintApp');
    inject(function ($injector, $controller, $rootScope) {
      QueryFactory = $injector.get('QueryFactory');
      ConstantService = $injector.get('ConstantService');
      loaderService = $injector.get('loaderService');
      scope = $rootScope.$new();
      ctrl = $controller('ErrorSaveQueryController', {
        $scope: scope,
        $rootScope: $rootScope,
        QueryFactory: QueryFactory,
        ConstantService: ConstantService,
        loaderService: loaderService
      });
    });
  });

  it('should exists', function () {
    expect(ctrl).toBeDefined();
  });
  it('Should have configs defined in it', function () {
    expect(scope.errorMessage).toBeDefined();
    expect(scope.$on).toBeDefined();
  });
  it('Should have Methods defined in it', function () {
    expect(scope.fnClosePopup).toBeDefined();
  });

  it('fnClosePopup() should be called', function () {
    scope.fnClosePopup();
  });
});
