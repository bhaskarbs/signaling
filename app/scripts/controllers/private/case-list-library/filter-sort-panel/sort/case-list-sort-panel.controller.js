'use strict';
angular.module('saintApp').controller('CaseListLibrarySortController', ['$scope', 'CaseListFactory', 'ConstantService', function (scope, CaseListFactory, ConstantService) {
  scope.fnInit = function () {
    scope.sortData = [];
    scope.sortBy=CaseListFactory.data.caseListSort.sortedBy;
    scope.filterName=CaseListFactory.data.caseListSort.sortedByName;
    scope.sortOrder = CaseListFactory.data.caseListSort.sortOrder;
    scope.secondarySort = CaseListFactory.data.caseListSort.secondarySort;
    scope.sortOrderASC = ConstantService.ASCENDING;
    scope.sortOrderDESC = ConstantService.DESCENDING;
    scope.isActiveTab = (scope.sortOrder === ConstantService.ASCENDING);
    CaseListFactory.getConfig(ConstantService.FILTER_PARAM_SORT).then(
      function (result) {
        if (result.error) {
        } else {
          if (result.data) {
            scope.sortData = result.data;
            CaseListFactory.data.caseListSort.sortedByName = scope.filterName;
          }
        }
      }
    );
  };
  scope.fnApplySort = function (sortBy,secondarySort,sortOrder, filterName) {
    scope.filterName = filterName;
    scope.secondarySort=secondarySort;
    if (sortOrder === ConstantService.ASCENDING) {
      scope.isActiveTab = true;
    } else {
      scope.isActiveTab = false;
    }
    CaseListFactory.data.caseListSort.sortedBy = sortBy;
    CaseListFactory.data.caseListSort.sortOrder = sortOrder;
    CaseListFactory.data.caseListSort.sortedByName = scope.filterName;
    CaseListFactory.data.caseListSort.secondarySort = secondarySort;
    var keyToPersist = 'SORT_CASE_LIST';
    var valueToPersist = CaseListFactory.data.caseListSort;
    //Update Persistence
    CaseListFactory.persistPreference(keyToPersist, valueToPersist);
  };

  scope.fnInit();
}]);
