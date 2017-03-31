'use strict';
angular.module('saintApp').service('ReportTypeEntity', [function() {
  return {
    'reportId':'',
    'reportKey':null,
    'reportType':'',
    'isSignalingEnabled':false,
    'description':null
  };
}]);
