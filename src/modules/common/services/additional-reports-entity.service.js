'use strict';
angular.module('saintApp').service('AdditionalReportsEntity', [function() {
  return {
    'reportKey':'',
    'reportTypeKey':'',
    'bclKey':'',
    'bclName':'',
    'subReports':[]
  };
}]);
