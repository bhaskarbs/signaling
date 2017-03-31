'use strict';
describe('QueryLibraryShareQueryController Controller', function () {
  var LanguageService, scope, QueryFactory, ConstantService, ctrl, loaderService, $timeout;
  beforeEach(function () {
    module('saintApp');
    inject(function ($injector, $controller, $rootScope) {
      QueryFactory = $injector.get('QueryFactory');
      ConstantService = $injector.get('ConstantService');
      loaderService = $injector.get('loaderService');
      LanguageService = $injector.get('LanguageService');
      scope = $rootScope.$new();
      $timeout = $injector.get('$timeout');
      ctrl = $controller('QueryLibraryShareQueryController', {
        $scope: scope,
        $timeout: $timeout,
        $rootScope: $rootScope,
        QueryFactory: QueryFactory,
        ConstantService: ConstantService,
        loaderService: loaderService,
        LanguageService: LanguageService
      });
    });
  });

  it('should exists', function () {
    expect(ctrl).toBeDefined();
  });
  it('Should have configs defined in it', function () {
    expect(scope.query).toBeDefined();
    expect(scope.query.getSelectedUsersGroup).toBeDefined();
    expect(scope.query.selectedUsersGroup).toBeDefined();
    expect(scope.loadUserGroupSelect).toBeDefined();
    expect(scope.dialogId).toBeDefined();
    expect(scope.userSelectId).toBeDefined();
    expect(scope.query.includeAllUserData).toBeDefined();
  });
  it('Should have Methods defined in it', function () {
    expect(scope.fnGetSelectedUserGroup).toBeDefined();
    expect(scope.fnOnCancel).toBeDefined();
    expect(scope.fnSaveShareQuery).toBeDefined();
    expect(scope.fnInit).toBeDefined();
  });

  it('fnSaveShareQuery() should be called', function () {
    scope.fnSaveShareQuery();
  });
  it('fnOnCancel() should be called', function () {
    scope.fnOnCancel();
  });

});
