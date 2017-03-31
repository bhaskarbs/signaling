'use strict';
angular.module('saintApp')
  .controller('OpenAnalysisController', ['$scope', 'UrlService', 'SaintService', 'Environment', 'ConstantService', '$state', 'UserService', function (scope, UrlService, SaintService, Environment, ConstantService, $state, UserService) {
    scope.openAnalysis = {'url': null, analysisName: null, load: false, options: {}};
    scope.fnIsParamAvailable=function(tempUrl){
      if(scope.paramAvailable){
        tempUrl += '&';
      }
      return tempUrl;
    };
    scope.fnIdentifyParameter = function (paramAvailable, paramName, paramKey) {
      if ($state.params.hasOwnProperty(paramName)) {
        scope.openAnalysis.url = scope.fnIsParamAvailable(scope.openAnalysis.url);
        scope.openAnalysis.url += paramKey + '=' + $state.params[paramName];
        paramAvailable = true;
      }
      return paramAvailable;
    };
    scope.fnInit = function () {
      scope.paramAvailable = false;
      SaintService.scrollWindow(0);
      scope.openAnalysis.url = UrlService.getBOEService('OPEN_DOCUMENT_ANALYSIS')+'?';
      scope.paramAvailable = scope.fnIdentifyParameter(true, ConstantService.PARAMS.OPEN_ANALYSIS_TYPE, ConstantService.PARAMS.LUMIRA_DOCUMENT_TYPE);
      scope.paramAvailable = scope.fnIdentifyParameter(scope.paramAvailable, ConstantService.PARAMS.OPEN_ANALYSIS_ID, ConstantService.PARAMS.LUMIRA_DOCUMENT_ID);
      scope.paramAvailable = scope.fnIdentifyParameter(scope.paramAvailable, ConstantService.PARAMS.OPEN_ANALYSIS_REFRESH, ConstantService.PARAMS.LUMIRA_DOCUMENT_REFRESH);
      if($state.params.cType === '1'){
        //TODO Please donot remove this, since we will also have to handle story and page
        scope.openAnalysis.options.lumiraFrameStyleSheet = Environment.saintContext + '/styles/private/analysis/open/open-compose-analysis.css';
      }else{
        scope.openAnalysis.options.lumiraFrameSelectorsToClick = ['#contentwrapper #explorerwrapper .sapBiVaExplorer .sapBiVaExplorerButtonBar .sapUiBtn.icon-double-arrow-left'];
        scope.openAnalysis.options.lumiraFrameStyleSheet = Environment.saintContext + '/styles/private/analysis/open/open-visualization-analysis.css';
      }
      scope.openAnalysis.url +='&'+ConstantService.PARAMS.OPEN_ANALYSIS_LOGON_TOKEN+'='+UserService.data.oUser.boeToken;
      scope.openAnalysis.analysisName = $state.params[ConstantService.PARAMS.OPEN_ANALYSIS_NAME];
      scope.openAnalysis.options.frame = ((new Date().getTime())+'');
      scope.openAnalysis.options.lumiraFrame = ConstantService.LUMIRA_INTERNAL_FRAME_ID;
      scope.openAnalysis.options.frameSelectors = [ConstantService.LUMIRA_EXTERNAL_FRAME_DOCK_ID];
      scope.openAnalysis.load = true;
    };
    scope.fnInit();
  }]);
