'use strict';
angular.module('saintApp').factory('NotificationFactory', ['$http','$q','LanguageService','UrlService','NotificationEntity','alertService','DateService','ConstantService', function ($http,$q,LanguageService,UrlService,NotificationEntity, alertService,DateService,ConstantService) {
  var notification = function (data) {
    angular.extend(this, data);
  };
  notification.data={
    selectedFilters:[]
  };

  notification.filterList = function(){
    var deferred = $q.defer();
    var errorMessage = LanguageService.MESSAGES.FAILED_TO_GET_NOTIFICATION_FILTER_LIST;
    var url = UrlService.getService('GET_NOTIFICATION_FILTER_LIST');
    $http.get(url).success(function (response) {
      try {
        deferred.resolve({'data': response.d.results, 'message': ''});
      } catch (e) {
        deferred.resolve({'error': 'ok', 'message': errorMessage});
      }
    }).error(function () {
      deferred.resolve({'error': 'ok', 'message': errorMessage});
    });
    return deferred.promise;
  };
  notification.notificationList = function(url){
    var deferred = $q.defer();
    var errorMessage = LanguageService.MESSAGES.FAILED_TO_GET_NOTIFICATIONS_LIST;
    $http.get(url).success(function (response) {
      try {
        var notificationObj = _.map(response.d.results,function(object){
          var actualObj = angular.copy(NotificationEntity);
          actualObj.notificationGroupKey = object.EVENT_NOTIFICATION_GROUP_KEY;
          actualObj.notificationGroupName = object.EVENT_NOTIFICATION_GROUP_NAME;
          actualObj.notificationConfigKey = object.EVENT_NOTIFICATION_CONFIG_KEY;
          actualObj.notificationConfigName = object.EVENT_NOTIFICATION_CONFIG_NAME;
          actualObj.objectName = object.OBJECT_NAME;
          actualObj.objectKey = object.FK_OBJ_KEY;
          actualObj.objectTypeKey = object.FK_OBJ_TYPE_KEY;
          actualObj.parentName= object.PARENT_NAME;
          actualObj.assignedBy = object.EVENT_GENERATED_BY;
          actualObj.createdOn =  object.CREATED_ON;
          actualObj.DOM = notification.fnGetNotificationMessage(actualObj);
          return actualObj;

        });
        deferred.resolve({'data': notificationObj, 'message': ''});
      } catch (e) {
        deferred.resolve({'error': 'ok', 'message': errorMessage});
      }
    }).error(function () {
      deferred.resolve({'error': 'ok', 'message': errorMessage});
    });
    return deferred.promise;
  };

  //Function to make to notifications read
  notification.makeNotificationsRead = function(notificationData){
    var payload = {};
    payload = _.map(notificationData, function(value){
      return {
        'EVENT_NOTIFICATION_DETAILS_KEY': parseInt(value.EVENT_NOTIFICATION_DETAILS_KEY),
        'IS_READ': 1
      };
    });
    var deferred = $q.defer();
    var errorMessage = LanguageService.MESSAGES.FAILED_TO_UPDATE_NOTIFICATIONS_IS_READ;
    var headers = {'content-type': 'application/json','Accept': 'application/json'};
    var url = UrlService.getService('GET_NOTIFICATIONS_IS_READ');
    $http({  'method': 'PUT',
      'url': url,
      'data': payload,
      'header': headers
    })
      .success(function (response) {
        if (response !== null) {
          deferred.resolve({'data': response, 'message': ''});
        } else {
          alertService.warn(errorMessage);
          deferred.resolve({'error': 'ok', 'message': errorMessage});
        }
      })
      .error(function () {
        alertService.error(errorMessage);
        deferred.resolve({'error': 'ok', 'message': errorMessage});
      });
      return deferred.promise;
    };

    //function to call backend service to create overdue notifications
    notification.fnCallReportOverDueService = function(){
       var deferred = $q.defer();
       var errorMessage = LanguageService.MESSAGES.FAILED_TO_GET_OVERDUE_NOTIFICATIONS;
       var headers = {'content-type': 'application/json'};
       var payload = '';
       var url = UrlService.getService('CALL_OVERDUE_NOTIFICATION_SERVICE');
       $http({  'method': 'PUT',
         'url': url,
         'header': headers,
          'data': payload
       })
         .success(function (response) {
           if (response !== null) {
             deferred.resolve({'data': response, 'message': ''});
           } else {
             alertService.warn(errorMessage);
             deferred.resolve({'error': 'ok', 'message': errorMessage});
           }
         })
         .error(function () {
           alertService.error(errorMessage);
           deferred.resolve({'error': 'ok', 'message': errorMessage});
         });
       return deferred.promise;
     };


  notification.fnGetNotificationMessage= function (notificationObj){
    var notificationConfigKey = notificationObj.notificationConfigKey;
    var messageFormat = LanguageService.NOTIFICATION_MESAGES['CONFIG_KEY_'+ notificationConfigKey];
    var replacementValues =[];
    switch (notificationConfigKey) {
      case '1':
        replacementValues.push(notificationObj.objectName);
        replacementValues.push(notificationObj.assignedBy);
        break;
      case '2':
        replacementValues.push(notificationObj.objectName);
        replacementValues.push(notificationObj.assignedBy);
        break;
      case '3':
        replacementValues.push(notificationObj.objectName);
        break;
      case '4':
        replacementValues.push(notificationObj.assignedBy);
        replacementValues.push(notificationObj.objectName);
        replacementValues.push(notificationObj.parentName);
        break;
      case '5':
        replacementValues.push(notificationObj.objectName);
        replacementValues.push(notificationObj.parentName);
        break;
      case '6':
        replacementValues.push(notificationObj.objectName);
        replacementValues.push(notificationObj.parentName);
        break;
      case '7':
        replacementValues.push(notificationObj.assignedBy);
        replacementValues.push(notificationObj.objectName);
        break;
      case '8':
        replacementValues.push(notificationObj.assignedBy);
        replacementValues.push(notificationObj.objectName);
        break;

      //write defencive code
    }
    var message= notification.getFormattedMessage(messageFormat,replacementValues);
    return message;
  };
  notification.getFormattedMessage = function (notoficationString, replacementValues) {
    return notoficationString.replace(/%(\d+)/g, function (abc , index) {
      return replacementValues[--index];
    });
  };

  notification.getFilterConfig = function() {
    var deferred = $q.defer();
    var errorMessage = LanguageService.MESSAGES.FAILED_TO_GET_NOTIFICATIONS_FILTER_LIST;
    var url = UrlService.getService('GET_NOTIFICATIONS_FILTER_LIST')+ '?$select=EVENT_NOTIFICATION_GROUP_NAME';
    $http.get(url).success(function (response) {
      try {
        var tempArray=[];
        angular.forEach(response.d.results,function(value){
         var tempObject={};
          tempObject.filterCategory=value.EVENT_NOTIFICATION_GROUP_NAME;
          tempObject.selected=false;
          tempArray.push(tempObject);
        });
        deferred.resolve({'data': tempArray, 'message': ''});
      } catch (e) {
        deferred.resolve({'error': 'ok', 'message': errorMessage});
      }
    }).error(function () {
      deferred.resolve({'error': 'ok', 'message': errorMessage});
    });
    return deferred.promise;
  };
  notification.calculateCreatedDate = function(notificationObj){
    var createDate = notificationObj.createdOn;
    var currDate = new Date();
    var createdDate=null;
    var notificationCreatedDate=null;
    createdDate = DateService.getNoOfMinutesBetweenTwoDates(createDate,currDate);
    if(createdDate < 60){
      if(createdDate === ConstantService.DATE_BASED){
        notificationCreatedDate = createdDate + ' ' + LanguageService.CONSTANTS.CREATED_MINUTE;
      }
      else {
        notificationCreatedDate = createdDate + ' ' + LanguageService.CONSTANTS.CREATED_MINUTES;
      }
    }
    else {
      createdDate = DateService.getNoOfHoursBetweenTwoDates(createDate, currDate);
      if (createdDate < 24) {
        if(createdDate === ConstantService.DATE_BASED){
          notificationCreatedDate = createdDate + ' ' + LanguageService.CONSTANTS.CREATED_HOUR;
        }
        else{
          notificationCreatedDate = createdDate + ' ' + LanguageService.CONSTANTS.CREATED_HOURS;
        }
      }
      else {
        createdDate = DateService.returnNoOfDaysBetweenTwoDates(createDate, currDate);
        var numberOfDays = DateService.fnNumberOfDaysInAMonth(currDate);
        if (createdDate < numberOfDays) {
          if(createdDate === ConstantService.DATE_BASED){
            notificationCreatedDate = createdDate + ' ' + LanguageService.CONSTANTS.CREATED_DAY;
          }
          else{
            notificationCreatedDate = createdDate + ' ' + LanguageService.CONSTANTS.CREATED_DAYS;
          }
        }
        else {
          createdDate = DateService.getNoOfMonthsBetweenTwoDates(createDate, currDate);
          if (createdDate < 12) {
            if(createdDate === ConstantService.DATE_BASED){
              notificationCreatedDate = createdDate +' ' +  LanguageService.CONSTANTS.CREATED_MONTH;
            }
            else{
              notificationCreatedDate = createdDate +' ' +  LanguageService.CONSTANTS.CREATED_MONTHS;
            }
          }
          else {
            if(createdDate === ConstantService.DATE_BASED){
              notificationCreatedDate = createdDate + ' ' + LanguageService.CONSTANTS.CREATED_YEAR;
            }
            else{
              notificationCreatedDate = createdDate + ' ' + LanguageService.CONSTANTS.CREATED_YEARS;
            }
          }
        }
      }
    }
    return notificationCreatedDate;
  };

  return notification;
}]);
