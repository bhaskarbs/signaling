'use strict';
angular.module('saintApp')
  .controller('DateFilterController', ['$scope', 'UrlService', 'ReportFactory', 'ConstantService', function (scope, urlService, ReportFactory, ConstantService) {
    scope.dateList = [];
    scope.searchDates={
      searchReportStartDate:null,
      searchReportEndDate:null
    };
    scope.dateString = null;
    scope.collapsePanelDate = false;
    scope.reportData = ReportFactory.data;
    scope.itemDate = null;
    scope.fnStartEndDate = function (newDate, type) {
      if (newDate) {
        if (!type) {
          scope.searchDates.searchReportStartDate = (newDate.toJSON());
          scope.dateString = '';
          scope.dateString = scope.searchDates.searchReportStartDate + ',' + scope.searchDates.searchReportEndDate;
          if (scope.searchDates.searchReportEndDate) {
            scope.fnUpdateDates();
          }
        }
        else {
          scope.searchDates.searchReportEndDate = (newDate.toJSON());
          scope.dateString = '';
          scope.dateString = scope.searchDates.searchReportStartDate + ',' + scope.searchDates.searchReportEndDate;
          if (scope.searchDates.searchReportStartDate) {
            scope.fnUpdateDates();
          }
        }
      }
      scope.fnFromDatePicker(scope.itemDate);
    };

    scope.fnFromDatePicker = function (item) {
      scope.itemDate = item;
      if (scope.searchDates.searchReportStartDate !== null && scope.searchDates.searchReportEndDate !== null) {
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
          'name': 'Report Due Date',
          'columnName': 'SUBMISSION_DUE_DATE',
          'category': 'date'
        },

        {
          'name': 'Submitted Date',
          'columnName': 'SUBMITTED_DATE',
          'category': 'date'
        },
        {
          'name': 'Report Run Date',
          'columnName': 'RUN_DATE',
          'category': 'date'
        }
      );
    };
    scope.fnOnDateSelected = function (item) {
      scope.itemDate = item;

      //if this is a check event ,ie the user has checked the box
      if (!(_.findWhere(ReportFactory.data.selectedFilters, {'filterName': item.name}))) {
        //add this to the list of boxes which are checked if its not already there
        if(ReportFactory.data.checkedDateBoxes.indexOf(item.name)<0){
          ReportFactory.data.checkedDateBoxes.push(item.name);
        }
        //if the dates are defined , then add this checked event to the filter list
        if (scope.searchDates.searchReportStartDate !== null && scope.searchDates.searchReportEndDate !== null) {
          scope.dateString = scope.searchDates.searchReportStartDate + ',' + scope.searchDates.searchReportEndDate;
          scope.fnFilterClickLogic();
        }
      } else

      //if this is an uncheck event ,ie the user has unchecked the box
      {
        //delete the dateBoxName from checkedDateBoxes and also from selectedFilters
        var deleteIndex = ReportFactory.data.checkedDateBoxes.indexOf(item.name);
        ReportFactory.data.checkedDateBoxes.splice(deleteIndex,1);
        scope.fnFilterClickLogic();
      }
    };

    scope.fnDateCheckbox = function (item) {
      return scope.fnCheckboxLogic(scope.dateString, item.name);
    };

    scope.$watch('reportData.selectedFilters', function (filter) {
      if ((filter !== undefined) && (filter.length > 0)) {
        var changedDate = _.findWhere(filter, {'category': 'date'});
        if (!changedDate) {
          scope.searchDates.searchReportStartDate=null;
          scope.searchDates.searchReportEndDate=null;
        }
      }
      else
      {
        scope.searchDates.searchReportStartDate=null;
        scope.searchDates.searchReportEndDate=null;
      }
    },true);
    scope.fnInit = function () {
      scope.getdateList();

    };

    scope.fnUpdateDates = function () {
      angular.forEach(scope.dateList, function (dateListObj) {
        var existingDate = _.findWhere(ReportFactory.data.selectedFilters, {'filterName': dateListObj.name});
        if (existingDate) {
          var index = ReportFactory.data.selectedFilters.findIndex(function (existingDate) {
            return existingDate.filterName === dateListObj.name;
          });
          ReportFactory.data.selectedFilters[index].contents.pop();
          ReportFactory.data.selectedFilters[index].contents.push(scope.dateString);
        }
      });

    };


    scope.fnFilterClickLogic = function () {
      //iterate through the list of available date checkboxes and apply the filter if its present in checkedDateBoxes
      angular.forEach(scope.dateList, function (checkBoxList) {
        var existingStory = _.findWhere(ReportFactory.data.selectedFilters, {'filterName': checkBoxList.name});
        if (ReportFactory.data.checkedDateBoxes.indexOf(checkBoxList.name) >= 0 && !existingStory) {

          var newSelectedFilter = {};
          newSelectedFilter.filterName = checkBoxList.name;
          newSelectedFilter.contents = [];
          newSelectedFilter.contents.push(scope.dateString);
          newSelectedFilter.dbFilterName = checkBoxList.columnName;
          newSelectedFilter.category = ConstantService.DATE_STRING;//Filter Name to be changed for the date filter
          ReportFactory.data.selectedFilters.push(newSelectedFilter);
        }
        else if (existingStory && ReportFactory.data.checkedDateBoxes.indexOf(checkBoxList.name) < 0){
          var index = ReportFactory.data.selectedFilters.findIndex(function (existingStory) {
            return existingStory.filterName === checkBoxList.name;
          });

          var indexTwo = ReportFactory.data.selectedFilters[index].contents.lastIndexOf(scope.dateString);
          ReportFactory.data.selectedFilters[index].contents.splice(indexTwo, 1);
          if (ReportFactory.data.selectedFilters[index].contents.length === 0) {
            ReportFactory.data.selectedFilters.splice(index, 1);
          }
        }
        var keyToPersist = 'FILTER_' + checkBoxList.name.replace(' ', '_').toUpperCase();
        var valueToPersist = _.findWhere(ReportFactory.data.selectedFilters, {'filterName': checkBoxList.name});
        //Update Persistence
        ReportFactory.persistPreference(keyToPersist, valueToPersist);
      });
    };
    scope.fnCheckboxLogic = function (filter, categoryName) {
      var existingStory = _.findWhere(ReportFactory.data.selectedFilters, {'filterName': categoryName});
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

    scope.fnInit();
  }]);
