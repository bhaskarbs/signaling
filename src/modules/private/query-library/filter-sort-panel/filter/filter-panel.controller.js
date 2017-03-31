'use strict';
angular.module('saintApp').controller('QueryLibraryFilterController', ['$scope', 'QueryFactory', 'ConstantService', function (scope, QueryFactory, ConstantService) {

  /**
   * @description This methos is to initialize the variables once the controller is loaded.
   */
  scope.fnInit = function () {
    scope.descriptionText = ConstantService.FILTER_DESCRIPTION;
    scope.placeholder = ConstantService.FILTER_DESCRIPTION_PLACEHOLDER;
    scope.queryData = QueryFactory.data;
    scope.categoryData = [
      {
        'filterName': null,
        'active': null,
        'configKey': null,
        'filterType': null,
        'searchActive': null,
        'contentUrl': null,
        'contents': [],
        'toggle': false
      }
    ];
    //TODO This initialization should be moved to parent controller
    if (scope.queryData.filterCategoryData.length > 0) {//Data is already fetched so reuse
      scope.categoryData = scope.queryData.filterCategoryData;
      scope.$emit(ConstantService.MANAGE_QUERY_LIBRARY_SCREEN + '_' + ConstantService.GET_USER_PREFERENCE);
    } else {
      QueryFactory.getConfig(ConstantService.FILTER_PARAM_FILTER).then(
        function (result) {
          if (result.error) {
            scope.categoryData = null;
          } else {
            if (result.data) {
              scope.categoryData = result.data;
              scope.$emit(ConstantService.MANAGE_QUERY_LIBRARY_SCREEN + '_' + ConstantService.GET_USER_PREFERENCE);
            }
          }
        }
      );
    }
  };

  scope.fnClickCategory = function (filterName, columnName, index , filterType) {
    if (columnName && filterType!==ConstantService.FILTER_LIST_KEY_TEXT) {
      scope.columnName = columnName;
      scope.queryParams = '&$select='+ scope.columnName;
      if (scope.categoryData[index].contents.length <= 0) {
        QueryFactory.getFilterContent(scope.queryParams, scope.columnName).then(function (result) {
          if (result.error) {
          }
          else {
            if (result.data.contents) {
              scope.categoryData[index].contents.push(result.data.contents);
            }
          }
        });
      }
    }
  };
  /**
   *
   * @param filter Name of the filter applied or removed.
   * @param categoryName Name of the category the filter(added/removed) belongs to.
   * @param columnName KEY_NAME of the particular category
   * @description This function is called each time when a filter is applied or removed either from left panel or breadcrumbs.
   */
  scope.fnFilterClick = function (filter, categoryName, columnName, category, filterType,selectAll) {
    var existingFilter = _.findWhere(QueryFactory.data.selectedFilters, {'filterName': categoryName});
    if (!existingFilter && selectAll !== false) {
      var newSelectedFilter = {};
      newSelectedFilter.filterName = categoryName;
      newSelectedFilter.contents = [];
      newSelectedFilter.contents.push(filter);
      newSelectedFilter.dbFilterName = columnName;
      newSelectedFilter.filterType=filterType;
      QueryFactory.data.selectedFilters.push(newSelectedFilter);
    } else {
      var objectIndex = QueryFactory.data.selectedFilters.findIndex(function (existingFilter) {
        return existingFilter.filterName === categoryName;
      });
      if ((QueryFactory.data.selectedFilters[objectIndex].contents.indexOf(filter) < 0) && (selectAll === true || selectAll === undefined)) {
        QueryFactory.data.selectedFilters[objectIndex].contents.push(filter);
      } else if ((QueryFactory.data.selectedFilters[objectIndex].contents.indexOf(filter) >= 0) && (selectAll === false || selectAll === undefined)) {
        var filterIndex = QueryFactory.data.selectedFilters[objectIndex].contents.lastIndexOf(filter);
        QueryFactory.data.selectedFilters[objectIndex].contents.splice(filterIndex, 1);
        if (QueryFactory.data.selectedFilters[objectIndex].contents.length === 0) {
          QueryFactory.data.selectedFilters.splice(objectIndex, 1);
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
   * @param filter Name of the filter checked or unchecked/removed from breadcrumb.
   * @param categoryName Category of the filter.
   * @returns {boolean} Returns true if its added/checked.
   * @description This function is to check wheather a particular filter is applied or not, used to sync between breadcrumb and left panel.
   */
  scope.fnCheckbox = function (filter, categoryName) {
    var existingFilter = _.findWhere(QueryFactory.data.selectedFilters, {'filterName': categoryName});
    if (!existingFilter) {
      return false;
    } else {
      var index = QueryFactory.data.selectedFilters.findIndex(function (existingStory) {
        return existingStory.filterName === categoryName;
      });
      if (QueryFactory.data.selectedFilters[index].contents.indexOf(filter) < 0) {
        return false;
      } else {
        return true;
      }
    }
  };
  /**
   *
   * @param val String value searched in text box of description section
   * @description This function apllies the description filter.
   */
  scope.fnFindSearchString = function (item) {
    var filters = scope.queryData.selectedFilters;
    var index = -1;
    for( var i=0; i <filters.length; i++){
      if(filters[i].filterType === ConstantService.FILTER_LIST_KEY_TEXT){
        if(item.filterName===filters[i].filterName)
        {
          index=i;
        }
      }
    }
    if (index > -1) {
      scope.queryData.selectedFilters.splice(index, 1);
    }
    if (item.descSearch) {
      var inputString = item.descSearch.split(' ');
      angular.forEach(inputString, function (value) {
        var changedFilter = _.findWhere(scope.queryData.selectedFilters, {'filterName':item.filterName});
        if (changedFilter) {
          if (changedFilter.contents.indexOf(value) >= 0) {
            return;
          }
        }
        if(value) {
          scope.fnFilterClick(value, item.filterName, item.columnName, item.filterName, item.filterType);
        }
      });
    }
  };
  scope.fnSelectAll = function (selectAllCatgoryObj, selectAll) {
    angular.forEach(selectAllCatgoryObj.contents[0], function (filter) {
      scope.fnFilterClick(filter, selectAllCatgoryObj.filterName, selectAllCatgoryObj.columnName, selectAllCatgoryObj.filterName, selectAll);
    });
  };
  scope.fnSelectAllbox = function (selectAllCatgoryObj) {
    var existingFilterObj = _.findWhere(QueryFactory.data.selectedFilters, {'filterName': selectAllCatgoryObj.filterName});
    if (!existingFilterObj) {
      var val = scope.onRefresh ? true : false;
      scope.onRefresh = false;
      return val;
    } else {
      var index = QueryFactory.data.selectedFilters.findIndex(function (existingFilterObj) {
        return existingFilterObj.filterName === selectAllCatgoryObj.filterName;
      });
      if (QueryFactory.data.selectedFilters[index].contents.length === selectAllCatgoryObj.contents[0].length) {
        return true;
      } else {
        return false;
      }
    }
  };
  scope.fnLoadData = function (selectAllCatgoryObj, selectAll) {
    scope.fnSelectAll(selectAllCatgoryObj, selectAll);
  };
  scope.$on('ClearFilters', function (event, filters) {//this function is to check if clear all filters or description filter clearing
    var textFilter = _.findWhere(scope.categoryData, {'filterType': ConstantService.FILTER_LIST_KEY_TEXT});
    if (textFilter) {
      for (var k = 0; k < scope.categoryData.length; k++) {
        if (filters){
          if (scope.categoryData[k].filterType === ConstantService.FILTER_LIST_KEY_TEXT && scope.categoryData[k].filterName === filters.filterName) {
            if (filters.contents){
              scope.categoryData[k].descSearch = filters.contents.join(' ');
            }}
          }
        else
        {
          scope.categoryData[k].descSearch='';
        }
    }}
  });
  scope.$watch('queryData.selectedFilters', function (filter) {
    var descString = '';
    var queryNameStr = '';
    var queryIndex = null;
    var descIndex = null;
    if ((filter !== undefined) && (filter.length > 0)) {
      var changedFilter = _.findWhere(filter, {'filterType': ConstantService.FILTER_LIST_KEY_TEXT});
      for (var k = 0; k < scope.categoryData.length; k++) {
        if (scope.categoryData[k].filterType === ConstantService.FILTER_LIST_KEY_TEXT && scope.categoryData[k].columnName === ConstantService.FILTER_QUERY_NAME_COLUMN) {
          queryIndex = k;
        }
        else if (scope.categoryData[k].filterType === ConstantService.FILTER_LIST_KEY_TEXT && scope.categoryData[k].columnName === ConstantService.FILTER_DESCRIPTION_TEXT) {
          descIndex = k;
        }
      }
      if (changedFilter) {
        for (var m = 0; m < filter.length; m++) {
          if (filter[m].dbFilterName === ConstantService.FILTER_QUERY_NAME_COLUMN) {
            queryNameStr = filter[m].contents.join(' ');
            scope.categoryData[queryIndex].descSearch = queryNameStr;
          }
          else if (filter[m].dbFilterName === ConstantService.FILTER_DESCRIPTION_TEXT) {
            descString = filter[m].contents.join(' ');
            scope.categoryData[descIndex].descSearch = descString;
          }
        }
      }
    }
  }, true);
  scope.fnInit();
}]);
