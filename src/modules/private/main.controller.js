'use strict';

/**
 * @ngdoc function
 * @name saintApp.controller.auth:MainController
 * @description
 * # MainController
 * Controller of the saintApp
 */
angular.module('saintApp')
  .controller('MainController', ['$scope', 'ConstantService', '$state', 'UrlService', 'AuthorizeService', function (scope, ConstantService, $state, UrlService, AuthorizeService) {
    scope.VIEWS = UrlService.partials;
    scope.CONSTANTS = ConstantService;
    scope.PRIVILEGES = ConstantService.PRIVILEGES;
    scope.decorator = AuthorizeService.decorator;
    scope.fnNavigate = function (state, params) {
      if (state) {
        if (params) {
          $state.go(state, params, {reload: false});
        } else {
          $state.go(state, null, {reload: false});
        }
      }
    };
  }]);
