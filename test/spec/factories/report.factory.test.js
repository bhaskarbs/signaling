'use strict';
/* FIXME: Veer/Manu is working on this */
describe('ReportFactory Service', function () {
  var ReportFactory, ReportTypeEntity, reportServiceData, $httpBackend, $http, $q, UrlService, alertService, LanguageService;
  beforeEach(function () {
    module('saint-config');
    module('saintApp', ['UrlServiceProvider', 'Environment', function (UrlServiceProvider, Environment) {
      UrlServiceProvider.setOptions({'useFixture': false, 'Environment': Environment});
    }]);
    inject(function ($injector) {
      ReportFactory = $injector.get('ReportFactory');
      reportServiceData = ReportFactory.data;
      ReportTypeEntity = $injector.get('ReportTypeEntity');
      $http = $injector.get('$http');
      $httpBackend = $injector.get('$httpBackend');
      $q = $injector.get('$q');
      UrlService = $injector.get('UrlService');
      alertService = $injector.get('alertService');
      LanguageService = $injector.get('LanguageService');
    });
    jasmine.getJSONFixtures().fixturesPath = 'base/test/spec/fixtures';
    $httpBackend.whenGET('i18n/resources-locale_en-US.js').respond({});
    $httpBackend.whenGET('i18n/resources-locale_en-us.js').respond({});
    $httpBackend.whenGET('i18n/resources-locale_en-IN.js').respond({});
  });
  var isAngularPromise = function (value) {
    if (typeof value.then !== 'function') {
      return false;
    }
    var promiseThenSrc = String($q.defer().promise.then);
    var valueThenSrc = String(value.then);
    return promiseThenSrc === valueThenSrc;
  };
  it('should exists', function () {
    expect(ReportFactory).toBeDefined();
  });
  it('should have dependencies', function () {
    expect(ReportTypeEntity).toBeDefined();
    expect($http).toBeDefined();
    expect($q).toBeDefined();
    expect(UrlService).toBeDefined();
    expect(alertService).toBeDefined();
    expect(LanguageService).toBeDefined();
  });
  it('should have objects', function () {
    expect(reportServiceData).toBeDefined();
    expect(reportServiceData.list).toBeDefined();
    expect(reportServiceData.checkedDateBoxes).toBeDefined();
    expect(reportServiceData.reportNames).toBeDefined();
    expect(reportServiceData.reportStatus).toBeDefined();
    expect(reportServiceData.reportTypes).toBeDefined();
    expect(reportServiceData.reportTiles).toBeDefined();
    expect(reportServiceData.reportDetails).toBeDefined();
    expect(reportServiceData.filteredReports).toBeDefined();
    expect(reportServiceData.reportTypeList).toBeDefined();
    expect(reportServiceData.favouriteList).toBeDefined();
    expect(reportServiceData.statusList).toBeDefined();
    expect(reportServiceData.operationalTypes).toBeDefined();
    expect(reportServiceData.selectedDetailReportIndex).toBeDefined();
    expect(reportServiceData.filterConfig).toBeDefined();
    expect(reportServiceData.persistedData).toBeDefined();
    expect(reportServiceData.selectedFilters).toBeDefined();
    expect(reportServiceData.selectedTileId).toBeDefined();
    expect(reportServiceData.reportSort).toBeDefined();
    expect(reportServiceData.reportPanelState).toBeDefined();
    expect(reportServiceData.filterPanelState).toBeDefined();
    expect(reportServiceData.reportPanelDetails).toBeDefined();
    expect(reportServiceData.selectedGanttBarID).toBeDefined();
    expect(reportServiceData.ganttChartView).toBeDefined();
    expect(Object.keys(reportServiceData).length).toEqual(24);
  });
  it('should have these functions', function () {
    expect(ReportFactory.getReports).toBeDefined();
    expect(ReportFactory.deleteReport).toBeDefined();
    expect(ReportFactory.extractFilterObject).toBeDefined();
    expect(ReportFactory.persistPreference).toBeDefined();
    expect(ReportFactory.syncSharedObjectWithPersistedData).toBeDefined();
    expect(ReportFactory.updateReportStatus).toBeDefined();
    expect(ReportFactory.updateReportMode).toBeDefined();
    expect(ReportFactory.addFinaltoInprogressComments).toBeDefined();
    expect(ReportFactory.fnGeneratePayloadForStatusUpdate).toBeDefined();
    expect(ReportFactory.fnGeneratePayloadForModeUpdate).toBeDefined();
    expect(ReportFactory.fnmilestoneUpdate).toBeDefined();
    expect(ReportFactory.getReportInformation).toBeDefined();
    expect(ReportFactory.mapToEntityDetails).toBeDefined();
    expect(ReportFactory.formatTileToEntity).toBeDefined();
    expect(ReportFactory.getReports).toBeDefined();
    expect(ReportFactory.getTileReports).toBeDefined();
    expect(ReportFactory.getFilterConfig).toBeDefined();
    expect(ReportFactory.getFilterContent).toBeDefined();
    expect(ReportFactory.getTileReportsCount).toBeDefined();
    expect(ReportFactory.fnSaveCreatedReport).toBeDefined();
    expect(ReportFactory.fnSaveEditedReport).toBeDefined();
    expect(ReportFactory.getReportTypes).toBeDefined();
    expect(ReportFactory.updateReportTypes).toBeDefined();

    expect(ReportFactory.fnGenerateReport).toBeDefined();
    expect(ReportFactory.getMasterReportStatus).toBeDefined();
    expect(ReportFactory.getWorkspaceReportCounts).toBeDefined();
    expect(ReportFactory.getGantChartData).toBeDefined();
    expect(ReportFactory.getPayloadForMilestoneSaveGanttChart).toBeDefined();
    expect(ReportFactory.saveMilestoneGanttChart).toBeDefined();
    expect(ReportFactory.generateOdataQueryParameters).toBeDefined();
    expect(ReportFactory.getComparatorPeriodData).toBeDefined();
    expect(ReportFactory.getStatusColorObject).toBeDefined();
    expect(ReportFactory.getMileStoneColor).toBeDefined();
    expect(ReportFactory.createMileStoneTask).toBeDefined();
    expect(ReportFactory.createNonPeriodicTasks).toBeDefined();
    expect(ReportFactory.isReportPeriodic).toBeDefined();
    expect(ReportFactory.isMilestoneEarlier).toBeDefined();
    expect(ReportFactory.isMilestoneLater).toBeDefined();
    expect(ReportFactory.clearNullObjects).toBeDefined();
    expect(ReportFactory.findMilestoneDatesWeekDuration).toBeDefined();
    expect(ReportFactory.createPeriodicTasks).toBeDefined();
    expect(ReportFactory.createExtendedBarRight).toBeDefined();
    expect(ReportFactory.mapReportPackageEntity).toBeDefined();
    expect(Object.keys(ReportFactory).length).toEqual(47); //53 function 2 objects 9
  });


  it('getReportTypes() should return promise which executes BACKEND API calls and return successful response objects', function (done) {
    var testCaseUrl = UrlService.getService('REPORT_LIST');
    $httpBackend.whenGET(function (actualUrl) {
      return actualUrl.indexOf(testCaseUrl) > -1;
    }).respond(getJSONFixture('report-factory.get-report-types.test.json'));
    var promiseObject = ReportFactory.getReportTypes().then(function (result) {
      expect(result.data).toBeDefined();
      expect(result.message).toBeDefined();
      done();
    });
    $httpBackend.flush();
    expect(promiseObject).toBeDefined();
    expect(isAngularPromise(promiseObject)).toBeTruthy();
  });

  it('getReportTypes() should return promise which executes BACKEND API calls and return failed response objects', function (done) {
    var testCaseUrl = UrlService.getService('REPORT_LIST');
    $httpBackend.whenGET(function (actualUrl) {
      return actualUrl.indexOf(testCaseUrl) > -1;
    }).respond(null);
    var promiseObject = ReportFactory.getReportTypes().then(function (result) {
      expect(result.error).toBeDefined();
      expect(result.message).toBeDefined();
      done();
    });
    $httpBackend.flush();
    expect(promiseObject).toBeDefined();
    expect(isAngularPromise(promiseObject)).toBeTruthy();
  });

  it('getWorkspaceReportCounts() should return promise which executes BACKEND API calls and return successful response objects', function (done) {
    var testCaseUrl = UrlService.getService('WORKSPACE_COUNTS');
    $httpBackend.whenGET(function (actualUrl) {
      return actualUrl.indexOf(testCaseUrl) > -1;
    }).respond(getJSONFixture('report-factory.get-workspace-report-counts.test.json'));
    var promiseObject = ReportFactory.getWorkspaceReportCounts().then(function (result) {
      expect(result.data).toBeDefined();
      expect(result.message).toBeDefined();
      done();
    });
    $httpBackend.flush();
    expect(promiseObject).toBeDefined();
    expect(isAngularPromise(promiseObject)).toBeTruthy();
  });

  it('getWorkspaceReportCounts() should return promise which executes BACKEND API calls and return failed response objects', function (done) {
    var testCaseUrl = UrlService.getService('WORKSPACE_COUNTS');
    $httpBackend.whenGET(function (actualUrl) {
      return actualUrl.indexOf(testCaseUrl) > -1;
    }).respond(null);
    var promiseObject = ReportFactory.getWorkspaceReportCounts().then(function (result) {
      expect(result.error).toBeDefined();
      expect(result.message).toBeDefined();
      done();
    });
    $httpBackend.flush();
    expect(promiseObject).toBeDefined();
    expect(isAngularPromise(promiseObject)).toBeTruthy();
  });
});
