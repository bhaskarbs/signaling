'use strict';
describe('QueryLibrarySortController Controller', function () {
  var scope, QueryFactory, ConstantService, ctrl;
  beforeEach(function () {
    module('saintApp');
    inject(function ($injector, $controller, $rootScope) {
      QueryFactory = $injector.get('QueryFactory');
      ConstantService = $injector.get('ConstantService');
      scope = $rootScope.$new();
      ctrl = $controller('QueryLibrarySortController', {
        $scope: scope,
        QueryFactory: QueryFactory,
        ConstantService: ConstantService
      });
    });
  });

  it('should exists', function () {
    expect(ctrl).toBeDefined();
  });
  it('Should have configs defined in it', function () {
    expect(scope.sortData).toBeDefined();
    expect(scope.sortBy).toBeDefined();
    expect(scope.filterName).toBeDefined();
    expect(scope.sortOrder).toBeDefined();
    expect(scope.secondarySort).toBeDefined();
    expect(scope.sortOrderASC).toBeDefined();
    expect(scope.sortOrderDESC).toBeDefined();
    expect(scope.isActiveTab).toBeDefined();
  });
  it('Should have Methods defined in it', function () {
    expect(scope.fnInit).toBeDefined();
    expect(scope.fnApplySort).toBeDefined();
  });

  it('fnApplySort() should accept these parameters', function () {
    var filterName = 'Query Name';
    var sortOrder = 'asc';
    var sortBy = 'Created By';
    var secondarySort = 'Query Name';
    scope.fnApplySort(sortBy, secondarySort, sortOrder, filterName);
    sortOrder = 'desc';
    scope.fnApplySort(sortBy, secondarySort, sortOrder, filterName);
  });
});
