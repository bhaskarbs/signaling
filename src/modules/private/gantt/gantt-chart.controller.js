'use strict';
angular.module('saintApp')
  .controller('GanttChartController', ['$scope', 'LanguageService', 'DateService', 'loaderService', 'ConstantService', 'ReportFactory', 'UrlService', '$timeout', 'alertService','UserService','$state', function (scope, LanguageService, DateService, LoaderService, ConstantService, ReportFactory, UrlService, $timeout, alertService, UserService,$state) {
    scope.isActiveView = ConstantService.IS_ACTIVE_VIEW_MONTH;/*isActiveView is the currently active view of the gantt chart. It can be month or year.*/
    scope.currActive = ConstantService.CURR_WEEK;
    scope.setPrevMonth = null; /** setPrevMonth, setNextMonth are used to set proper forward and backward navigation in year view **/
    scope.setNextMonth = null;
    scope.ganttUrlArray = [];
    scope.startDate = null;
    scope.endDate = null;
    scope.maxReports=10;
    scope.renderedData=[];
    scope.totalRecords=0;
    scope.currentRecordsCount=0;
    scope.isProgress = true;
    scope.oneDayMilliSeconds = 86400000;
    scope.milestonePayload=[];
    scope.reportFactoryData = ReportFactory.data;
    scope.ganttChartData = {
      dataDisplayed: [],
      dataRetrieved: [],
      chartSpecifications: {
        'mode': 'custom',
        'weekendDays': [],
        'maxHeight': 400,
        'labelsWidth': 300,
        'firstDay': 1,
        'showWeekends': true,
        'calenderRangeString': ''
      }
    };

    scope.taskObject = {from: null, to: null, color: null, id: null, name: null, data: null};//For milestone keep both the from and to same values

    /******************************************year view of gantt chart code******************************************************/
    /* @uthored by: bhdwivedi
     /* persisting gantt chart view selection
     */
    scope.fnPersistGanttChartView = function(view)
    {
      ReportFactory.persistPreference(ConstantService.GANTT_CHART_VIEW, view, null, 0);//0 means not session based
    };

    scope.fnSetPersistedView = function()
    {
      if(scope.reportFactoryData.ganttChartView && scope.reportFactoryData.ganttChartView.toUpperCase() === 'YEAR'){
        scope.isActiveView = ConstantService.IS_ACTIVE_VIEW_YEAR;
        scope.currActive = ConstantService.CURR_MONTH;
        scope.fnLoadYearView();}
      else {//if view === month/null, month view will be rendered
        scope.isActiveView = ConstantService.IS_ACTIVE_VIEW_MONTH;
        scope.currActive = ConstantService.CURR_WEEK;
        scope.fnPrepareDatesWeek(0, true);
      }
    };

    /*gantt chart view selection*/
    scope.fnGanttChartView = function (chartView) {
      if (chartView === ConstantService.IS_ACTIVE_VIEW_YEAR) {
        scope.isActiveView = ConstantService.IS_ACTIVE_VIEW_YEAR;
        scope.currActive = ConstantService.CURR_MONTH;
        scope.fnLoadYearView();
      }
      else {
        scope.isActiveView = ConstantService.IS_ACTIVE_VIEW_MONTH;
        scope.currActive = ConstantService.CURR_WEEK;
        scope.fnLoadMonthView();
      }
      scope.reportFactoryData.ganttChartView = scope.isActiveView.toUpperCase();
      scope.fnPersistGanttChartView(scope.reportFactoryData.ganttChartView);
    };

    scope.fnLoadYearView = function()
    {
      scope.fnGetYearData();
    };

    /**This function handles gantt year view for previous and next years**/
    scope.fnGetYearData = function (updateCount, busyCursorEnable){
      $('.gantt-scrollable').scrollLeft(0);
      if(busyCursorEnable)
      {
        scope.isProgress=true;
      }
      scope.fnRemoveData(scope.ganttChartData.dataDisplayed);
      scope.fnClearData();
      scope.fnUpdateYears(updateCount);
      scope.fnLoadReports();
    };

    scope.fnGetCurrMonth = function()
    { var retMonth = new Date().getMonth();
      return retMonth; };

    scope.fnGetCurrYear = function ()
    {
      var retYear = new Date().getFullYear();
      return retYear;
    };

    /** navigation to previous and next months**/
    /* navigation changed to month wise after review*/
    scope.fnUpdateYears = function(updateCount){
      var currYear = scope.fnGetCurrYear();
      if(updateCount === 1 || updateCount === -1)
      {
        scope.setPrevMonth = scope.setPrevMonth + updateCount;
        scope.setNextMonth = scope.setNextMonth + updateCount;
        scope.startDate = new Date(currYear, scope.setPrevMonth, 1);
        if(updateCount === 1)
        {scope.endDate = new Date(currYear, scope.setNextMonth + updateCount, 0);}
        else if (updateCount === -1)
        {scope.endDate = new Date(currYear, scope.setNextMonth - updateCount, 0);}
        scope.fnSetDateRangeString();
      }
      else{ scope.fnLoadDefaultMonths(); }
    };

    /**This function loads default date range for year view - 10 months should be shown in year view,
     ** 2 months before the current month, and 7 months after the current month
     ** Gantt heading should reflect the range displayed on the gantt in dd-mmm-yyyy - dd-mmm-yyyy format*/
    scope.fnLoadDefaultMonths = function () {
      var currDate = new Date();
      var currMonth = scope.fnGetCurrMonth();
      //set date range according to current month and date
      scope.startDate = new Date(currDate.getFullYear(), currDate.getMonth()- ConstantService.PREV_FEW, 1); //ConstantService.PREV_FEW = 2 : two months before the current month
      scope.endDate = new Date(currDate.getFullYear(), currDate.getMonth()+ ConstantService.NEXT_FEW + 1, 0); //ConstantService.NEXT_FEW = 7 : seven months after the current month; plus current month
      scope.fnSetDateRangeString();
      /*reset setPrevYear and setNextYear to current year on returning to default view*/
      scope.setPrevMonth = currMonth - ConstantService.PREV_FEW;
      scope.setNextMonth = currMonth + ConstantService.NEXT_FEW;
    };

    /*************************************************end of year view of gantt chart code****************************************/


    /*******************************************month view of gantt chart code******************************************************/
    scope.fnLoadMonthView = function()
    {
      scope.fnGetWeekData(0,true,false);
    };
    /*******************************************end of month view of gantt chart code******************************************************/


    /******************************** Start of Previous, Current and Next navigation code ********************************/
    scope.fnGetWeekData = function (updateWeek, evaluateDates, busyCursorEnable) {
      $('.gantt-scrollable').scrollLeft(0);
      $('.gantt-scrollable').scrollTop(0);
      $('#ganttWindow').scrollTop(0);
      if (busyCursorEnable) {
        scope.isProgress = true;
      }
      scope.ganttChartData.dataRetrieved = [];
      scope.fnRemoveData(scope.ganttChartData.dataDisplayed);
      scope.fnClearData();
      scope.fnPrepareDatesWeek(updateWeek, evaluateDates);
      scope.fnLoadReports();
    };

    scope.fnAlignColumns = function (startIndex, endIndex, initial) {
      $timeout(function () {
        for (var i = startIndex; i < endIndex; i++) {
          var leftRowHeight = $('#ganttLeftRow' + i).outerHeight(true) / parseFloat($('body').css('font-size'));
          leftRowHeight = leftRowHeight + 'em';
          $('#ganttBackgroundRow' + i).css({'height': leftRowHeight});
          $('#ganttRightRow' + i).css({'height': leftRowHeight});
          if (initial) {
            $('#ganttScroll').scrollTop($('#ganttScroll').scrollTop() + 1);
          }
        }
      }, 10, false);

    };
    /**
     *
     * @param updateWeekCount is the numer of week counts to be adjusted in making gantt view
     * @param isDatesNeedToEvaluate is the boolean which tells wheather to evaluate date or not
     */
    scope.fnPrepareDatesWeek = function (updateWeekCount, isDatesNeedToEvaluate) {
      if (isDatesNeedToEvaluate) {
        if (!(updateWeekCount && !isNaN(updateWeekCount) && updateWeekCount !== 0)) {
          scope.fnLoadDefaultDates();
        } else {
          scope.startDate = new Date(scope.fnUpdateWeek(scope.startDate, updateWeekCount));
          scope.endDate = new Date(scope.fnUpdateWeek(scope.endDate, updateWeekCount));
        }
        scope.fnSetDateRangeString();
      }
    };
    /**
     *
     * @param date is the date in miliseconds
     * @param noOfWeeks is the count of weeks which needs to be added or removed.
     */
    scope.fnUpdateWeek = function (date, noOfWeeks) {
      return new Date(date).setDate(new Date(date).getDate() + noOfWeeks);
    };
    /**
     * This function is to load the default dates which is currently 7 weeks before current week and 7 week after current week
     * 2-1-7  total 10 weeks window
     */
    scope.fnLoadDefaultDates = function () {
      scope.startDate = new Date(new Date().setTime(new Date(scope.getSunday()).getTime() - 2 * 7 * scope.oneDayMilliSeconds));
      scope.endDate = new Date(new Date().setTime(new Date(scope.getSunday()).getTime() + ((8 * 7 - 1) * scope.oneDayMilliSeconds)));
    };
    /******************************** End of Previous, Current and Next navigation code ********************************/

    /******************************** Start of values passed to gantt directive ********************************/
    /**
     *
     * @param callEvent indicated wheather its initial loading of chart or its called as a result of user action of scrolling down(lazy loading)
     * 0 indicates that its beig called by initial loading
     * 1 indicates that its the case of Lazy Loading
     */
    scope.fnAddSamples = function (callEvent) {
      var i,j;
      //checking if its lazy loading ation or initialiation action
      if (callEvent === 0) {
        var initialData = [];
        var object = {};
        /**Dummy object to render the columns on chart properly*/
        object.from = scope.startDate.getTime();
        /**getting the date in milisecond of the start date of Gantt char window(7-1-2, weeks)*/
        object.to = scope.endDate.getTime();
        /**getting the date in milisecond of the end date of Gantt char window(7-1-2, weeks)*/
        object.id = 'ColumnInitializer';
        for (i = 0; i < scope.currentRecordsCount; i++) {
          if (i === 0 || (i === scope.currentRecordsCount - 1)) {
            scope.ganttChartData.dataDisplayed[i].tasks.push(object);
            /**Preventing the blank line appearance on chart if no row is there for a report*/
          }

          initialData.push(scope.ganttChartData.dataDisplayed[i]);
        }
        scope.renderedData = angular.copy(initialData);
        /**Putting the initial data to the chart*/
      } else if (callEvent === 1) {
        for (j = 0; j < scope.currentRecordsCount; j++) {
          scope.renderedData.push(scope.ganttChartData.dataDisplayed[j]);
          /**In case of lazy loading, pushing data in the already rendered records*/
        }
      }
      scope.isProgress = false;   /**Disabling inner busy cursor*/
    };
    /**
     *
     * @param object is the object to be removed from chart ,
     * This function is reference to Angular Gantt function
     */
    scope.fnRemoveData = function (object) {
      try {
        object = [];
        scope.removeData();
      } catch (e) {
      }
    };
    /**
     * Reference to Angular Gantt plugin
     */
    scope.fnClearData = function () {
      try {
        scope.clearData();
      } catch (e) {
      }
    };
    /**
     *
     * @param event task event on the chart
     * @param jqueryEvent is the jquery event triggered by user acion.
     * This function is triggered when user clicks on milestone flag.
     */
    scope.getMilestones = function (event, jqueryEvent) {
      if (event.row.data.milestoneDetailsFetched) {
        scope.milestoneUsersAssignment(event);
      }
      else {
        LoaderService.start();
        ReportFactory.getMilestoneAssignedUsers(event.row.data.reportKey).then(function (result) {
         LoaderService.stop();
          var milestones=event.row.data.milestones;
          for(var i=0;i<milestones.length;i++)
          {
            for(var j=0;j<result.data.length;j++)
            {
              if(result.data[j].milestoneKey===milestones[i].milestoneKey)
              {
                event.row.data.milestones[i].assignedUserGroups=result.data[j].assignedUserGroups;
                event.row.data.milestones[i].assignedUsers=result.data[j].assignedUsers;
                break;
              }
                }
          }
          scope.milestoneUsersAssignment(event);
          event.row.data.milestoneDetailsFetched=true;
        });
      }
     scope.fnOpenPopover(event,jqueryEvent);
    };
/*
This function is to open the milestone popover.
 */
    scope.fnOpenPopover=function(event,jqueryEvent){
      $('.dsui-milestone-popover').hide();
      var w = $(window);
      var left = jqueryEvent.pageX;
      var top = jqueryEvent.pageY;
      $('.dropdown-menu').css({
        'left': function () {
          return (left - 30) + 'px';
        },
        'top': function () {
          return (top + 10 - w.scrollTop()) + 'px';
        }
      });
      $('#milestone-popover' + event.id).show();
      jqueryEvent.stopPropagation();
      jqueryEvent.preventDefault();
    };
    /*
    This function gets the milestone assigned users and usergroups from backend
     */
    scope.milestoneUsersAssignment=function(event){
      scope.userId = parseInt(UserService.data.oUser.userId);
      scope.groupId= UserService.data.oUser.groupKey;
      var tempMilestones = angular.copy(event.row.data.milestones);
      event.data.tempMilestoneStatus = [];//temporary milestone status
      event.data.selectedMilestones = [];// list of milesones on selected date
      event.data.enableMilestoneUserCheckbox=[];
      event.data.enableMilestoneUserGroupCheckbox=[];
      var tempMilestonesLength = tempMilestones.length;
      if (event.data.isPeriodic) {
        var uniqueDates = [];
        /**
         * Below is the logic to club the milestones falling on same day
         * */
        for (var k in event.data.aggregatedMilestones) {
          if (uniqueDates.indexOf(event.data.aggregatedMilestones[k].toString()) === -1) {
            uniqueDates.push(event.data.aggregatedMilestones[k].toString());
          }
        }
        var uniqueDateLength = uniqueDates.length;
        for (var i = 0; i < uniqueDateLength; i++) {
          for (var j = 0; j < tempMilestonesLength; j++) {//if it is a periodic report,multiple dates will be in different places
            if (uniqueDates[i] === tempMilestones[j].reportMilestoneDate.toString()) {
              event.data.tempMilestoneStatus.push(tempMilestones[j].milestoneStatus === 1 ? true : false);
              event.data.selectedMilestones.push(tempMilestones[j]);
              event.data.enableMilestoneUserCheckbox[j]=false;
              event.data.enableMilestoneUserGroupCheckbox[j]=false;
              for (var l = 0; l < tempMilestones[j].assignedUsers.length; l++) {
                if(tempMilestones[j].assignedUsers[l].userKey===scope.userId)
                {
                  event.data.enableMilestoneUserCheckbox[j]=true;
                }
              }
              for (var q = 0; q < tempMilestones[j].assignedUserGroups.length; q++) {
                if(scope.groupId.indexOf(JSON.stringify(tempMilestones[j].assignedUserGroups[q].roleId))>-1)
                {
                  event.data.enableMilestoneUserGroupCheckbox[j]=true;
                }}
            }
          }
        }
      }
      else {
        for (var m = 0; m < tempMilestonesLength; m++) {//if it is a Non-Periodic report,multiple dates will be in same place
          event.data.tempMilestoneStatus.push(tempMilestones[m].milestoneStatus === 1 ? true : false);
          event.data.selectedMilestones.push(tempMilestones[m]);
          event.data.enableMilestoneUserCheckbox[m]=false;
          event.data.enableMilestoneUserGroupCheckbox[m]=false;
          for (var n = 0; n < tempMilestones[m].assignedUsers.length; n++) {
            if(tempMilestones[m].assignedUsers[n].userKey===scope.userId)
            {
              event.data.enableMilestoneUserCheckbox[m]=true;
            }
            else
            {
              event.data.enableMilestoneUserCheckbox[m]=false;
            }
          }
          for (var p = 0; p < tempMilestones[m].assignedUserGroups.length; p++) {
            if(scope.groupId.indexOf(JSON.stringify(tempMilestones[m].assignedUserGroups[p].roleId))>-1)
            {
              event.data.enableMilestoneUserGroupCheckbox[m]=true;
            }
            else
            {
              event.data.enableMilestoneUserGroupCheckbox[m]=false;
            }
          }
        }
      }
    };
    /**
     *
     * @param event having tasks when user successfully completes a milestone.
     */
    scope.saveMilestones = function () {
      scope.isProgress=true;
      ReportFactory.saveMilestoneGanttChart(scope.milestonePayload).then(function () {
        alertService.success(LanguageService.MESSAGES.MILESTONE_SAVED_SUCCESS);
        if(scope.isActiveView === ConstantService.IS_ACTIVE_VIEW_YEAR) {scope.fnLoadYearView();}
        else{
          scope.fnGetWeekData(0, false,true);/*refreshing the page once data retrieved*/}
      });
    };
    /**
     *
     * @param validating the entered milestones.
     */
    scope.getPayload = function (event) {
      var payload = ReportFactory.getPayloadForMilestoneSaveGanttChart(event.data.selectedMilestones, event.data.tempMilestoneStatus);//getting the payload to send it to backend
      if (payload) {
        scope.milestonePayload = payload;
        angular.element('#milestone-modal').modal({backdrop: 'static', keyboard: false});
      }
      else {
        alertService.warn(LanguageService.MESSAGES.FAILED_TO_SAVE_MILESTONE_DETAILS_GANTT_CHART);
      }
    };
    /**
     *
     * @param index - unique index of milestones.
     */
    scope.fnCloseDatepicker = function (id) {
      angular.element(id).datepicker('show');//Enabling the date picker
    };
    //This is click handler for the bar
    scope.fnTaskClick = function (event) {
      if (event) {
        if (!event.task.isMilestonePresent) {//if milestone is not clicked , then the gantt bar is clicked
          var domId = event.task.id;
          var reportKey = domId.substring(domId.lastIndexOf('t') + 1, domId.lastIndexOf('id')); //FIXME move to constant
          if (scope.showFilterPanel) {
            scope.fnPersistReportPanelState(ConstantService.HIDDEN);
          }
          else {
            scope.fnPersistReportPanelState(ConstantService.EXPANDED);
          }
          scope.navigateToReportById(reportKey,$state.current.name);
        }
      }
    };

    /******************************** End of values passed to gantt directive ********************************/
    /******************************** End of Overwriting the internal functions of gantt ********************************/
    scope.fnCurrentWeek = function (dateObj) {
      var startDate = scope.getSunday(new Date());
      var endDate = new Date(new Date(startDate).setDate(new Date(startDate).getDate() + 6));
      if (startDate <= dateObj.date && dateObj.date <= endDate) {
        return true;
      } else {
        return false;
      }
    };
    scope.getSunday = function () {
      var d = new Date();
      var day = d.getDay(), diff = d.getDate() - day; // adjust when day is sunday
      return new Date(d.setDate(diff));
    };
    /******************************** End of Overwriting the internal functions of gantt ********************************/
    /**
     *
     * @param tempGanttRowObject is the object which is pushed to render the chart once all tasks has been created
     * @param tempReport is the report for which tasks are to be created
     * @param isPeriodic is the boolean variable which indicates wheather the report is periodic or not
     */
    scope.fnCreateReportTasks = function (tempGanttRowObject, tempReport, isPeriodic) {
      //XXX Always give from and to in milliseconds for report task, and for milestones give from and to in Date Object
      var tempTaskObject = angular.copy(scope.taskObject);
      if (!isPeriodic) {
        ReportFactory.createNonPeriodicTasks(tempReport, ConstantService.GRAPH_GRAY_COLOR, tempGanttRowObject, tempTaskObject, scope.oneDayMilliSeconds, scope.startDate, scope.endDate);
      } else {
        ReportFactory.createPeriodicTasks(tempReport, tempTaskObject, tempGanttRowObject, scope.startDate, scope.endDate);
      }
    };
    /**
     * This function is to format the retrived data in understandable format for HTML to render on browser.
     */
    scope.fnFormatDataRetrievedToDataDisplayed = function () {
      scope.ganttChartData.dataDisplayed = [];
      scope.ganttChartData.dataDisplayed = scope.ganttChartData.dataRetrieved.map(function (report, reportIndex) {
        var tempDescription = (report.reportDesc === null) ? null : report.reportDesc.substr(0, 30);
        var ganttRowObject = {
          'name': report.reportCustomName,
          'description': tempDescription,
          'tasks': [],
          'id': report.reportId,
          'order': reportIndex,
          'data': report
        };
        scope.fnCreateReportTasks(ganttRowObject, report, ReportFactory.isReportPeriodic(report));
        return ganttRowObject;
      });
      ReportFactory.clearNullObjects(scope.ganttChartData.dataDisplayed);
    };

    scope.fnSetDateRangeString = function () {
      scope.ganttChartData.chartSpecifications.calenderRangeString = DateService.getFormattedDateStringFromDateObject(scope.startDate) + '  -  ' + DateService.getFormattedDateStringFromDateObject(scope.endDate);
    };
    /**
     * This function is to hide the popover if user clicks on any row.
     */
    scope.rowClicked = function () {
      $('.dsui-milestone-popover').hide();
    };
    /**
     *
     * @param e is jquery event when user clicks on milestone when the milestone window is open
     */
    scope.fnClosePopover = function (e) {
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }
    };
    /**
     * This functionality is to hide the milestone popover.
     */
    scope.hidePopover = function () {
      $('.dsui-milestone-popover').hide();
    };
    /**
     * This watcher watches any change in the filters and reloads the charts based on new data.
     */
    scope.$on(ConstantService.MANAGE_REPORTS_SCREEN + '_INIT_WATCHERS', function () {
      scope.$watch('reportFactoryData.selectedFilters', function () {
        if(ReportFactory.data.watchInitialization){
        if (scope.isActiveView === ConstantService.IS_ACTIVE_VIEW_YEAR ) {
          scope.fnLoadYearView();
        }
        else {
          scope.fnGetWeekData(0, true, false);
        }}
      }, true);
      /**
       * This watcher watches any change in the sorting criteria and reloads the charts based on new data.
       */
      scope.$watch('reportFactoryData.reportSort', function (object) {
        if (object.sortedBy && object.sortOrder && ReportFactory.data.watchInitialization) {
          if (scope.isActiveView === ConstantService.IS_ACTIVE_VIEW_YEAR) {
            scope.fnLoadYearView();
          }
          else {
            scope.fnGetWeekData(0, true, false);
          }
        }
      }, true);
    });
    /**
     * Main function which retrieves the data from factory
     */
    scope.fnLoadReports = function () {
      var payload = ReportFactory.generateOdataQueryParameters(scope.reportFactoryData.selectedFilters, scope.reportFactoryData.reportSort, 10, 0);
      var url = UrlService.getService('REPORT_TILE_LIBRARY');
      LoaderService.start();
      ReportFactory.getGantChartData(url,payload).then(function (result) {
        LoaderService.stop();
        if (!result.hasOwnProperty('error')) {
          scope.ganttChartData.dataRetrieved = result.data;     //limited data retrived in one call
          scope.totalRecords = result.count;                      //total count of records in backend
          scope.currentRecordsCount = result.data.length;         //number of data retrived in the particular call
          scope.ganttUrlArray = [];
          scope.fnFormatDataRetrievedToDataDisplayed();
          scope.fnAddSamples(0);
          scope.fnAlignColumns(0, 10, false);
        }
      }); /*no error function is associated with .then because we assume some result will always be returned*/
    };
    /**
     * Initializing the Gantt Chart
     */
    scope.fnInit = function () {
      //Indicating that state has changed within Reports Library
      scope.$broadcast(ConstantService.MANAGE_REPORTS_SCREEN + '_INIT_WATCHERS');
      /**Initializing Gantt chart.
       * fnGetWeekData(param1,param2,param3)-> param1 indicates the days to evaluate ,which is to be rendered on the chart
       *                                       param2 is to indicate wheather we need to evaluate dates or not
       *                                       param3 indicates wheather to load inner busy cursor or not. (its true only when user clicks next,previous or current month)
       */
      scope.fnSetPersistedView();
    };
    /**
     * This function triggers as a part of lazy loading, When user scrolls to the bottom of the rendered chart
     */
    scope.loadNextRows = function () {
      /*Hiding the popover in case of loading new rows*/
      scope.hidePopover();
      /** Preventing call to load next rows in case if maxReports(10 at a time) is greater than actual datas in coming from backend.
       * scope.totalRecords -> Is the total number of records in DB.
       * scope.maxReports -> Is the maximum number of records we want to load at a time.
       * scope.renderedData -> Is the row data already rendered on the graph.
       * */
      if (scope.totalRecords > scope.maxReports && scope.renderedData.length < scope.totalRecords) {
        var payload = ReportFactory.generateOdataQueryParameters(scope.reportFactoryData.selectedFilters, scope.reportFactoryData.reportSort, 10, scope.renderedData.length);
        var url = UrlService.getService('REPORT_TILE_LIBRARY');
        if (scope.ganttUrlArray.indexOf(scope.renderedData.length) === -1) {
          //Enabling the inner busy cursor
          //Getting the next 10 rows
          LoaderService.start();
          ReportFactory.getGantChartData(url,payload).then(function (result) {
            LoaderService.stop();
            if (!result.hasOwnProperty('error')) {
              scope.ganttChartData.dataRetrieved = result.data;
              scope.totalRecords = result.count;
              scope.currentRecordsCount = result.data.length;
              scope.fnFormatDataRetrievedToDataDisplayed();
              scope.fnAlignColumns(scope.renderedData.length, scope.renderedData.length + 10, true);
              scope.fnAddSamples(1);
            }
          });
          scope.ganttUrlArray.push(scope.renderedData.length);
        }
      }
    };

    scope.fnInit();
    /**
     * This event trigers when all bars are rendered on the chart . Its functionality is to make inner cursor stop and bring current week to center
     */
    var ngRepeatEvent = scope.$on('ngRepeatFinished', function () {
      scope.isProgress = false;
    });
    ngRepeatEvent();
    /* This ensures that new reports are properly inserted in the active gantt view*/
    scope.$on('RefreshGanttRows', function () {
      if(scope.isActiveView === ConstantService.IS_ACTIVE_VIEW_MONTH){
        scope.fnGetWeekData(0, true, true);}
      else{
        scope.fnGetYearData(0,true);
      }
    }, true);
    scope.$on('$destroy', function () {
      ngRepeatEvent();
      scope.fnTaskClick();
      scope.rowClicked();
      scope.fnClosePopover();
    });
  }
  ]);

