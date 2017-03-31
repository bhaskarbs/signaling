'use strict';
angular.module('saintApp')
  .controller('AdhocAnalysisController', ['$scope', 'UrlService', 'SaintService', 'Environment', 'UserService', 'ConstantService', function (scope, UrlService, SaintService, Environment, UserService, ConstantService) {
    scope.load = false;
    scope.options = {};
    scope.fnInit = function () {
      SaintService.scrollWindow(0);
      //TODO CUID, LUMIRA_DOCUMENT_ID value and LUMIRA_DOCUMENT_REFRESH value need to be dynamic, will take up later w.r.t to the Adhoc Analysis Story
      scope.url = UrlService.getBOEService('OPEN_DOCUMENT_ANALYSIS')+ '?'+ConstantService.PARAMS.LUMIRA_DOCUMENT_TYPE+'=CUID&'+ConstantService.PARAMS.LUMIRA_DOCUMENT_ID+'=AZO8IFczBDdEtMzv7sFaT14&'+ConstantService.PARAMS.LUMIRA_DOCUMENT_REFRESH+'=false' + '&'+ConstantService.PARAMS.OPEN_ANALYSIS_LOGON_TOKEN+'=' + UserService.data.oUser.boeToken;
      scope.options.frame = 'dsuiAdhocDashboard';
      scope.options.lumiraFrame = ConstantService.LUMIRA_INTERNAL_FRAME_ID;
      scope.options.frameSelectors = [ConstantService.LUMIRA_EXTERNAL_FRAME_DOCK_ID];
      scope.options.lumiraFrameStyleSheet = Environment.saintContext + '/styles/private/analysis/adhoc/adhoc-analysis.css';
      scope.load = true;
    };
    scope.fnInit();
  }]);
