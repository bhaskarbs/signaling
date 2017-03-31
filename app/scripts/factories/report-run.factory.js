'use strict';
angular.module('saintApp').factory('ReportRunFactory',['UrlService', function (UrlService) {
  var report = function (data) {
    angular.extend(this, data);
  };
  report.openGenericReport=function(reportId){
    var url = UrlService.getService('REPORT_GENERATION')+reportId;
    window.open(url);
  };
  return report;
}]);
