'use strict';
angular.module('saintApp')
  .controller('CaseListBreadcrumb', ['ConstantService','$scope', 'CaseListFactory','DateService', function (ConstantService , scope, CaseListFactory,DateService) {
    scope.breadCrumbs = [];
    scope.caseList = CaseListFactory.data;
    /**
     * @description This watch keeps watching the applied filter and push the content to breadcrumb in proper format,once a new filter is added.
     */
    scope.$watch('caseList.selectedFilters', function (caseListFilters) {
      if (caseListFilters.length > 0) {
        scope.breadCrumbs = [];
        angular.forEach(caseListFilters, function (arrayValue) {
          angular.forEach(arrayValue.contents, function (value) {
            /*
             The below condition checks whether the date is selected to display for the breadcrumbs and formats
             the date string
             */
            if (arrayValue.category === ConstantService.DATE_STRING) {
              var splitDate = arrayValue.contents[0].split(',');
              value = arrayValue.filterName + ' ' + DateService.getFormattedDateStringFromDateObject(new Date(splitDate[0])) +' ' +ConstantService.DATE_STRING_TO+' ' + DateService.getFormattedDateStringFromDateObject(new Date(splitDate[1]));

            }
            var object = {};
            object.filter = value;
            object.filterName = arrayValue.filterName;
            object.dbFilterName = arrayValue.dbFilterName;
            scope.breadCrumbs.push(object);
          });
        });
      } else {
        scope.breadCrumbs = [];
      }
    }, true);
    /**
     *
     * @param filter Filter which is applied or removed.
     * @param categoryName Category of the filter which is applied or removed.
     * @param columnName KEY_NAME of the category
     * @description This function is called each time a filter is applied or removed, it updates the applied filters in the shared variable.
     */
    scope.fnFilterClick = function (filter, categoryName, columnName) {
      var existingFilter = _.findWhere(scope.caseList.selectedFilters, {'filterName': categoryName});
      if (!existingFilter) {
        var newSelectedFilter = {};
        newSelectedFilter.filterName = categoryName;
        newSelectedFilter.contents = [];
        newSelectedFilter.contents.push(filter);
        newSelectedFilter.dbFilterName = columnName;
        scope.caseList.selectedFilters.push(newSelectedFilter);
      } else {
  /*
         The condition below checks whether the columnName is date,so to be spliced.
         */
        var index, tempObj;
        if (existingFilter.category === ConstantService.DATE_STRING) {
          index = CaseListFactory.data.selectedFilters.findIndex(function (existingFilter) {
            return existingFilter.filterName === categoryName;
          });
          tempObj = CaseListFactory.data.selectedFilters[index];
          CaseListFactory.data.selectedFilters.splice(index, 1);
          var checkBoxIndex = CaseListFactory.data.checkedDateBoxes.indexOf(categoryName);
          CaseListFactory.data.checkedDateBoxes.splice(checkBoxIndex, 1);
        }
        else {
          index = CaseListFactory.data.selectedFilters.findIndex(function (existingFilter) {
            return existingFilter.filterName === categoryName;
          });
          tempObj = CaseListFactory.data.selectedFilters[index];
          if (tempObj.contents.indexOf(filter)<0) {
            tempObj.contents.push(filter);
            CaseListFactory.data.selectedFilters.splice(index, 1, tempObj);
          } else {
            var indexTwo = CaseListFactory.data.selectedFilters[index].contents.lastIndexOf(filter);
            CaseListFactory.data.selectedFilters[index].contents.splice(indexTwo, 1);
            if(CaseListFactory.data.selectedFilters[index].filterName===ConstantService.FILTER_DESCRIPTION)//If Description,broadcasting to filter controller.
            {
              scope.$parent.fnRemoveFilters(CaseListFactory.data.selectedFilters[index]);
            }
            if (CaseListFactory.data.selectedFilters[index].contents.length === 0) {
              CaseListFactory.data.selectedFilters.splice(index, 1);
            }
          }
        }
      }
      var keyToPersist = 'FILTER_' + categoryName.replace(' ', '_').toUpperCase();
      var valueToPersist = _.findWhere(CaseListFactory.data.selectedFilters, {'filterName': categoryName});
      //Update Persistence
      CaseListFactory.persistPreference(keyToPersist, valueToPersist);
    };

    /**
     *
     * @returns {boolean} Returns true is any filter is applied.
     * @description Thi function checks if ay filter is applied or not.
     */
    scope.fnCheckClear = function () {
      if (scope.breadCrumbs.length > 0) {
        return true;
      }
      else {
        return false;
      }
    };
    /**
     * @description This filter clear all the applied filters.
     */
    scope.fnClearFilters = function () {
      var keyToPersist = null;
      var valueToPersist = null;
      _.each(CaseListFactory.data.selectedFilters, function(value){
        keyToPersist = 'FILTER_' + value.filterName.replace(' ', '_').toUpperCase();
        CaseListFactory.persistPreference(keyToPersist, valueToPersist);
      });
      scope.caseList.selectedFilters.splice(0, scope.caseList.selectedFilters.length);
      CaseListFactory.data.checkedDateBoxes.splice(0, CaseListFactory.data.checkedDateBoxes.length);
      scope.$parent.fnRemoveFilters();
    };
  }]);
