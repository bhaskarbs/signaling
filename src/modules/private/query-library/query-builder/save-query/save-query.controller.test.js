'use strict';
describe('QueryLibrarySaveQueryController Controller', function () {
  var scope, QueryFactory, ConstantService, ctrl, loaderService;
  beforeEach(function () {
    module('saintApp');
    inject(function ($injector, $controller, $rootScope) {
      QueryFactory = $injector.get('QueryFactory');
      ConstantService = $injector.get('ConstantService');
      loaderService = $injector.get('loaderService');
      scope = $rootScope.$new();
      ctrl = $controller('QueryLibrarySaveQueryController', {
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
    expect(scope.dialogMode).toBeDefined();
  });
  it('Should have Methods defined in it', function () {
    expect(scope.fnInit).toBeDefined();
    expect(scope.fnOnCancel).toBeDefined();
    expect(scope.fnSaveQuery).toBeDefined();
  });

  it('fnInit() should be called', function () {
    scope.dialogMode = ConstantService.SAVE_AS_QUERY;
    scope.fnInit();
    scope.dialogMode = ConstantService.SAVE_QUERY;
    scope.fnInit();
  });
  it('fnOnCancel() should be called', function () {
    scope.fnOnCancel();
  });
  xit('fnSaveQuery() should be called', function () {
    scope.fnRunQuery = function () {
    };
    scope.fnSaveQuery();
  });

});
