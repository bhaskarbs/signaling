'use strict';
describe('MainReportController Controller', function () {
  var scope, ConstantService, ReportFactory, UrlService, DateService, AlertService,
    loaderService,ctrl,languageService,timeoutService;
  beforeEach(function () {
    module('saintApp');
    inject(function ($injector,$controller, $rootScope) {
      ConstantService = $injector.get('ConstantService');
      AlertService = $injector.get('alertService');
      languageService = $injector.get('LanguageService');
      timeoutService = $injector.get('$timeout');
      scope = $rootScope.$new();
      ReportFactory=$injector.get('ReportFactory');
      UrlService=$injector.get('UrlService');
      DateService=$injector.get('DateService');
      loaderService=$injector.get('loaderService');
      scope.fnHideReportPanel = function () {
      };
      scope.fnSetPageComponentState = function () {
      };
      ctrl = $controller('MainReportController', {
        $scope: scope,
        $timeout: timeoutService,
        alertService: AlertService,
        LanguageService: languageService,
        ConstantService : ConstantService,
        ReportFactory:ReportFactory,
        UrlService:UrlService,
        DateService:DateService,
        loaderService:loaderService
      });
    });
  });

  it('should exists', function () {
    expect(ctrl).toBeDefined();
  });
  it('Should have configs defined in it', function() {
    expect(scope.reportDescMaxLimit).toBeDefined();
    expect(scope.myReportDataRepo).toBeDefined();
    expect(scope.myReportData).toBeDefined();
    expect(scope.totalReports).toBeDefined();
    expect(scope.startPageShown).toBeDefined();
    expect(scope.endPageShown).toBeDefined();
    expect(scope.reportsPerPage).toBeDefined();
    expect(scope.reportFactoryData).toBeDefined();
    expect(scope.sortBy).toBeDefined();
    expect(scope.deleteReportSeries).toBeDefined();
    expect(scope.deleteReport).toBeDefined();
    expect(scope.reportKey).toBeDefined();
    expect(scope.disableReportDelete).toBeDefined();
    expect(scope.deleteReportOption).toBeDefined();
    expect(scope.endIndex).toBeDefined();
    expect(scope.startIndex).toBeDefined();
    expect(scope.pagination).toBeDefined();
  });
  it('Should have Methods defined in it', function() {
    expect(scope.callReportDelete).toBeDefined();
    expect(scope.reportDelete).toBeDefined();
    expect(scope.reportDeleteCancel).toBeDefined();
    expect(scope.fnOnCancel).toBeDefined();
    expect(scope.fnDeleteReport).toBeDefined();
    expect(scope.setReportSeries).toBeDefined();
    expect(scope.fnGetReportDescription).toBeDefined();
    expect(scope.fnGenerateOdataQueryParameters).toBeDefined();
    expect(scope.fnGetPaginatorClass).toBeDefined();
    expect(scope.fnPageChanged).toBeDefined();
    expect(scope.fnGetReportStatus).toBeDefined();
    expect(scope.fnTilesSelected).toBeDefined();
    expect(scope.fnGetDate).toBeDefined();
    expect(scope.fnGetRecordPage).toBeDefined();
    expect(scope.fnPageInitialization).toBeDefined();
  });

  it('callReportDelete() should return the optimal output',function() {
    scope.callReportDelete(3);
  });
  it('reportDelete() should return the optimal output',function() {
    scope.reportDelete();
  });
  it('reportDeleteCancel() should return the optimal output',function() {
    scope.reportDeleteCancel();
  });
  it('fnOnCancel() should return the optimal output',function() {
    scope.fnOnCancel();
  });
  it('fnDeleteReport() should return the optimal output',function() {
    scope.deleteReport = true;
    scope.deleteReportSeries = false;
    scope.fnDeleteReport();
    scope.deleteReport = false;
    scope.deleteReportSeries = true;
    scope.fnDeleteReport();
  });
  it('setReportSeries() should return the optimal output',function() {
    scope.setReportSeries(1);
    scope.setReportSeries(2);
  });
  it('fnGetReportDescription() should return the optimal output',function(){
    expect(scope.fnGetReportDescription('desc'))
      .toEqual('desc');
  });
  it('fnGenerateOdataQueryParameters() should return the optimal output',function() {
    var filterArray1 = [{id:1},{id:2}];
    scope.fnGenerateOdataQueryParameters(filterArray1.length);
  });
  it('fnGetPaginatorClass() should return the optimal output',function(){
    scope.totalReports = 100;
    expect(scope.fnGetPaginatorClass())
      .toEqual('dsui-reportTileContainerWithPaginator');
    scope.totalReports = 50;
    expect(scope.fnGetPaginatorClass())
      .toEqual('dsui-reportTileContainerWithoutPaginator');
  });
  it('fnPageChanged() should return the optimal output',function() {
    scope.fnPageChanged(1);
    scope.fnPageChanged(2);
  });

  it('fnGetReportStatus() should return the correct status name',function(){
    expect(scope.fnGetReportStatus(1)).toEqual(ConstantService.OVERDUE.toLowerCase());
    expect(scope.fnGetReportStatus(2)).toEqual(ConstantService.OPEN.toLowerCase());
    expect(scope.fnGetReportStatus(3)).toEqual(ConstantService.INPROGRESS.toLowerCase());
    expect(scope.fnGetReportStatus(4)).toEqual(ConstantService.COMPLETED.toLowerCase());
  });

  it('should call the method fnTilesSelected ', function() {
    scope.fnSetReportPanelHeight = function(){};
    scope.fnTilesSelected({'reportId':1});
  });
  it('should call the method fnGetDate()', function() {
    scope.fnGetDate('/Date(1468734955000)/');
  });
  it('should call the method fnGetRecordPage()', function() {
    scope.fnGetRecordPage(1);
  });
  it('should call the method fnPageInitialization()', function() {
    scope.fnPageInitialization();
  });
});
