'use strict';
angular.module('saintApp').service('SaveReportPackageEntity',[function () {
  return {
              'RPT_PKG_KEY' :null,
              'IS_REPORT_FLOW' : null,
              'RPT_KEY' : null,
              'IS_BLINDED':null,
              'IS_FINAL':null,
              'SELECT_ALL':null,
              'data': []
  };
}]);
