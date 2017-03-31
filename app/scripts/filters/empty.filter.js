'use strict';
//Sample usage
//<span ng-bind="caseDetails|empty:'--'"></span>
angular.module('saintApp').filter('empty', function () {
  return function (data, replaceString) {
    var requiredData = data;
    if (requiredData === '' || requiredData === null) {
      requiredData = replaceString;
    }
    return requiredData;
  };
});
