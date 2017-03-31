'use strict';
angular.module('saintApp').service('SignalEntity',[ function () {
  return {
    'comparatorStartDate': null,
    'comparatorEndDate': null,
    'cumulativeStartDate': null,
    'cumulativeEndDate': null,
    'threshold': null,
    'denominatorType': null,
    'denominatorValue': null,
    'comparatorPeriod': null
  };
}]);
