'use strict';
angular.module('saintApp').factory('PreferencesFactory', ['$timeout','UserService','alertService', 'LanguageService', 'UrlService', '$q', 'ConstantService', 'PreferencesEntity', '$http', function ($timeout, UserService, alertService, LanguageService, UrlService, $q, ConstantService, PreferencesEntity, $http) {
  var persistence = function (data) {
    angular.extend(this, data);
  };
  persistence.timeoutDuration = 500;
  persistence.timeoutPromise = null;
  persistence.persistencePoolObjectQueue = [];

  persistence.stopTimeout = function(timeoutPromise){
    if( timeoutPromise ) {
      $timeout.cancel(timeoutPromise);
    }
  };
  persistence.startTimeout = function(fnHandler){
    persistence.timeoutPromise = $timeout(function(){
      fnHandler();
    }, persistence.timeoutDuration, false);
  };

  persistence.doBackendPersist = function(){
    persistence.stopTimeout(persistence.timeoutPromise);
    if( persistence.persistencePoolObjectQueue.length > 0 ){
      persistence.saveUserPreferenceData(persistence.shiftPersistencePoolObjectQueue());
    }else{
      persistence.startTimeout(persistence.doBackendPersist);
    }
  };
  persistence.startTimeout(persistence.doBackendPersist);

  persistence.pushPersistencePoolObjectQueue = function(obj){
    persistence.persistencePoolObjectQueue.push(obj);
  };
  persistence.shiftPersistencePoolObjectQueue = function(){
    return persistence.persistencePoolObjectQueue.shift();
  };
  persistence.persistPreference = function (key, value, screenName, dataHandler, bSessionBased) {
    var userId = parseInt(UserService.data.oUser.userId);
    var persistedData = dataHandler();
    //Check whether to call POST, PUT or DELETE
    var method = '';
    var payload = '';
    var url = '';
    var keyToPersist = key;
    var valueToPersist = value;
    var isSessionBased = bSessionBased || ConstantService.NOT_SESSION_BASED;

    //Checking persistedData
    var initialPersistedValue = _.findWhere(persistedData, {'persistedKey': keyToPersist});

    if (!valueToPersist) { // It is a DELETE Request
      method = 'DELETE';
    } else if (!initialPersistedValue) { //POST REQUEST
      method = 'POST';
    } else {// UPDATE CASE
      method = 'PUT';
    }

    //Preparing Payload and Url
    switch (method) {
      case 'DELETE':
        url = UrlService.getService('PERSISTED_USER_DATA') + '(FK_USER_ID_KEY='+userId+',KEY=\''+keyToPersist+'\',SCREEN_NAME=\''+screenName+'\')';
        payload = '';
        dataHandler(_.without(persistedData, _.findWhere(persistedData, {'persistedKey': keyToPersist})));
        break;
      case 'POST':
        url = UrlService.getService('PERSISTED_USER_DATA');
        payload = {
          'FK_USER_ID_KEY': userId,
          'KEY': keyToPersist,
          'VALUE': JSON.stringify(valueToPersist),
          'SCREEN_NAME': screenName,
          'IS_SESSION_BASED': parseInt(isSessionBased)
        };
        persistedData.push(persistence.dataEntityMapper(payload));
        break;
      case 'PUT':
        url = UrlService.getService('PERSISTED_USER_DATA') + '(FK_USER_ID_KEY='+userId+',KEY=\''+keyToPersist+'\',SCREEN_NAME=\''+screenName+'\')';
        payload = {
          'FK_USER_ID_KEY': userId,
          'KEY': keyToPersist,
          'VALUE': JSON.stringify(valueToPersist),
          'SCREEN_NAME': screenName
        };
        var row = _.findWhere(persistedData, {'persistedKey': keyToPersist});
        row.persistedValue = persistence.dataEntityMapper(payload).persistedValue;
        break;

    }
    //persist the data in the db
    persistence.pushPersistencePoolObjectQueue({'payload':payload,'method':method,'url':url});
  };

  //Persistent Entity Mapper
  persistence.dataEntityMapper = function (persistenceEntity) {
    var actualObject = angular.copy(PreferencesEntity);
    actualObject.userId = persistenceEntity.FK_USER_ID_KEY;
    actualObject.persistedKey = persistenceEntity.KEY;
    actualObject.isSessionBased = persistenceEntity.IS_SESSION_BASED;
    try{
      actualObject.persistedValue = JSON.parse(persistenceEntity.VALUE);
    }catch(e){ //Value is primitive data type
      actualObject.persistedValue = persistenceEntity.VALUE;
    }
    actualObject.userScreenName = persistenceEntity.SCREEN_NAME;
    return actualObject;
  };

  //Persist user data in backend
  persistence.saveUserPreferenceData = function(serviceDesc) {
    var payload = serviceDesc.payload;
    var headers = {'content-type': 'application/json', 'Accept': 'application/json'};
    $http({
      'method': serviceDesc.method,
      'url': serviceDesc.url,
      'data': payload,
      'header': headers
    })
      .success(function () {
        persistence.doBackendPersist();
      })
      .error(function () {
        //TODO Need to handle fall back scenario
      });
  };

  //Get user persisted data
  persistence.getUserPreferencedData = function (screenName, dataHandler) {
    var deferred = $q.defer();
    var userId = parseInt(UserService.data.oUser.userId);
    var url = UrlService.getService('PERSISTED_USER_DATA');
    url += '?$filter=SCREEN_NAME eq \'' + screenName + '\' and FK_USER_ID_KEY eq ' + userId;
    $http.get(url)
      .success(function (response) {
        try {
          var persistedData = [];
          _.each(response.d.results, function (object) {
            var actualObject = persistence.dataEntityMapper(object);
            persistedData.push(actualObject);
          });
          dataHandler(persistedData);
          deferred.resolve({'data': '', 'message': ''});//Data will be consumed this service data object
        } catch (e) {
          deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_TO_GET_USER_PERSISTED_DATA});
        }
      })
      .error(function () {
        deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_TO_GET_USER_PERSISTED_DATA});
      });
    return deferred.promise;
  };
  return persistence;

}]);
