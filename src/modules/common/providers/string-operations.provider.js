'use strict';
angular.module('saintApp').provider('StringOperationsService', [ function () {
  return {
    '$get': ['DateService', function (DateService) {
      var stringOperationService = function () {
      };
      stringOperationService.getFormattedCaseListName = function (ingredients, reportStartDate, reportEndDate) {
        var caseListName = '';
        for (var i = 0; i < ingredients.length; i++) {
          caseListName += ingredients[i] + '_';
        }
        caseListName += DateService.getFormattedDateStringFromDateObject(reportStartDate) + ' - ' + DateService.getFormattedDateStringFromDateObject(reportEndDate);
        return caseListName;
      };
      stringOperationService.getFormattedReportName = function (reportType, ingredients) {
        var reportName = reportType + '-';
        for (var i = 0; i < ingredients.length; i++) {
          if (i < ingredients.length - 1) {
            reportName += ingredients[i] + '_';
          }
          else {
            reportName += ingredients[i];
          }
        }
        return reportName;
      };
      return stringOperationService;
    }]
  };
}]);

