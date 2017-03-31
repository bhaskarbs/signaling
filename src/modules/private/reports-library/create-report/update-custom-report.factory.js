'use strict';
angular.module('saintApp').factory('UpdateCustomReportFactory',['$http','$q','UrlService','alertService','LanguageService', 'UserService', function ($http, $q, UrlService, AlertService, LanguageService, UserService) {
  var updateCustomReportObj = function (data) {
    angular.extend(this, data);
  };

  //Function to login to fetch cuids from the given folder in BOE
   updateCustomReportObj.getCuidFromFolder = function (folderName) {
      var deferred = $q.defer();
      var headers = {'Accept': 'application/json', 'X-SAP-LogonToken': window.decodeURIComponent(UserService.data.oUser.boeToken)};
      var url = UrlService.getBOEService('BOE_INFOSTORE')+folderName+'/children';

      $http({ 'method': 'GET', 'url': url, 'headers': headers})
        .success(function (response) {
          if (response !== null) {
            deferred.resolve({'data': response,'message': LanguageService.MESSAGES.BOE_FOLDER_SEARCH_SUCCESS});
          } else {
            AlertService.warn(LanguageService.FAILED_TO_GET_BOE_SUBFOLDERS);
            deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_TO_GET_BOE_SUBFOLDERS});
          }
        })
        .error(function () {
          AlertService.error(LanguageService.MESSAGES.FAILED_TO_GET_BOE_SUBFOLDERS);
          deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_TO_GET_BOE_SUBFOLDERS});
        });
      return deferred.promise;

    };
  return updateCustomReportObj;
}]);

