'use strict';
describe('QueryLibraryFilterController Controller', function () {
  var scope, QueryFactory, ConstantService, ctrl;
  beforeEach(function () {
    module('saintApp');
    inject(function ($injector, $controller, $rootScope) {
      QueryFactory = $injector.get('QueryFactory');
      ConstantService = $injector.get('ConstantService');
      scope = $rootScope.$new();
      ctrl = $controller('QueryLibraryFilterController', {
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
    expect(scope.categoryData).toBeDefined();
    expect(scope.placeholder).toBeDefined();
    expect(scope.descriptionText).toBeDefined();
    expect(scope.queryData).toBeDefined();
  });
  it('Should have Methods defined in it', function () {
    expect(scope.fnInit).toBeDefined();
    expect(scope.fnClickCategory).toBeDefined();
    expect(scope.fnFilterClick).toBeDefined();
    expect(scope.fnCheckbox).toBeDefined();
    expect(scope.fnFindSearchString).toBeDefined();
    expect(scope.fnSelectAll).toBeDefined();
    expect(scope.fnSelectAllbox).toBeDefined();
    expect(scope.fnLoadData).toBeDefined();
  });

  it('fnClickCategory() should accept these parameters', function () {
    var filterName = 'Query Name';
    var columnName = 'QUERY_NAME';
    var index = 0;
    var filterType = ConstantService.FILTER_LIST_KEY_LOV;
    scope.categoryData[0].contents = [];
    scope.fnClickCategory(filterName, columnName, index, filterType);
    scope.categoryData[0].contents = ['test'];
    scope.fnClickCategory(filterName, columnName, index, filterType);
  });
  it('fnFilterClick() should accept these parameters', function () {
    var filter = 'Test';
    var categoryName = 'Query Name';
    var columnName = 'QUERY_NAME';
    var category = 'Query Name';
    var filterType = 'TEXT';
    var selectAll = true;
    scope.fnFilterClick(filter, categoryName, columnName, category, filterType, selectAll);
    selectAll = false;
    scope.fnFilterClick(filter, categoryName, columnName, category, filterType, selectAll);
  });
  it('fnCheckbox() should accept these parameters', function () {
    var filter = 'Test';
    var categoryName = 'Query Name';
    scope.fnCheckbox(filter, categoryName);
  });
  it('fnFindSearchString() should accept these parameters', function () {
    var item = {filterName: 'Query Name', descSearch: 'Test', columnName: 'QUERY_NAME', filterType: 'TEXT'};
    scope.fnFindSearchString(item);
  });
  it('fnSelectAll() should accept these parameters', function () {
    var selectAllCatgoryObj = {
      filterName: 'Query Name',
      descSearch: 'Test',
      columnName: 'QUERY_NAME',
      filterType: 'TEXT',
      contents: ['Test', 'Name']
    };
    scope.fnSelectAll(selectAllCatgoryObj, true);
  });
  it('fnLoadData() should accept these parameters', function () {
    var selectAllCatgoryObj = {
      filterName: 'Query Name',
      descSearch: 'Test',
      columnName: 'QUERY_NAME',
      filterType: 'TEXT',
      contents: ['Test', 'Name']
    };
    scope.fnLoadData(selectAllCatgoryObj, true);
  });
});
