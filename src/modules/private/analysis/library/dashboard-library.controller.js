'use strict';
angular.module('saintApp')
  .controller('DashboardLibraryController', ['$scope', 'UrlService', 'SaintService', 'Environment','UserService','ManageMetricsFactory','loaderService','DateService', function (scope, UrlService, SaintService, Environment, UserService, ManageMetricsFactory,loaderService,DateService) {
    scope.showSidebar = true;
    scope.load = false;
    scope.options = {};
    scope.userData = UserService.data.oUser;

    //Function to toggle sidebar
    scope.fnToggleSidebar = function(){
      if(scope.showSidebar){
        scope.showSidebar = false;
      }else{
        scope.showSidebar = true;
      }
    };

     scope.fnInit = function () {
       scope.collapseAll = true;
       SaintService.scrollWindow(0);
       scope.getUserPreferenceCharts();
     };

     //Function to load chart preferences
      scope.getUserPreferenceCharts =  function(){
      scope.chartData =[];
      scope.allCategory = [];
        ManageMetricsFactory.getDashboardLibraryDetails().then(function (result) {
              if(result.data){
                scope.chartData=result.data.Other;
                scope.allCategory = result.data.All;
                ManageMetricsFactory.getLastUpdatedOn().then(function (result) {
                  if(result.data){
                    scope.lastUpdatedOn = DateService.getDateStringInDateFormatOne(result.data);
                  }
                });
              }
              _.each(scope.chartData, function(data){data.isSelected=true;});
              loaderService.stop();
            });
      };
      //Function to have default chart
      scope.fnSelectDefaultChart = function(index,name,cuid,type){
        if(index === 0 ){
           scope.fnSelectDashboard(name,cuid,type,index);
        }
      };

      //Function to load URL on click
      scope.fnSelectDashboard = function(name,cuid,type,index){
      if(index === undefined){
          scope.fnAddStyleToSelectedDashboard(name);
      }
        if(type === '1'){
          scope.url = UrlService.getBOEService('OPEN_DOCUMENT_ANALYSIS', {
            'sIDType': 'CUID',
            'iDocID': cuid,
            'sRefresh': 'false',
            'sStoryName': 'New%20Story',
            'sPageNumber': '1',
            'token': scope.userData.boeToken
          });
          scope.options.lumiraFrameStyleSheet = Environment.saintContext + '/styles/private/analysis/open/open-compose-analysis.css';
         } else{
          scope.url = UrlService.getBOEService('OPEN_DOCUMENT_ANALYSIS', {
            'sIDType': 'CUID',
            'iDocID': cuid,
            'sRefresh': 'false',
            'token': scope.userData.boeToken
          });
          scope.options.lumiraFrameSelectorsToClick = ['#contentwrapper #explorerwrapper .sapBiVaExplorer .sapBiVaExplorerButtonBar .sapUiBtn.icon-double-arrow-left'];
          scope.options.lumiraFrameStyleSheet = Environment.saintContext + '/styles/private/analysis/open/open-visualization-analysis.css';
        }
        scope.options.frame = 'dsuiDashboardLibrary';
        scope.options.lumiraFrame = 'openDocChildFrame';
        scope.options.frameSelectors = ['.openRightPanel'];
        scope.height = '100%';
        scope.load = true;
      };

      //Function to highlight the select chart
      scope.fnAddStyleToSelectedDashboard = function(name){
         var elements = document.getElementsByClassName('dsui-library-list');
          for (var i = 0; i < elements.length; i++) {
             elements[i].classList.remove('dsui-library-list-selected');
          }
           document.getElementById(name).classList.add('dsui-library-list-selected');
           $('iframe').remove();
           SaintService.scrollWindow(0);
      };

      //Function to toggle between Categories
      scope.fnToggleCategoryPanel = function(category){
      $('iframe').remove();
        if (category === 'All'){
          scope.collapseAll = !scope.collapseAll;
          _.each(scope.chartData, function(data){data.isSelected=false;});
        }else {
          scope.collapseAll = !scope.collapseAll;
        }
      };
    scope.fnInit();

  }]);

