'use strict';

/**
 * @ngdoc function
 * @name saintApp.controller.unauth:LandingHeaderController
 * @description
 * # LandingHeaderController
 * Controller of the saintApp
 */
angular.module('saintApp')
.controller('LandingHeaderController',['$scope','$state','$rootScope','Environment', function (scope,$state,$rootScope,Environment) {
  scope.header={'signInButtonVisibility':true};

  scope.fnLoadDashboard=function(){
    window.location.href= Environment.loginUrl;
  };
  scope.fnHideSigninInLoginOnLoad=function(){
    $rootScope.$on('$stateChangeStart', function(event, toState){
      if(toState && toState.name === 'login'){
        scope.header.signInButtonVisibility = false;
      }else{
        scope.header.signInButtonVisibility = true;
      }
    });
    if($state.current.name==='login'){
      scope.header.signInButtonVisibility = false;
    }
  };
  scope.fnInit=function(){
    scope.fnHideSigninInLoginOnLoad();
  };
  scope.fnInit();
}]);
