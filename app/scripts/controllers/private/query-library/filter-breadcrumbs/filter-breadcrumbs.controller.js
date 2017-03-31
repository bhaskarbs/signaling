'use strict';
angular.module('saintApp')
  .controller('QueryLibraryBreadcrumb', ['ConstantService', '$scope', 'QueryFactory', 'DateService', function (ConstantService, scope, QueryFactory, DateService) {
    scope.breadCrumbs = [];
    scope.query = QueryFactory.data;
    /**
     * @description This watch keeps watching the applied filter and push the content to breadcrumb in proper format,once a new filter is added.
     */
    scope.$watch('query.selectedFilters', function (queryFilters) {
      scope.breadCrumbs = [];
      if (queryFilters.length > 0) {
        angular.forEach(queryFilters, function (arrayValue) {
          angular.forEach(arrayValue.contents, function (value) {
            /*
             The below condition checks whether the date is selected to display for the breadcrumbs and formats
             the date string
             */
            if (arrayValue.category === ConstantService.DATE_STRING) {
              var splitDate = arrayValue.contents[0].split(',');
              value = arrayValue.filterName + ' ' + DateService.getFormattedDateStringFromDateObject(new Date(splitDate[0])) + ' ' + ConstantService.DATE_STRING_TO + ' ' + DateService.getFormattedDateStringFromDateObject(new Date(splitDate[1]));

            }
            var object = {};
            object.filter = value;
            object.filterName = arrayValue.filterName;
            object.dbFilterName = arrayValue.dbFilterName;
            scope.breadCrumbs.push(object);
          });
        });
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
      var existingFilter = _.findWhere(scope.query.selectedFilters, {'filterName': categoryName});
      if (!existingFilter) {
        var newSelectedFilter = {};
        newSelectedFilter.filterName = categoryName;
        newSelectedFilter.contents = [];
        newSelectedFilter.contents.push(filter);
        newSelectedFilter.dbFilterName = columnName;
        scope.query.selectedFilters.push(newSelectedFilter);
      } else {
        /*
         The condition below checks whether the columnName is date,so to be spliced.
         */
        var index, tempObj;
        if (existingFilter.category === ConstantService.DATE_STRING) {
          index = QueryFactory.data.selectedFilters.findIndex(function (existingFilter) {
            return existingFilter.filterName === categoryName;
          });
          tempObj = QueryFactory.data.selectedFilters[index];
          QueryFactory.data.selectedFilters.splice(index, 1);
        }
        else {
          index = QueryFactory.data.selectedFilters.findIndex(function (existingFilter) {
            return existingFilter.filterName === categoryName;
          });
          tempObj = QueryFactory.data.selectedFilters[index];
          if (tempObj.contents.indexOf(filter) < 0) {
            tempObj.contents.push(filter);
            QueryFactory.data.selectedFilters.splice(index, 1, tempObj);
          } else {
            var indexTwo = QueryFactory.data.selectedFilters[index].contents.lastIndexOf(filter);
            QueryFactory.data.selectedFilters[index].contents.splice(indexTwo, 1);
            if(QueryFactory.data.selectedFilters[index].filterType===ConstantService.FILTER_LIST_KEY_TEXT)
            {
              scope.$parent.fnRemoveFilters(QueryFactory.data.selectedFilters[index]);
            }
            if (QueryFactory.data.selectedFilters[index].contents.length === 0) {
              QueryFactory.data.selectedFilters.splice(index, 1);
            }
          }
        }
      }
      var keyToPersist = 'FILTER_' + categoryName.replace(' ', '_').toUpperCase();
      var valueToPersist = _.findWhere(QueryFactory.data.selectedFilters, {'filterName': categoryName});
      //Update Persistence
      QueryFactory.persistPreference(keyToPersist, valueToPersist);
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
      _.each(QueryFactory.data.selectedFilters, function (value) {
        keyToPersist = 'FILTER_' + value.filterName.replace(' ', '_').toUpperCase();
        QueryFactory.persistPreference(keyToPersist, valueToPersist);
      });
      scope.query.selectedFilters.splice(0, scope.query.selectedFilters.length);
      scope.$parent.fnRemoveFilters();
    };
  }]);
