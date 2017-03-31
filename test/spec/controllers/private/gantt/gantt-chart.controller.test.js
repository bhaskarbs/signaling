'use strict';
describe('GanttController Controller', function () {
  var scope, LanguageService, DateService, LoaderService, ConstantService, ReportFactory, UrlService, $timeout, alertService,ctrl,$httpBackend;
    beforeEach(function () {
    module('saintApp');
    inject(function ($injector, $controller, $rootScope) {
      scope = $rootScope.$new();
      LanguageService = $injector.get('LanguageService');
      DateService = $injector.get('DateService');
      LoaderService = $injector.get('loaderService');
      ConstantService = $injector.get('ConstantService');
      ReportFactory = $injector.get('ReportFactory');
      UrlService = $injector.get('UrlService');
      $timeout = $injector.get('$timeout');
      alertService = $injector.get('alertService');
      ctrl = $controller('GanttChartController', {
        $rootScope: $rootScope,
        $scope: scope,
        LanguageService : LanguageService,
        DateService : DateService,
        LoaderService : LoaderService,
        ConstantService : ConstantService,
        ReportFactory : ReportFactory,
        UrlService : UrlService,
        $timeout : $timeout,
        alertService : alertService,
        $httpBackend : $httpBackend
      });
    });
    it('should exist', function () {
      expect(ctrl).toBeDefined();
    });
    it('Should have variables defined in it', function () {
      expect(scope.startDate).toBeDefined();
      expect(scope.endDate).toBeDefined();
      expect(scope.isProgress).toBeDefined();
      expect(scope.oneDayMilliSeconds).toBeDefined();
      expect(scope.reportFactoryData).toBeDefined();
      expect(scope.ganttChartData.dataDisplayed).toBeDefined();
      expect(scope.ganttChartData.dataRetrieved).toBeDefined();
      expect(scope.ganttChartData.chartSpecifications.mode).toBeDefined();
      expect(scope.ganttChartData.chartSpecifications.weekendDays).toBeDefined();
      expect(scope.ganttChartData.chartSpecifications.maxHeight).toBeDefined();
      expect(scope.ganttChartData.chartSpecifications.labelsWidth).toBeDefined();
      expect(scope.ganttChartData.chartSpecifications.firstDay).toBeDefined();
      expect(scope.ganttChartData.chartSpecifications.showWeekends).toBeDefined();
      expect(scope.taskObject.from).toBeNull();
      expect(scope.taskObject.to).toBeNull();
      expect(scope.taskObject.color).toBeNull();
      expect(scope.taskObject.id).toBeNull();
      expect(scope.taskObject.name).toBeNull();
      expect(scope.taskObject.data).toBeNull();
      expect(scope.isActiveView).toBeDefined();
      expect(scope.currActive).toBeDefined();
      expect(scope.setPrevMonth).toBeNull();
      expect(scope.setNextMonth).toBeNull();
    });
    it('Should have Methods defined in it', function () {
      expect(scope.fnGetWeekData).toBeDefined();
      expect(scope.fnPrepareDatesWeek).toBeDefined();
      expect(scope.fnUpdateWeek).toBeDefined();
      expect(scope.fnLoadDefaultDates).toBeDefined();
      expect(scope.fnAddSamples).toBeDefined();
      expect(scope.fnRemoveData).toBeDefined();
      expect(scope.fnClearData).toBeDefined();
      expect(scope.getMilestones).toBeDefined();
      expect(scope.saveMilestones).toBeDefined();
      expect(scope.fnTaskClick).toBeDefined();
      expect(scope.fnCurrentWeek).toBeDefined();
      expect(scope.getSunday).toBeDefined();
      expect(scope.fnCreateReportTasks).toBeDefined();
      expect(scope.fnFormatDataRetrievedToDataDisplayed).toBeDefined();
      expect(scope.fnSetDateRangeString).toBeDefined();
      expect(scope.fnLoadReports).toBeDefined();
      expect(scope.loadNextRows).toBeDefined();
      expect(scope.fnInit).toBeDefined();
      expect(scope.hidePopover).toBeDefined();
      expect(scope.fnLoadMonthView).toBeDefined();
      expect(scope.fnUpdateYears).toBeDefined();
      expect(scope.fnGetYearData).toBeDefined();
      expect(scope.fnGetCurrYear).toBeDefined();
      expect(scope.fnLoadDefaultMonths).toBeDefined();
      expect(scope.fnLoadYearView).toBeDefined();
      expect(scope.fnGanttChartView).toBeDefined();
      expect(scope.fnPersistGanttChartView).toBeDefined();
      expect(scope.fnGetPersistedView).toBeDefined();
      expect(scope.fnSetPersistedView).toBeDefined();
      expect(scope.fnGetCurrMonth).toBeDefined();
    });
    it('Calls persistPreference method from ReportFactory', function(){
      spyOn(ReportFactory, 'persistPreference').and.callThrough();
      scope.fnPersistGanttChartView('month');
      expect(ReportFactory.persistPreference).toHaveBeenCalledWith(ConstantService.GANTT_CHART_VIEW, ConstantService.IS_ACTIVE_VIEW_MONTH, null, 0);
    });
    it('Syncs shared obj with persisted data and calls fnSetPersistedView', function(){
      spyOn(ReportFactory, 'syncSharedObjectWithPersistedData').and.callThrough();
      spyOn(scope, 'fnSetPersistedView').and.callThrough();
      scope.fnGetPersistedView();
      expect(ReportFactory.syncSharedObjectWithPersistedData).toHaveBeenCalled();
      expect(scope.fnSetPersistedView).toHaveBeenCalled();
    });
    var ganttChartViewValues = ['MONTH', 'YEAR', '', null];
    it('Sets the previously persisted gantt chart view', function(){
      spyOn(scope, 'fnLoadYearView').and.callThrough();
      spyOn(scope, 'fnLoadMonthView').and.callThrough();
      scope.reportFactoryData.ganttChartView = ganttChartViewValues[0];//fnLoadMonthView must be fired
      scope.fnSetPersistedView();
      expect(scope.isActiveView).toBe(ConstantService.IS_ACTIVE_VIEW_MONTH);
      expect(scope.currActive).toBe(ConstantService.CURR_WEEK);
      expect(scope.fnLoadMonthView).toHaveBeenCalled();
      scope.reportFactoryData.ganttChartView = ganttChartViewValues[1];//fnLoadYearView must be fired
      scope.fnSetPersistedView();
      expect(scope.isActiveView).toBe(ConstantService.IS_ACTIVE_VIEW_YEAR);
      expect(scope.currActive).toBe(ConstantService.CURR_MONTH);
      expect(scope.fnLoadYearView).toHaveBeenCalled();
      scope.reportFactoryData.ganttChartView = ganttChartViewValues[2];//fnLoadMonthView must be fired
      scope.fnSetPersistedView();
      expect(scope.isActiveView).toBe(ConstantService.IS_ACTIVE_VIEW_MONTH);
      expect(scope.currActive).toBe(ConstantService.CURR_WEEK);
      expect(scope.fnLoadMonthView).toHaveBeenCalled();
      scope.reportFactoryData.ganttChartView = ganttChartViewValues[3];//fnLoadMonthView must be fired
      scope.fnSetPersistedView();
      expect(scope.isActiveView).toBe(ConstantService.IS_ACTIVE_VIEW_MONTH);
      expect(scope.currActive).toBe(ConstantService.CURR_WEEK);
      expect(scope.fnLoadMonthView).toHaveBeenCalled();
    });
    var currYearTest = new Date().getFullYear();
    var currMonthTest = new Date().getMonth();
    var busyCursorEnableValues = [true, false];
    var chartViewValues = ['month', 'year', '', null, 'default'];
    it('Check method fnGanttChartView with different scenarios', function(){
        spyOn(scope, 'fnLoadYearView').and.callThrough();
        spyOn(scope, 'fnLoadMonthView').and.callThrough();
        spyOn(scope, 'fnPersistGanttChartView').and.callThrough();
        //actions when chartView == month
        scope.fnGanttChartView(chartViewValues[0]);
        expect(scope.isActiveView).toBe(ConstantService.IS_ACTIVE_VIEW_MONTH);
        expect(scope.currActive).toBe(ConstantService.CURR_WEEK);
        expect(scope.fnLoadMonthView).toHaveBeenCalled();
        expect(scope.reportFactoryData.ganttChartView).toBe(ConstantService.IS_ACTIVE_VIEW_MONTH.toUpperCase());
        expect(scope.fnPersistGanttChartView).toHaveBeenCalledWith(scope.reportFactoryData.ganttChartView);
        //actions when chartView == year
        scope.fnGanttChartView(chartViewValues[1]);
        expect(scope.isActiveView).toBe(ConstantService.IS_ACTIVE_VIEW_YEAR);
        expect(scope.currActive).toBe(ConstantService.CURR_MONTH);
        expect(scope.fnLoadYearView).toHaveBeenCalled();
        expect(scope.reportFactoryData.ganttChartView).toBe(ConstantService.IS_ACTIVE_VIEW_YEAR.toUpperCase());
        expect(scope.fnPersistGanttChartView).toHaveBeenCalledWith(scope.reportFactoryData.ganttChartView);
        //actions in any other case
        scope.fnGanttChartView(chartViewValues[2]);
        expect(scope.isActiveView).toBe(ConstantService.IS_ACTIVE_VIEW_MONTH);
        expect(scope.currActive).toBe(ConstantService.CURR_WEEK);
        expect(scope.fnLoadMonthView).toHaveBeenCalled();
        expect(scope.reportFactoryData.ganttChartView).toBe(ConstantService.IS_ACTIVE_VIEW_MONTH.toUpperCase());
        expect(scope.fnPersistGanttChartView).toHaveBeenCalledWith(scope.reportFactoryData.ganttChartView);
        scope.fnGanttChartView(chartViewValues[3]);
        expect(scope.isActiveView).toBe(ConstantService.IS_ACTIVE_VIEW_MONTH);
        expect(scope.currActive).toBe(ConstantService.CURR_WEEK);
        expect(scope.fnLoadMonthView).toHaveBeenCalled();
        expect(scope.reportFactoryData.ganttChartView).toBe(ConstantService.IS_ACTIVE_VIEW_MONTH.toUpperCase());
        expect(scope.fnPersistGanttChartView).toHaveBeenCalledWith(scope.reportFactoryData.ganttChartView);
        scope.fnGanttChartView(chartViewValues[4]);
        expect(scope.isActiveView).toBe(ConstantService.IS_ACTIVE_VIEW_MONTH);
        expect(scope.currActive).toBe(ConstantService.CURR_WEEK);
        expect(scope.fnLoadMonthView).toHaveBeenCalled();
        expect(scope.reportFactoryData.ganttChartView).toBe(ConstantService.IS_ACTIVE_VIEW_MONTH.toUpperCase());
        expect(scope.fnPersistGanttChartView).toHaveBeenCalledWith(scope.reportFactoryData.ganttChartView);
    });
    it('Check if fnLoadYearView invokes proper functions', function(){
      spyOn(scope, 'fnGetYearData').and.callThrough();
      scope.fnLoadYearView();
      expect(scope.fnGetYearData).toHaveBeenCalled();
    });
    it('Check fnLoadDefaultMonths to see if proper default dates are set', function(){
       spyOn(scope, 'fnSetDateRangeString').and.callThrough();
       scope.fnLoadDefaultMonths();
       expect(scope.startDate).toEqual(new Date(currYearTest, currMonthTest - 2, 1));
       expect(scope.endDate).toEqual(new Date(currYearTest, currMonthTest + 8, 0));
       expect(scope.fnSetDateRangeString).toHaveBeenCalled();
       expect(scope.setPrevMonth).toBe(currMonthTest - 2);
       expect(scope.setNextMonth).toBe(currMonthTest + 7);
    });
    it('Check if fnGetCurrYear returns current year', function(){
       var yearReturned = scope.fnGetCurrYear();
       expect(yearReturned).toBe(2016);
    });
    it('Checks if fnGetCurrMonth returns current month', function(){
      var monthReturned = scope.fnGetCurrMonth();
      expect(monthReturned).toBe(currMonthTest);
    });
    var updateCountValues = [1, -1, 0]; //only 1, -1 are the expected values
    it('Checks fnGetYearData with various scenarios', function(){
       spyOn(scope, 'fnClearData').and.callThrough();
       spyOn(scope, 'fnUpdateYears').and.callThrough();
       spyOn(scope, 'fnLoadReports').and.callThrough();
       spyOn(scope, 'fnRemoveData').and.callThrough();
       //for any value of updateCountValue the same behavior will be observed
       scope.fnGetYearData(updateCountValues[0],busyCursorEnableValues[0]);
       expect(scope.isProgress).toBeTruthy();
       expect(scope.fnRemoveData).toHaveBeenCalledWith(scope.ganttChartData.dataDisplayed);
       expect(scope.fnClearData).toHaveBeenCalled();
       expect(scope.fnUpdateYears).toHaveBeenCalledWith(updateCountValues[0]);
       expect(scope.fnLoadReports).toHaveBeenCalled();
    });
    it('Checks method fnUpdateYears with different scenarios', function(){
       spyOn(scope,'fnSetDateRangeString').and.callThrough();
       spyOn(scope, 'fnLoadDefaultMonths').and.callThrough();
       scope.setPrevMonth = 2;
       scope.setNextMonth =  11;
       scope.fnUpdateYears(updateCountValues[0]);
       expect(scope.setPrevMonth).toBe(3);
       expect(scope.setNextMonth).toBe(12);
       expect(scope.fnSetDateRangeString).toHaveBeenCalled();
        scope.setPrevMonth = 2;
        scope.setNextMonth =  11;
       scope.fnUpdateYears(updateCountValues[1]);
       expect(scope.setPrevMonth).toBe(1);
       expect(scope.setNextMonth).toBe(10);
       scope.fnUpdateYears(updateCountValues[2]);
       expect(scope.fnLoadDefaultMonths).toHaveBeenCalled();
    });
    it('Call the method fnLoadMonthView()', function(){
          spyOn(scope, 'fnGetWeekData').and.callThrough();
          scope.fnLoadMonthView();
          expect(scope.fnGetWeekData).toHaveBeenCalledWith(0,true,false);
    });
    it('should call the method fnInit()', function() {
      scope.fnInit();});
    it('should call the method fnGetWeekData(updateWeek, evaluateDates)', function() {
      scope.fnGetWeekData(0,true);});
    it('should call the method fnPrepareDatesWeek(updateWeekCount, isDatesNeedToEvaluate)', function() {
      scope.fnPrepareDatesWeek(1,true);});
    it('should call the method fnUpdateWeek(date, noOfWeeks)', function() {
        scope.fnUpdateWeek(scope.startDate,0);});
    it('should call the method fnLoadDefaultDates()', function() {
        scope.fnLoadDefaultDates();});
    it('should call the method fnAddSamples()', function() {
        scope.fnAddSamples();});
    it('should call the method fnRemoveData(object)', function() {
        scope.fnRemoveData(scope.ganttChartData.dataDisplayed);});
    it('should call the method fnClearData()', function() {scope.fnClearData();});
    it('should call the method fnTaskClick(event)', function() {
        scope.ganttChartData.dataDisplayed = [];
        scope.ganttChartData.dataDisplayed = scope.ganttChartData.dataRetrieved.map(function (report, reportIndex) {
          var tempDescription = (report.reportDesc === null) ? null : report.reportDesc.substr(0, 30);
          var ganttRowObject = {
            'name': report.reportName,
            'description': tempDescription,
            'tasks': [],
            'id': report.reportId,
            'order': reportIndex,
            'data': report
          };
          scope.fnTaskClick(ganttRowObject.element.click());
        });
        });
    it('should call the method fnCurrentWeek(dateObj)', function() {
        scope.fnCurrentWeek(new Date());});
    it('should call the method getSunday()', function() {
        scope.getSunday();});
    it('should call the method fnCreateReportTasks(tempGanttRowObject, tempReport, isPeriodic)', function() {
        scope.ganttChartData.dataDisplayed = [];
        scope.ganttChartData.dataDisplayed = scope.ganttChartData.dataRetrieved.map(function (report, reportIndex) {
          var tempDescription = (report.reportDesc === null) ? null : report.reportDesc.substr(0, 30);
          var ganttRowObject = {
            'name': report.reportName,
            'description': tempDescription,
            'tasks': [],
            'id': report.reportId,
            'order': reportIndex,
            'data': report
          };
          scope.fnCreateReportTasks(ganttRowObject, report, ReportFactory.isReportPeriodic(report));
        });
      });
    it('should call the method fnFormatDataRetrievedToDataDisplayed()', function() {
        scope.fnFormatDataRetrievedToDataDisplayed();});
    it('should call the method fnSetDateRangeString()', function() {
        scope.fnSetDateRangeString();});
    it('should call the method fnSetDateRangeString()', function() {
      scope.loadNextRows();});
    it('should call the method fnLoadReports()', function() {
        scope.fnLoadReports();});
  });
});


