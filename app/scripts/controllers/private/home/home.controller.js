'use strict';

/**
 * @ngdoc function
 * @name saintApp.controller.private:HomeController
 * @description
 * # HomeController
 * Controller of the saintApp
 */
angular.module('saintApp')
  .controller('HomeController', ['$scope', 'ReportFactory', 'UserService', 'ConstantService', 'alertService', 'ManageMetricsFactory', 'Environment', 'UrlService', '$state', 'loaderService',function (scope, ReportFactory, UserService, ConstantService, AlertService, ManageMetricsFactory, Environment, UrlService, $state, LoaderService) {
    scope.home = {statusCount: {}};
    scope.loadMinfiedGraphImages = false;
    scope.userData = UserService.data.oUser;
    scope.metricsKpiCharts = [
      { title: ConstantService.CASE_VOLUME_BY_REGION, selector: '', url: 'images/private/home/case_volume_by_region.png', modeIndicator: 'visual', chartPosition: 1, load: false, cuid: '', type: ''},
      { title: ConstantService.ICSR_CASE_VOLUME_BY_SITE, selector: '', url: 'images/private/home/case_volume_by_site.png', modeIndicator: 'story', chartPosition: 1, load: false, cuid: '', type: ''},
      { title: ConstantService.WORK_FLOW_CASE_VOLUME, selector: '', url: 'images/private/home/workflow_case_volume.png', modeIndicator: 'story', chartPosition: 1, load: false, cuid: '', type: ''},
      { title: ConstantService.PERIODIC_REPORT, selector: '', url: 'images/private/home/periodic_dashboard.png', modeIndicator: 'story', chartPosition: 2, load: false, cuid: '', type: ''}
    ];
    scope.fnFormatCount = function (number) {
      if (number) {
        number = parseInt(number);
        if (isNaN(number)) {
          number = 0;
        }
        if (number > 9 && number < 100) {
          return '&nbsp;'+number+'&nbsp;';
        } else if(number <= 9){
          return '&nbsp;&nbsp;' + number + '&nbsp;&nbsp;';
        }else {
          return number;
        }
      } else {
        return '&nbsp;&nbsp;0&nbsp;&nbsp;';
      }
    };
    scope.fnGet29DaysMilliseconds=function(){
      var millisecondsPerDay=1000*60*60*24;
      var millisecondsFor29Days=millisecondsPerDay*29;
      return millisecondsFor29Days;
    };
    scope.fnNavigateWorkspace=function(index,reportsCount){
      if(reportsCount>0){
        var workspaceUrls=[];
        var plus29Days=29;
        var minus29Days=-29;
        workspaceUrls[0]={};
        workspaceUrls[0][ConstantService.PERSIST]=ConstantService.FALSE_INTEGER;
        workspaceUrls[0][ConstantService.FILTER_STATUS_KEY]=ConstantService.REPORT_STATUS_OPEN+','+ConstantService.REPORT_STATUS_OVERDUE+','+ConstantService.REPORT_STATUS_IN_PROGRESS;
        workspaceUrls[0][ConstantService.DB_KEY_RPT_CAT_KEY]=ConstantService.FALSE_INTEGER;
        workspaceUrls[1]={};
        workspaceUrls[1][ConstantService.PERSIST]=ConstantService.FALSE_INTEGER;
        workspaceUrls[1][ConstantService.FILTER_STATUS_KEY]=ConstantService.REPORT_STATUS_OPEN;
        workspaceUrls[1][ConstantService.DB_KEY_DUE_DAYS]=0+','+plus29Days;
        workspaceUrls[1][ConstantService.DB_KEY_RPT_CAT_KEY]=ConstantService.FALSE_INTEGER;
        workspaceUrls[2]={};
        workspaceUrls[2][ConstantService.PERSIST]=ConstantService.FALSE_INTEGER;
        workspaceUrls[2][ConstantService.FILTER_STATUS_KEY]=ConstantService.REPORT_STATUS_COMPLETED;
        workspaceUrls[2][ConstantService.DB_KEY_DUE_DAYS]=minus29Days+','+0;
        workspaceUrls[2][ConstantService.DB_KEY_RPT_CAT_KEY]=ConstantService.FALSE_INTEGER;
        $state.go(ConstantService.STATE.REPORT_LIBRARY_LIST,workspaceUrls[index]);
      }
    };
    scope.fnGetWorkspaceCounts = function (callback) {
      ReportFactory.getWorkspaceReportCounts()
        .then(function (result1) {
          if (result1.data) {
            scope.home.statusCount = result1.data;
          } else {
            AlertService.warn(result1.message);
          }
          if (callback instanceof Function) {
            callback();
          }
        });
    };

    scope.getUserPreferenceCharts = function () {
      ManageMetricsFactory.getSavedMetricsCharts().then(function (result) {
        if(result.data){
          result.data.forEach(function (res) {
            scope.fnLoadLumiraUrls(res.uuid, res.name,res.type);
          });
        }
        LoaderService.stop();
      });
    };
    scope.fnLoadLumiraUrls = function (cuid, name, type) {
      scope.metricsKpiCharts.forEach(function (item) {
        if (item.title === name) {
          item.cuid=cuid;
          item.type=type;
          if(item.modeIndicator === 'story'){
           item.selector='.v-m-root';

            item.url = UrlService.getBOEService('OPEN_DOCUMENT_ANALYSIS', {
              'sIDType': 'CUID',
              'iDocID': cuid,
              'sRefresh': 'false',
              'sStoryName': 'New%20Story',
              'sPageNumber': '1',
              'token': scope.userData.boeToken
            });

           } else if(item.modeIndicator === 'visual'){
            if(item.selector.length === 0){
               item.selector='.sapBiVaTray2GalleryContainer :first-child :first-child :first-child :first-child';
            }
            item.url = UrlService.getBOEService('OPEN_DOCUMENT_ANALYSIS', {
              'sIDType': 'CUID',
              'iDocID': cuid,
              'sRefresh': 'false',
              'token': scope.userData.boeToken
            });
           }
          item.load= true;
        }
      });
    };
    scope.fnNavigateMetric = function (cuid, name, type) {
      var params = {};
      params[ConstantService.PARAMS.OPEN_ANALYSIS_NAME]=name;
      params[ConstantService.PARAMS.OPEN_ANALYSIS_TYPE]='CUID';
      params[ConstantService.PARAMS.OPEN_ANALYSIS_ID]=cuid;
      params[ConstantService.PARAMS.OPEN_ANALYSIS_REFRESH]='false';
      params[ConstantService.PARAMS.OPEN_ANALYSIS_STORY]='New%20Story';
      params[ConstantService.PARAMS.OPEN_ANALYSIS_PAGE]=1;
      params[ConstantService.PARAMS.OPEN_ANALYSIS_CHART_TYPE]=type;
      $state.go(ConstantService.STATE.ANALYSIS_OPEN,params);
    };

    scope.fnInit = function () {
      LoaderService.start();
      scope.fnGetWorkspaceCounts(function () {
        scope.getUserPreferenceCharts();
      });
    };
    scope.fnInit();
  }]);
