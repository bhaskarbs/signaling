'use strict';
angular.module('saintApp')
  .factory('DataViewFactory',['UrlService','$http','$q','alertService','LanguageService','CaseListDimensionEntity',function(UrlService,$http,$q,AlertService,LanguageService,CaseListDimensionEntity){
    var dataView = function(data){
      angular.extend(this,data);
    };
    dataView.saveSelectedDataViews=function(selectedData,bclKey){
      var deferred = $q.defer();
      var url = UrlService.getService('SAVING_DATA_VIEW');
      var payload={
        'data':{'FK_BCL_KEY':bclKey,
        'CONFIG_KEYS':[]}
      };
      angular.forEach(selectedData,function(value,key){
      payload.data.CONFIG_KEYS.push({
        'FK_DATAVIEW_CONFIG_KEY':value.configKey,
        'DATAVIEW_ORDER':key
      });
      });
      var headers = {'content-type': 'application/json','Accept': 'application/json'};
      $http({
        'method': 'POST',
        'url': url,
        'data': payload,
        'header': headers
      })
        .success(function (response) {
          if (response !== null) {
            AlertService.warn(LanguageService.MESSAGES.SAVED_DATA_VIEWS_SUCCESSFULLY);
            deferred.resolve({'error': 'ok', 'message':''});
        }else{
            AlertService.warn(LanguageService.MESSAGES.FAILED_SAVE_DATA_VIEWS);
            deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_SAVE_FAVOURITE});
          }
        }).error(function () {
        AlertService.error(LanguageService.MESSAGES.FAILED_SAVE_DATA_VIEWS);
        deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_SAVE_DATA_VIEWS});
      });
      return deferred.promise;
    };

    dataView.fnGetSelectedListData = function(key){
      var deferred = $q.defer();
      var url = UrlService.getService('CHART_DIMENSIONS') + key+')/Results?&$orderby=IS_ENABLED%20desc,DATAVIEW_ORDER%20asc';
      $http.get(url).success(function(response){
        var dataViewObject = _.map(response.d.results, function (object) {
          var actualObject = angular.copy(CaseListDimensionEntity);
          actualObject.bclKey = object.BCL_KEY; //For unit test cases
          actualObject.configKey = object.CONFIG_KEY;
          actualObject.dimensionGroup = object.DIM_GROUP;
          actualObject.dimensionName = object.DIM_NAME; //For unit test cases
          actualObject.isSelected = object.IS_ENABLED;
          actualObject.dimensionId=object.ID;
          return actualObject;
        });
        deferred.resolve({'data':dataViewObject, 'message': ''});
      }).error(function(){
        AlertService.error(LanguageService.MESSAGES.FAILED_GET_DATA_VIEW_LIST);
        deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_GET_DATA_VIEW_LIST});
      });
      return deferred.promise;
    };
    return dataView;
  }]);
