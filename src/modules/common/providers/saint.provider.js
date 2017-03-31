'use strict';
angular.module('saintApp')
  .provider('SaintService', [function () {
    return {
      '$get': ['$rootScope', 'logService', 'UrlService', 'UserService', '$timeout', 'loaderService', 'CookieService','AuthorizeService','$state','ConstantService','alertService','LanguageService', function ($rootScope, LogService, UrlService, UserService, $timeout, LoaderService, CookieService,AuthorizeService,$state,ConstantService,AlertService,LanguageService) {
        var saint = function () {
        };
        saint.dirtyFlags = {
          'QUERY_BUILDER': false
        };
        saint.fnCheckAllDirtyFlags = function (){
          var dirtyKeys = [];
          angular.forEach(saint.dirtyFlags, function(value,key){
            if(value){
              dirtyKeys.push(key);
            }
          });
          return {'dirtyFlag': (dirtyKeys.length>0), 'dirtyKeys': dirtyKeys};
        };
        saint.fnProvideAlertForDirtyFlags = function (){
          var dirtyObject = saint.fnCheckAllDirtyFlags();
          var alertString = '';
          angular.forEach(dirtyObject.dirtyKeys, function(dirtyKey){
            alertString+= LanguageService.MESSAGES.UNSAVED_PROGRESS_MESSAGES[dirtyKey];
          });
          if(dirtyObject.dirtyFlag){
            var confirmation = window.confirm(alertString);
            if(confirmation){
              angular.forEach(saint.dirtyFlags, function(value,key){
                  saint.dirtyFlags[key] = false;
              });
            }
            return confirmation;
          }
          else{
            return true;
          }
        };
        saint.scrollWindow = function (position) {
          $('body,html').animate({scrollTop: position});
        };
        saint.handleAuthorization = function () {
          $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            LogService.log(event, toState, toParams, fromState, fromParams);
            if (toState.privilege && !AuthorizeService.hasPrivilege(toState.privilege)) { //check if the state level privilege is assigned
              if(fromState.abstract){ //check if the state url has been hit directly (the app was not loaded before)
                AlertService.error(LanguageService.MESSAGES.NOT_AUTHORIZE_SECTION_REDIRECT);
                event.preventDefault();
                $timeout(function(){
                  $state.go(ConstantService.STATE.HOME);
                },5000,false);
              }else{ //if the user is already on a valid page
                AlertService.error(LanguageService.MESSAGES.NOT_AUTHORIZE_SECTION);
                event.preventDefault();
              }
          }
          });
        };
        saint.listenForSessionClosed = function () {
          $rootScope.$on('sessionClosed', function () {
            CookieService.remove('application');
          });
        };
        saint.prepareSessionExists = function () {
          CookieService.put('application',window.location.href);
        };
        saint.handleDefaulters = function () {
          saint.handleAuthorization();
          saint.listenForSessionClosed();
        };
        saint.clearHandleDefaulters = function () {
          $rootScope.$broadcast('sessionClosed');
          window.location.href = UrlService.getView('LOGOUT');
        };
        saint.initiateApplication = function () {
          saint.handleDefaulters();
          if (UserService.data.oUser) {
            LoaderService.stop();
            saint.prepareSessionExists();
            $timeout(function () {
              angular.element('.dsui').removeAttr('style');
            }, 300);
          } else {
            saint.clearHandleDefaulters();
          }
        };
        return saint;
      }]
    };
  }]);
