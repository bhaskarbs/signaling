'use strict';
angular.module('saintApp').controller('QueryLibrarySortController', ['$scope', 'QueryFactory', 'ConstantService', function (scope, QueryFactory, ConstantService) {
  scope.fnInit = function () {
    scope.sortData = [];
    scope.sortBy = QueryFactory.data.querySort.sortedBy;
    scope.filterName = QueryFactory.data.querySort.sortedByName;
    scope.sortOrder = QueryFactory.data.querySort.sortOrder;
    scope.secondarySort = QueryFactory.data.querySort.secondarySort;
    scope.sortOrderASC = ConstantService.ASCENDING;
    scope.sortOrderDESC = ConstantService.DESCENDING;
    scope.isActiveTab = (scope.sortOrder === ConstantService.ASCENDING);
    QueryFactory.getConfig(ConstantService.FILTER_PARAM_SORT).then(
      function (result) {
        if (result.data) {
          scope.sortData = result.data;
          QueryFactory.data.querySort.sortedByName = scope.filterName;
        }
      }
    );
  };
  scope.fnApplySort = function (sortBy, secondarySort, sortOrder, filterName) {
    scope.filterName = filterName;
    scope.secondarySort = secondarySort;
    if (sortOrder === ConstantService.ASCENDING) {
      scope.isActiveTab = true;
    } else {
      scope.isActiveTab = false;
    }
    QueryFactory.data.querySort.sortedBy = sortBy;
    QueryFactory.data.querySort.sortOrder = sortOrder;
    QueryFactory.data.querySort.sortedByName = scope.filterName;
    QueryFactory.data.querySort.secondarySort = secondarySort;
    var keyToPersist = 'SORT_QUERY_LIBRARY';
    var valueToPersist = QueryFactory.data.querySort;
    //Update Persistence
    QueryFactory.persistPreference(keyToPersist, valueToPersist);
  };

  scope.fnInit();
}]);
