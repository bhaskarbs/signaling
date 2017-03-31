'use strict';
angular.module('saintApp').factory('ManageMetricsFactory',['$http','$q','UrlService','alertService','LanguageService', function ($http, $q, UrlService, alertService, LanguageService) {
  var manageMetricsObj = function (data) {
    angular.extend(this, data);
  };
  manageMetricsObj.data = {
  };
  var chartsList = [], tempObj = null,chartsListAll = [];
  var chartsListLibrary = [], tempObjLibrary = null;

  /* Get user preference charts for dashboard library */
  manageMetricsObj.getDashboardLibraryDetails = function () {
    var deferred = $q.defer();
    var url = UrlService.getService('DASHBOARD_LIBRARY_READ');
    chartsListAll =[];
    chartsListLibrary = [];
    tempObjLibrary =[];
     $http({
              'method': 'GET',
              'url': url
            })
              .success(function (response) {
                if (response !== null) {
                chartsListAll = response.d.results;
                          _.map(chartsListAll, function (obj) {
                            _.map(obj.dashboardSummary.results, function (object) {
                            if (object.CUID){
                                tempObjLibrary = {
                                cuid: object.CUID,
                                catKey: object.FK_RPT_CAT_KEY,
                                catName: object.NAME,
                                type: object.TYPE,
                                isSelected : false
                              };
                              chartsListLibrary.push(tempObjLibrary);
                            }
                            });
                          });
                var sortedData = _.sortBy(chartsListLibrary, 'catName');
                var data = {
                  'Other':chartsListAll,
                  'All':sortedData
                };
                deferred.resolve({'data': data, 'message': ''});
                } else {
                   alertService.warn(LanguageService.MESSAGES.FAILED_TO_GET_SAVED_METRICS_CHARTS);
                   deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_TO_GET_SAVED_METRICS_CHARTS});
                }
              })
              .error(function () {
                 alertService.warn(LanguageService.MESSAGES.FAILED_TO_GET_SAVED_METRICS_CHARTS);
                 deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_TO_GET_SAVED_METRICS_CHARTS});
              });
            return deferred.promise;
  };

  /* Get user preference charts for dashboard page*/
    manageMetricsObj.getSavedMetricsCharts = function () {
      var deferred = $q.defer();
      var url = UrlService.getService('GET_SAVED_LUMIRA_IDS');
       $http({
                'method': 'GET',
                'url': url
              })
                .success(function (response) {
                  if (response !== null) {
                    var result = response.d.results;
                            _.map(result, function (object) {
                              tempObj = {
                                uuid: object.CUID,
                                name: object.NAME,
                                type: object.TYPE
                              };
                              chartsList.push(tempObj);
                            });
                            deferred.resolve({'data': chartsList, 'message': ''});
                  } else {
                     alertService.warn(LanguageService.MESSAGES.FAILED_TO_GET_SAVED_METRICS_CHARTS);
                     deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_TO_GET_SAVED_METRICS_CHARTS});
                  }
                })
                .error(function () {
                   alertService.warn(LanguageService.MESSAGES.FAILED_TO_GET_SAVED_METRICS_CHARTS);
                   deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_TO_GET_SAVED_METRICS_CHARTS});
                });
              return deferred.promise;
    };

  //function to get the last updated on
  manageMetricsObj.getLastUpdatedOn = function () {
    var deferred = $q.defer();
    var url = UrlService.getService('DASHBOARD_LIBRARY_DATA_REFRESHED_ON');
     $http({
              'method': 'GET',
              'url': url
            })
            .success(function (response) {
              if (response) {
              var data = response.d.results[0].ETL_TIMESTAMP;
              deferred.resolve({'data': data, 'message': ''});
              }
              else {
                 alertService.warn(LanguageService.MESSAGES.FAILED_GET_DASHBOARD_LAST_UPDATED);
                 deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_GET_DASHBOARD_LAST_UPDATED});
              }
            })
            .error(function () {
               alertService.warn(LanguageService.MESSAGES.FAILED_GET_DASHBOARD_LAST_UPDATED);
               deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_GET_DASHBOARD_LAST_UPDATED});
            });
          return deferred.promise;
  };
  return manageMetricsObj;
}]);
