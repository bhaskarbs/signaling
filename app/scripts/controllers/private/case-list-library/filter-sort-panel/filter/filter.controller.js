'use strict';
angular.module('saintApp').controller('CaseListfilterController', ['$scope', 'CaseListFactory', 'ConstantService', function (scope, CaseListFactory, ConstantService) {

  /**
   * @description This methos is to initialize the variables once the controller is loaded.
   */
  scope.fnInit = function () {
    scope.descriptionText = ConstantService.FILTER_DESCRIPTION;
    scope.placeholder = ConstantService.FILTER_DESCRIPTION_PLACEHOLDER;
    scope.caseListData = CaseListFactory.data;
    scope.enableDateRangeFilter=false;
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
    CaseListFactory.getConfig(ConstantService.FILTER_PARAM_FILTER).then(
      function (result) {
        if (result.error) {
          scope.categoryData = null;
        } else {
          if (result.data) {
            scope.categoryData = result.data;
            var dateRangeEnable=_.findWhere(scope.categoryData, {'filterType':ConstantService.FILTER_DATE_RANGE });
            if(dateRangeEnable)
            {
              scope.enableDateRangeFilter=true;
            }
            scope.$emit(ConstantService.MANAGE_CASE_LIST_SCREEN + '_' + ConstantService.GET_USER_PREFERENCE);
          }
        }
      }
    );

  };

  /***
  Call the category specific data for the filter

  ***/

  scope.fnClickCategory = function(filterName,columnName,index,filterType) {
    var filterObject = {};
    if (columnName && filterType!==ConstantService.FILTER_LIST_KEY_TEXT) {
      scope.columnName = columnName;
      scope.queryParams = {$select: scope.columnName};
      if(filterName==='Periodic Report Type'){
        filterObject = {'RPT_CAT_KEY':[0]};
      }else if(filterName==='Other Report Type'){
        filterObject = {'RPT_CAT_KEY':[1]};
      }
      if (scope.categoryData[index].contents.length <= 0) {
        var payload = {
          data:{
            'count':null,
            'offset':0,
            'descriptions':'',
            'columnsSelected': [],
            'filters': {},
            'sort':{},
            'textSearch':'',
            'datesSelected': {}
        }};
        payload.data.sort[columnName]='asc';
        payload.data.columnsSelected.length = 0;
        payload.data.columnsSelected.push(columnName);
        CaseListFactory.getFilterContent(payload,scope.columnName).then(function (result) {
          if (result.error) {
          }
          else {
            if (result.data) {
              /** Filtering Unique result to avoid duplication*/
              var uniqueContents=_.uniq(result.data.contents, function(content) { return content; });
              /**Removing null values if any from backend data*/
              if(uniqueContents.indexOf(null)!==-1){
                var nullIndex=uniqueContents.indexOf(null);
                uniqueContents.splice(nullIndex,1);
              }
              /**Putting the filter contents inside the its categry*/
              scope.categoryData[index].contents.push(uniqueContents);
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
    var existingFilter = _.findWhere(CaseListFactory.data.selectedFilters, {'filterName': categoryName});
    if (!existingFilter && selectAll !== false) {
      var newSelectedFilter = {};
      newSelectedFilter.filterName = categoryName;
      newSelectedFilter.contents = [];
      newSelectedFilter.contents.push(filter);
      newSelectedFilter.dbFilterName = columnName;
      newSelectedFilter.filterType=filterType;
      CaseListFactory.data.selectedFilters.push(newSelectedFilter);
    } else {
      var objectIndex = CaseListFactory.data.selectedFilters.findIndex(function (existingFilter) {
        return existingFilter.filterName === categoryName;
      });
      if ((CaseListFactory.data.selectedFilters[objectIndex].contents.indexOf(filter) < 0) && (selectAll === true || selectAll === undefined)) {
        CaseListFactory.data.selectedFilters[objectIndex].contents.push(filter);
      } else if ((CaseListFactory.data.selectedFilters[objectIndex].contents.indexOf(filter) >= 0) && (selectAll === false || selectAll === undefined)) {
        var filterIndex = CaseListFactory.data.selectedFilters[objectIndex].contents.lastIndexOf(filter);
        CaseListFactory.data.selectedFilters[objectIndex].contents.splice(filterIndex, 1);
        if (CaseListFactory.data.selectedFilters[objectIndex].contents.length === 0) {
          CaseListFactory.data.selectedFilters.splice(objectIndex, 1);
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
   * @param value A string value
   * @returns {*} A string with removed blank spaces
   * @description This function is used to remove spaces between category names to use it as an id for body of respective filter category panel.
   */
  scope.fnRemoveSpace = function (value) {
    var returnValue = value;
    if (value !== null && value !== undefined) {
      if (value.indexOf(' ') >= 0) {
        returnValue = value.replace(/ /g, '');
      }
    }
    return returnValue;
  };
  /**
   *
   * @param filter Name of the filter checked or unchecked/removed from breadcrumb.
   * @param categoryName Category of the filter.
   * @returns {boolean} Returns true if its added/checked.
   * @description This function is to check wheather a particular filter is applied or not, used to sync between breadcrumb and left panel.
   */
  scope.fnCheckbox = function (filter, categoryName) {
    var existingFilter = _.findWhere(CaseListFactory.data.selectedFilters, {'filterName': categoryName});
    if (!existingFilter) {
      return false;
    } else {
      var index = CaseListFactory.data.selectedFilters.findIndex(function (existingStory) {
        return existingStory.filterName === categoryName;
      });
      if (CaseListFactory.data.selectedFilters[index].contents.indexOf(filter) < 0) {
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
    var filters = scope.caseListData.selectedFilters;
    var index = -1;
    for( var i=0; i <filters.length; i++){
      if(filters[i].filterName === ConstantService.FILTER_DESCRIPTION){
        index = i;
      }
    }
    if (index > -1) {
      scope.caseListData.selectedFilters.splice(index, 1);
    }
    if (item.descSearch) {
      var inputString = item.descSearch.split(' ');
      angular.forEach(inputString, function (value) {
        var changedFilter = _.findWhere(scope.caseListData.selectedFilters, {'filterName': ConstantService.FILTER_DESCRIPTION});
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
    /**In case of select all, Running loop on searchResult instead of whole record*/
    angular.forEach(selectAllCatgoryObj.searchResult, function (filter) {
     /**To avoid null selection in breadcrumb, null check is implementd at UI level to not to render but it can be in the array*/
     if(filter){
      scope.fnFilterClick(filter, selectAllCatgoryObj.filterName, selectAllCatgoryObj.columnName, selectAllCatgoryObj.filterName, selectAllCatgoryObj.filterType,selectAll);
      }
   });
  };
  scope.fnSelectAllbox = function (selectAllCatgoryObj) {
    var existingFilterObj = _.findWhere(CaseListFactory.data.selectedFilters, {'filterName': selectAllCatgoryObj.filterName});
    /**Checking if the filtered object exist or not*/
    if (!existingFilterObj) {
      return false;
    } else {
      var isSelectAll=true;
      /**Getting object of the category from selected filters*/
      var index = CaseListFactory.data.selectedFilters.findIndex(function (existingFilterObj) {
        return existingFilterObj.filterName === selectAllCatgoryObj.filterName;
      });
      if(index>=0){
        /**Getting filter contents of the particular category and assigning it to local variable to avoid binding*/
        var selectedFilters=CaseListFactory.data.selectedFilters[index].contents;
        /**UI searched result will be present in searchResult*/
        var filteredResult=selectAllCatgoryObj.searchResult;
        /**Checking all contents of searchResult is present in selected filters or not*/
        if(filteredResult){
        for(var i=0;i<filteredResult.length;i++){
          /**If any one of the UI search result is not present in selected filters, make selectAll uncheked*/
          if(selectedFilters.indexOf(filteredResult[i])===-1){
            isSelectAll=false;
            break;
          }
        }
        /**If UI search result in zero filters, make selectall unchecked*/
        if(filteredResult.length===0){
          isSelectAll=false;
        }
       }
       else{/**Initial case, when search in UI didn't happen,filteredResult will be undefined */
        isSelectAll=false;
       }
      }
      return isSelectAll; /**The the final value whether to check or uncheck the select All field*/
    }
  };
  scope.fnLoadData = function (selectAllCatgoryObj, selectAll) {
    scope.fnSelectAll(selectAllCatgoryObj, selectAll);
  };
  scope.fnShowSelectAll=function(searchedResults){
    var isSelectAllVisible=true;
    /**If UI search results in no value, hide SelectAll field, If exists and length is zero, Hide it*/
    if(searchedResults){
      if(searchedResults.length){
        isSelectAllVisible= true;
      }
      else{
        isSelectAllVisible= false;
      }
    }else{
      isSelectAllVisible= false;
    }
    return isSelectAllVisible;
  };
  scope.$on('ClearFilters',function(event,filters){
    var textFilter = _.findWhere(scope.categoryData, {'filterName': ConstantService.FILTER_DESCRIPTION});
    if(textFilter)
    {
      for(var k=0;k<scope.categoryData.length;k++)
      { if(filters){
        if(scope.categoryData[k].filterName===filters.filterName){
          if(filters.contents) {
            scope.categoryData[k].descSearch = filters.contents.join(' ');
          }
        }
      }
      else
      {
        scope.categoryData[k].descSearch='';
      }}
    }
  });
  scope.$watch('caseListData.selectedFilters', function (filter) {
    var descString = '';
    if ((filter !== undefined) && (filter.length > 0)) {
      var changedFilter = _.findWhere(filter, {'filterName': ConstantService.FILTER_DESCRIPTION});
      if (!changedFilter) {
        descString = '';
      } else {
        var statusFilter = _.findWhere(filter, {'filterName': ConstantService.FILTER_DESCRIPTION});
        if (statusFilter) {
          descString = statusFilter.contents.join(' ');
        }
      }
      for (var k = 0; k < scope.categoryData.length; k++) {
        if (scope.categoryData[k].filterName === ConstantService.FILTER_DESCRIPTION) {
          scope.categoryData[k].descSearch = descString;
        }
      }
    }
  }, true);
  scope.fnInit();
}]);
