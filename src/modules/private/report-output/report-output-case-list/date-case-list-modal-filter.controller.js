'use strict';
angular.module('saintApp')
  .controller('CaseListModalDateFilterController', ['$scope', 'UrlService', 'ReportOutputFactory', 'ConstantService', function (scope, urlService, ReportOutputFactory, ConstantService) {
    scope.dateList = [];
    scope.searchReportStartDate = null;
    scope.searchReportEndDate = null;
    scope.dateString = null;
    scope.collapsePanelDate = false;
    scope.reportData = ReportOutputFactory.data;
    scope.itemDate = null;
    scope.fnStartEndDate = function (newDate, type) {
      if (newDate) {
        if (!type) {
          scope.searchReportStartDate = (newDate.toJSON());
          scope.dateString = '';
          scope.dateString = scope.searchReportStartDate + ',' + scope.searchReportEndDate;
          if (scope.searchReportEndDate) {
            scope.fnUpdateDates();
          }
        }
        else {
          scope.searchReportEndDate = (newDate.toJSON());
          scope.dateString = '';
          scope.dateString = scope.searchReportStartDate + ',' + scope.searchReportEndDate;
          if (scope.searchReportStartDate) {
            scope.fnUpdateDates();
          }
        }
      }
      scope.fnFromDatePicker(scope.itemDate);
    };

    scope.fnFromDatePicker = function (item) {
      scope.itemDate = item;
      if (scope.searchReportStartDate !== null && scope.searchReportEndDate !== null) {
        scope.fnFilterClickLogic();
      }


    };
    scope.getdateList = function () {
      scope.dateList.push(
        {
          'name': 'Reporting Period End Date',
          'columnName': 'RPT_END_DATE',
          'category': 'date'
        },

        {
          'name': 'Created Date',
          'columnName': 'Audit_CreatedDt',
          'category': 'date'
        }
      );
    };
    scope.fnOnDateSelected = function (item) {
      scope.itemDate = item;
      //if this is a check event ,ie the user has checked the box
      if (!(_.findWhere(ReportOutputFactory.data.selectedFilters, {'filterName': item.name}))) {
        //add this to the list of boxes which are checked if its not already there
        if(ReportOutputFactory.data.checkedDateBoxes.indexOf(item.name)<0) {
          ReportOutputFactory.data.checkedDateBoxes.push(item.name);
        }
        //if the dates are defined , then add this checked event to the filter list
        if (scope.searchReportStartDate !== null && scope.searchReportEndDate !== null) {
          scope.dateString = scope.searchReportStartDate + ',' + scope.searchReportEndDate;
          scope.fnFilterClickLogic();
        }
      } else
      //if this is an uncheck event ,ie the user has unchecked the box
      {
        //delete the dateBoxName from checkedDateBoxes and also from selectedFilters
        var deleteIndex = ReportOutputFactory.data.checkedDateBoxes.indexOf(item.name);
        ReportOutputFactory.data.checkedDateBoxes.splice(deleteIndex,1);
        scope.fnFilterClickLogic();
      }
    };

    scope.fnDateCheckbox = function (item) {
      return scope.fnCheckboxLogic(scope.dateString, item.name);
    };


    scope.fnInit = function () {
      scope.getdateList();

    };

    scope.fnUpdateDates = function () {
      angular.forEach(scope.dateList, function (dateListObj) {
        var existingDate = _.findWhere(ReportOutputFactory.data.selectedFilters, {'filterName': dateListObj.name});
        if (existingDate) {
          var index = ReportOutputFactory.data.selectedFilters.findIndex(function (existingDate) {
            return existingDate.filterName === dateListObj.name;
          });
          ReportOutputFactory.data.selectedFilters[index].contents.pop();
          ReportOutputFactory.data.selectedFilters[index].contents.push(scope.dateString);
        }
      });

    };


    scope.fnFilterClickLogic = function () {
      //iterate through the list of available date checkboxes and apply the filter if its present in checkedDateBoxes
      angular.forEach(scope.dateList, function (checkBoxList) {
        var existingStory = _.findWhere(ReportOutputFactory.data.selectedFilters, {'filterName': checkBoxList.name});
        if (ReportOutputFactory.data.checkedDateBoxes.indexOf(checkBoxList.name) >= 0 && !existingStory) {

          var newSelectedFilter = {};
          newSelectedFilter.filterName = checkBoxList.name;
          newSelectedFilter.contents = [];
          newSelectedFilter.contents.push(scope.dateString);
          newSelectedFilter.dbFilterName = checkBoxList.columnName;
          newSelectedFilter.category = ConstantService.DATE_STRING;//Filter Name to be changed for the date filter
          ReportOutputFactory.data.selectedFilters.push(newSelectedFilter);
        }
        else if (existingStory && ReportOutputFactory.data.checkedDateBoxes.indexOf(checkBoxList.name) < 0){
          var index = ReportOutputFactory.data.selectedFilters.findIndex(function (existingStory) {
            return existingStory.filterName === checkBoxList.name;
          });

          var indexTwo = ReportOutputFactory.data.selectedFilters[index].contents.lastIndexOf(scope.dateString);
          ReportOutputFactory.data.selectedFilters[index].contents.splice(indexTwo, 1);
          if (ReportOutputFactory.data.selectedFilters[index].contents.length === 0) {
            ReportOutputFactory.data.selectedFilters.splice(index, 1);
          }
        }
        var keyToPersist = 'FILTER_' + checkBoxList.name.replace(' ', '_').toUpperCase();
        var valueToPersist = _.findWhere(ReportOutputFactory.data.selectedFilters, {'filterName': checkBoxList.name});
        //Update Persistence
        ReportOutputFactory.persistPreference(keyToPersist, valueToPersist);
      });
    };

    scope.fnCheckboxLogic = function (filter, categoryName) {
      var existingStory = _.findWhere(ReportOutputFactory.data.selectedFilters, {'filterName': categoryName});
      if (!existingStory) {
        return false;
      } else {
        return true;
      }
    };
    scope.fnEnableDatepicker=function(id)
    {
      angular.element(id).datepicker('show');
    };

/*    scope.fnIsAnyBoxChecked = function(){
      if(ReportOutputFactory.data.checkedDateBoxes.length>0)
        return true;
      else{
        scope.searchReportStartDate = '19-Sep-1987';
        scope.searchReportEndDate = null;
        return false;
      }
    }*/

    scope.fnInit();
  }]);
