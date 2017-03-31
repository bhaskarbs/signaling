'use strict';

angular.module('saintApp').controller('FilterController', ['$scope', 'ReportFactory', 'ConstantService', function (scope, ReportFactory, ConstantService) {
  scope.descriptionText = ConstantService.FILTER_DESCRIPTION;
  scope.reportData = ReportFactory.data;
  scope.enableDateRangeFilter=false;
  scope.fnInit = function () {
    scope.categoryData = [
      {
        'filterName': null,
        'active': null,
        'configKey': null,
        'filterType': null,
        'searchActive': null,
        'contentUrl': null,
        'contents': [],
        'toggle': false,
        'category': null
      }
    ];

    //TODO This initialization should be moved to parent controller
      ReportFactory.getFilterConfig(ConstantService.FILTER_PARAM_FILTER).then(
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
              scope.$emit(ConstantService.MANAGE_REPORTS_SCREEN + '_' + ConstantService.GET_USER_PREFERENCE);
            }
          }
        }
      );

  };
  scope.fnClickCategory = function (filterName,columnName, index,filterType) {
    if (columnName && filterType!==ConstantService.FILTER_LIST_KEY_TEXT) {
      scope.columnName = columnName;
      scope.queryParams = {$select: scope.columnName};
      if(filterName==='Periodic Report Type'){
        scope.queryParams.$filter = 'RPT_CAT_KEY eq 0';
      }else if(filterName==='Other Report Type'){
        scope.queryParams.$filter = 'RPT_CAT_KEY ne 0';
      }
      if (scope.categoryData[index].contents.length <= 0) {
        ReportFactory.getFilterContent(scope.queryParams, scope.columnName).then(function (result) {
          if (result.error) {
          }
          else {
            if (result.data.contents) {
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
  scope.fnFilterClick = function (filter, categoryName, columnName, category, filterType,selectAll) {
    var existingStory = _.findWhere(ReportFactory.data.selectedFilters, {'filterName': categoryName});
    if (!existingStory && selectAll !== false) {
      var newSelectedFilter = {};
      newSelectedFilter.filterName = categoryName;
      newSelectedFilter.contents = [];
      newSelectedFilter.contents.push(filter);
      newSelectedFilter.dbFilterName = columnName;
      newSelectedFilter.category = category;
      newSelectedFilter.filterType=filterType;
      ReportFactory.data.selectedFilters.push(newSelectedFilter);
    } else {
      var index = ReportFactory.data.selectedFilters.findIndex(function (existingStory) {
        return existingStory.filterName === categoryName;
      });
      if ((ReportFactory.data.selectedFilters[index].contents.indexOf(filter)<0) && (selectAll === true || selectAll === undefined)) {
        ReportFactory.data.selectedFilters[index].contents.push(filter);
      } else if ((ReportFactory.data.selectedFilters[index].contents.indexOf(filter)>=0) && (selectAll === false || selectAll === undefined)) {
        var indexTwo = ReportFactory.data.selectedFilters[index].contents.lastIndexOf(filter);
        ReportFactory.data.selectedFilters[index].contents.splice(indexTwo, 1);
        if (ReportFactory.data.selectedFilters[index].contents.length === 0) {
          ReportFactory.data.selectedFilters.splice(index, 1);
        }
      }
    }

    var keyToPersist = 'FILTER_' + categoryName.replace(' ', '_').toUpperCase();
    var valueToPersist = _.findWhere(ReportFactory.data.selectedFilters, {'filterName': categoryName});
    //Update Persistence
    ReportFactory.persistPreference(keyToPersist, valueToPersist);
  };

  scope.fnRemoveSpace = function (value) {
    var returnValue = value;
    if (value !== null && value !== undefined) {
      if (value.indexOf(' ')>=0) {
        returnValue = value.replace(/ /g, '');
      }
    }
    return returnValue;
  };
  scope.fnCheckbox = function (filter, categoryName) {
    var existingStory = _.findWhere(ReportFactory.data.selectedFilters, {'filterName': categoryName});
    if (!existingStory) {
      return false;
    } else {
      var index = ReportFactory.data.selectedFilters.findIndex(function (existingStory) {
        return existingStory.filterName === categoryName;
      });
      if (ReportFactory.data.selectedFilters[index].contents.indexOf(filter)<0) {
        return false;
      } else {
        return true;
      }
    }
  };
  scope.fnFindSearchString = function (item) {
    var filters = ReportFactory.data.selectedFilters;
    var index = -1;
    for( var i=0; i <filters.length; i++){
      if(filters[i].filterName === ConstantService.FILTER_DESCRIPTION)//TODO:Have to change to filter type when backend service changes
       {
        index = i;
      }
    }
    if (index > -1) {
      ReportFactory.data.selectedFilters.splice(index, 1);
    }
    if(item.descSearch){
      var inputString = item.descSearch.split(' ');
      angular.forEach(inputString, function (value) {
        if(value) {
          scope.fnFilterClick(value, item.filterName,item.columnName,item.filterName,item.filterType);
        }
      });
    }
    scope.fnHandleKey = function(event){
      if(event.keyCode === 13){
        console.log(event);
      }
    };
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
    var existingFilterObj = _.findWhere(ReportFactory.data.selectedFilters, {'filterName': selectAllCatgoryObj.filterName});
    /**Checking if the filtered object exist or not*/
    if (!existingFilterObj) {
      return false;
    } else {
      var isSelectAll=true;
      /**Getting object of the category from selected filters*/
      var index = ReportFactory.data.selectedFilters.findIndex(function (existingFilterObj) {
        return existingFilterObj.filterName === selectAllCatgoryObj.filterName;
      });
      if(index>=0){
        /**Getting filter contents of the particular category and assigning it to local variable to avoid binding*/
        var selectedFilters=ReportFactory.data.selectedFilters[index].contents;
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
  /**
  This function continuously watch for filtered result in filter category and checks selectall if applicable
  */
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
  scope.$watch('reportData.selectedFilters', function (filter) {
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
