'use strict';
angular.module('saintApp').factory('ReportStatusFactory',['$http','$q','UrlService','alertService','LanguageService','ReportStatusEntity', function ($http, $q, UrlService, alertService, LanguageService,ReportStatusEntity) {
  var reportStatusObj = function (data) {
    angular.extend(this, data);
  };

  reportStatusObj.getReportStatus=function(){
    var deferred = $q.defer();
    var url = UrlService.getService('GET_MASTER_REPORT_STATUS');
    $http.get(url)
      .success(function (response) {
        try {
          var reportStatusList = response.d.results;
          var actualObject  = angular.copy(ReportStatusEntity);
          _.each( reportStatusList, function( val ) {
            actualObject.status.push({'id' :val.STATUS_KEY,'value': val.STATUS_NAME});
          });
          deferred.resolve({'data': angular.copy(actualObject), 'message': ''});
        } catch (e) {
          alertService.warn(LanguageService.MESSAGES.FAILED_TO_GET_STATUS_LIST);
          deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_TO_GET_STATUS_LIST});
        }
      })
      .error(function () {
        alertService.error(LanguageService.MESSAGES.FAILED_TO_GET_STATUS_LIST);
        deferred.resolve({'error': 'ok', 'message': LanguageService. MESSAGES.FAILED_TO_GET_STATUS_LIST});
      });
    return deferred.promise;

  };
  return reportStatusObj;
}]);

