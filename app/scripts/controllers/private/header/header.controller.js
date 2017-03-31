'use strict';

/**
 * @ngdoc function
 * @name saintApp.controller.auth:HeaderController
 * @description
 * # HeaderController
 * Controller of the saintApp
 */
angular.module('saintApp')
.controller('HeaderController',['$scope','$rootScope','UserService','UrlService','alertService','LanguageService','loaderService', 'SaintService','NotificationFactory','NotificationsPollingService', function (scope,$rootScope,UserService,UrlService,AlertService,LanguageService,LoaderService,SaintService,NotificationFactory,NotificationsPollingService) {
  scope.header={oUser:UserService.data, token:null, logoutAction:UrlService.getService('LOGOUT_APPLICATION')};
  scope.notificationsCount = NotificationsPollingService.data;
  scope.$watch('header.oUser',function(value){
  	if(value){
  		scope.header.oUser=value;
  	}
  });
  $rootScope.$on('logoutSuccessCast',function(event, data){
    if(data===1){
      scope.fnDoLogout();
    }else if(data===2){
      AlertService.warn(LanguageService.MESSAGES.MESSAGE_FOR_LOGOUT);
    }
  });
  scope.fnDoLogout=function(){
    LoaderService.start();
    $rootScope.pollWorker.terminate();
    UserService.doSessionCleanup().then(function () {
      UserService.doBOELogoff().then(function () {
        //irrespective of the BOE log off, logout of the HANA
          UserService.getLogoutToken().then(function (result) {
            if (result.error) {
              LoaderService.stop();
            } else {
              scope.header.token = result.data;
              $rootScope.$broadcast('sessionClosed');
              UserService.doLogout(result.data).then(function (result) {
                LoaderService.stop();
                if (!result.error) {
                  window.location.href = UrlService.getView('LOGOUT');
                }
              });
            }
          });

      });
    });
  };
  scope.fnCheckUnsavedProgressAndLogout = function(){
    if(SaintService.fnProvideAlertForDirtyFlags()){
        scope.fnDoLogout();
    }
  };
}]);
