'use strict';
describe('CaseListLibraryController Controller', function () {
  var scope, ConstantService, caseListFactory, persistenceFactory, ctrl;
  beforeEach(function () {
    module('saintApp');
    inject(function ($injector, $controller, $rootScope) {
      ConstantService = $injector.get('ConstantService');
      scope = $rootScope.$new();
      caseListFactory = $injector.get('CaseListFactory');
      persistenceFactory = $injector.get('PreferencesFactory');
      ctrl = $controller('CaseListLibraryController', {
        $scope: scope,
        ConstantService: ConstantService,
        PersistenceFactory: persistenceFactory,
        CaseListFactory: caseListFactory
      });
    });
  });

  it('should exists', function () {
    expect(ctrl).toBeDefined();
  });
  it('Should have configs defined in it', function () {
    expect(scope.showFilterPanel).toBeDefined();
  });
  it('Should have Methods defined in it', function () {
    expect(scope.fnInit).toBeDefined();
    expect(scope.fnToggleFilterPanel).toBeDefined();
    expect(scope.fnCallRefreshReportTiles).toBeDefined();
    expect(scope.fngetPersistedUserData).toBeDefined();
    expect(scope.fnPostProcessingPersistedDataReceived).toBeDefined();
  });
  it('should call the method fnInit()', function () {
    scope.fnInit();
  });
  it('should call the method fnToggleFilterPanel', function () {
    scope.fnToggleFilterPanel();
  });
  it('should call the method fnCallRefreshReportTiles', function () {
    scope.fnCallRefreshReportTiles();
  });
  it('should call the method fngetPersistedUserData', function () {
    scope.fngetPersistedUserData();
  });
  it('should call the method fnPostProcessingPersistedDataReceived', function () {
    scope.fnPostProcessingPersistedDataReceived();
  });
});
