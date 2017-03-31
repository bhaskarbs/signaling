'use strict';

/**
 * @ngdoc function
 * @name saintApp.controller:loginErrorController
 * @description
 * # saintApp
 * Controller of the saintApp
 */
angular.module('saintApp')
  .controller('LoginErrorController',['CookieService', 'Environment', function (CookieService,Environment) {
    CookieService.put('loginError',window.location.href);
    window.location.href = Environment.loginUrl;
  }]);
