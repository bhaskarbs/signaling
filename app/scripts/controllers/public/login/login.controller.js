'use strict';

/**
 * @ngdoc function
 * @name saintApp.controller.unauth:LoginController
 * @description
 * # LoginController
 * Controller of the saintApp
 */
angular.module('saintApp')
  .controller('LoginController', ['$scope', 'logService','CookieService','alertService','LanguageService', 'Environment', function (scope, log,CookieService,alertService,LanguageService, Environment) {
    scope.login = { 'action': '/siteminderagent/forms/login.fcc', 'smQueryData': '', 'smAuthReason': '', 'smAgentName': '', 'target': '', 'userName': '', 'password': '', 'remember': false};
    scope.fnErrorMessage = function(){
      if(CookieService.get('loginError')){
        scope.loginErrorCheck = CookieService.get('loginError');
        if(scope.loginErrorCheck.indexOf('loginError') !== 1){
          alertService.error(LanguageService.MESSAGES.FAILED_TO_LOGIN);
          CookieService.remove('loginError');
        }
      }
    };
    scope.fnEvaluateParameters = function () {
      scope.fnErrorMessage();
      try {
        var queryString, queryStringParams;
        if (window.location.href.indexOf('SMQUERYDATA') !== -1) {
          queryString = window.location.href.split('?')[1];
          queryStringParams = queryString.split('&');
          scope.login.smQueryData = queryStringParams[0].split('SMQUERYDATA=')[1];
          scope.login.smQueryData = scope.login.smQueryData.substr(4);
          scope.login.smQueryData = window.decodeURIComponent(scope.login.smQueryData);
          scope.login.action = scope.login.action + '?SMQUERYDATA=' + scope.login.smQueryData;
        } else {
          queryString = window.location.href.split('?')[1];
          queryStringParams = queryString.split('&');
          var SMAUTHREASON = queryStringParams[3].split('SMAUTHREASON=')[1];
          var SMAGENTNAME = queryStringParams[5].split('SMAGENTNAME=')[1];
          var TARGET = queryStringParams[6].split('TARGET=')[1];
          var targetDecoded = window.decodeURIComponent(TARGET).replace(/-/g, '').substr(2);
          var targetDecodedParams = targetDecoded.split('?SAMLRequest=');
          var targetDecodedRequiredParamsSplited = targetDecodedParams[1].split('&SMPORTALURL=');
          var affWebServiceURL = targetDecodedParams[0];
          var SAMLRequest = targetDecodedRequiredParamsSplited[0];
          SAMLRequest = window.encodeURIComponent(SAMLRequest);
          var SMPORTALURL = targetDecodedRequiredParamsSplited[1];
          SMPORTALURL = window.encodeURIComponent(SMPORTALURL);
          var requiredTargetURL = affWebServiceURL + '?SAMLRequest=' + SAMLRequest + '&SMPORTALURL=' + SMPORTALURL;
          scope.login.smAuthReason = SMAUTHREASON;
          scope.login.smAgentName = SMAGENTNAME;
          scope.login.target = requiredTargetURL;
        }
      } catch (e) {
        window.location.href=Environment.loginUrl;
      }
    };
    scope.fnLoadUserName=function(){
      var userEmail=CookieService.get('user');
      if(userEmail){
        scope.login.userName=userEmail;
        scope.login.remember=true;
      }
    };
    scope.fnSaveUserName=function(){
      if(scope.login.userName && !scope.loginForm.USER.$invalid){
        CookieService.store('user',scope.login.userName);
      }
    };
    scope.$watch('login.remember',function(value){
      if(value){
        scope.fnSaveUserName();
      }else{
        if(scope.login.userName && !scope.loginForm.USER.$invalid){
          var userEmail=CookieService.get('user');
          if(scope.login.userName===userEmail){
            CookieService.remove('user');
          }
        }
      }
    });
    scope.$watch('login.userName',function(value){
      if(value && scope.login.remember){
        scope.fnSaveUserName();
      }
    });
    scope.fnInit = function () {
      scope.fnEvaluateParameters();
      scope.fnLoadUserName();
    };
    scope.fnInit();
  }]);
