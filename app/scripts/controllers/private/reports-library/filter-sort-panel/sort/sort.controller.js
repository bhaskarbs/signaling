'use strict';
angular.module('saintApp').controller('ReportsLibrarySortController', ['$scope', 'ReportFactory', 'ConstantService', function (scope, ReportFactory, ConstantService) {


  scope.fnInit = function () {
    scope.sortData = [];
    scope.sortBy = ReportFactory.data.reportSort.sortedBy;
    scope.secondarySort = ReportFactory.data.reportSort.secondarySort;
    scope.filterName = ReportFactory.data.reportSort.sortedByName;
    scope.sortOrder = ReportFactory.data.reportSort.sortOrder;
    scope.sortOrderASC = ConstantService.ASCENDING;
    scope.sortOrderDESC = ConstantService.DESCENDING;
    scope.isActiveTab = (scope.sortOrder === ConstantService.ASCENDING);
    ReportFactory.getFilterConfig(ConstantService.FILTER_PARAM_SORT).then(
      function (result) {
        if (result.error) {
        } else {
          if (result.data) {
            scope.sortData = result.data;
            ReportFactory.data.reportSort.sortedByName = scope.filterName;
          }
        }
      }
    );
  };
  scope.fnApplySort = function (sortBy,secondarySort, sortOrder, filterName) {
    scope.filterName = filterName;
    scope.secondarySort=secondarySort;
    if (sortOrder === ConstantService.ASCENDING) {
      scope.isActiveTab = true;
    } else {
      scope.isActiveTab = false;
    }
    ReportFactory.data.reportSort.sortedBy = sortBy;
    ReportFactory.data.reportSort.secondarySort = secondarySort;
    ReportFactory.data.reportSort.sortOrder = sortOrder;
    ReportFactory.data.reportSort.sortedByName = scope.filterName;

    var keyToPersist = 'SORT_REPORT';
    var valueToPersist = ReportFactory.data.reportSort;
    //Update Persistence
    ReportFactory.persistPreference(keyToPersist, valueToPersist);
  };

  scope.fnInit();
}]);
