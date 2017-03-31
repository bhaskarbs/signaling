'use strict';
describe('ShareCaseListController Controller', function () {
  var LanguageService, scope, CaseListFactory, ConstantService, ctrl, loaderService, $timeout;
  beforeEach(function () {
    module('saintApp');
    inject(function ($injector, $controller, $rootScope) {
      CaseListFactory = $injector.get('CaseListFactory');
      ConstantService = $injector.get('ConstantService');
      loaderService = $injector.get('loaderService');
      LanguageService = $injector.get('LanguageService');
      scope = $rootScope.$new();
      $timeout = $injector.get('$timeout');
      spyOn(CaseListFactory,'getSelectedUser').and.callThrough();
      ctrl = $controller('ShareCaseListController', {
        $scope: scope,
        $timeout: $timeout,
        $rootScope: $rootScope,
        CaseListFactory: CaseListFactory,
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
    expect(scope.caseList).toBeDefined();
    expect(scope.caseList.getSelectedUsersGroup).toBeDefined();
    expect(scope.caseList.selectedUsersGroup).toBeDefined();
    expect(scope.loadUserGroupSelect).toBeDefined();
    expect(scope.dialogId).toBeDefined();
    expect(scope.userSelectId).toBeDefined();
    expect(scope.caseList.includeAllUserData).toBeDefined();
    expect(scope.language).toBeDefined();
  });
  it('Should have Methods defined in it', function () {
    expect(scope.fnGetSelectedUserGroup).toBeDefined();
    expect(scope.fnOnCancel).toBeDefined();
    expect(scope.fnSaveShareCaseList).toBeDefined();
    expect(scope.fnInit).toBeDefined();
  });

  it('fnSaveShareQuery() should be called', function () {
    scope.fnSaveShareCaseList();
  });
  it('fnOnCancel() should be called', function () {
    scope.fnOnCancel();
  });
  it('fnInit() should be called', function () {
    scope.fnInit();
  });
  it('fnGetSelectedUserGroup() should be called', function () {
    scope.fnGetSelectedUserGroup();
  });

});
