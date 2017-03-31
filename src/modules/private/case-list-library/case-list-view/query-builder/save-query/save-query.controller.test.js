'use strict';
describe('QueryBuilderSaveQueryController Controller', function () {
  var scope, QueryFactory, ConstantService, ctrl, loaderService, QueryGeneratorService,QuerySetEntity;
  beforeEach(function () {
    module('saintApp');
    inject(function ($injector, $controller, $rootScope) {
      QueryGeneratorService = $injector.get('QueryGeneratorService');
      QuerySetEntity = $injector.get('QuerySetEntity');
      QueryFactory = $injector.get('QueryFactory');
      ConstantService = $injector.get('ConstantService');
      loaderService = $injector.get('loaderService');
      scope = $rootScope.$new();
      ctrl = $controller('QueryBuilderSaveQueryController', {
        $scope: scope,
        $rootScope: $rootScope,
        QueryFactory: QueryFactory,
        ConstantService: ConstantService,
        loaderService: loaderService,
        QuerySetEntity: QuerySetEntity,
        QueryGeneratorService: QueryGeneratorService
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
    expect(scope.fnOnCancel).toBeDefined();
    expect(scope.fnSaveQueryToLibrary).toBeDefined();
  });

  it('fnOnCancel() should be called', function () {
    scope.fnOnCancel();
  });
  it('fnSaveQueryToLibrary() should be called', function () {
    scope.fnSaveQueryToLibrary();
  });

});
