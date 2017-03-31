/**
 * Created by tebs on 5/19/2016.
 */
'use strict';
angular.module('saintApp')
  .controller('DeleteQueryController', ['$scope', 'QueryFactory', '$state', 'ConstantService', '$rootScope', 'loaderService', function ($scope, QueryFactory, $state, ConstantService, $rootScope, loaderService) {

    /*Function to initialize*/
    $scope.init = function () {
      $scope.queryKey = 0;
    };

    /*Function to show delete modal*/
    $scope.fnDeleteConfirmation = function (query) {
      if ($state.current.name === ConstantService.STATE.QUERY_LIBRARY) {
        $scope.queryKey = query.queryId;
      }
      else {
        $scope.queryKey = query;
      }
      angular.element('#dsui-query-delete-error-message').modal('show');
    };

    /*Call to delete service*/

    $scope.fnQueryDelete = function () {
      var sendQueryKey = {
        'QUERY_KEY': $scope.queryKey
      };
      loaderService.start();
      QueryFactory.fnDeleteQueryService(sendQueryKey).then(
        function () {
          $scope.cancelQueryDelete();
          if ($state.current.name === ConstantService.STATE.QUERY_LIBRARY_BUILDER) {
            $scope.fnNavigate(ConstantService.STATE.QUERY_LIBRARY);
            loaderService.stop();
          } else {
            loaderService.stop();
            $scope.fnPageInitialization();
          }
        });
    };

    /*Close delete modal*/

    $scope.cancelQueryDelete = function () {
      angular.element('#dsui-query-delete-error-message').modal('hide');
      var modalBackdrop = angular.element(document.getElementsByClassName('modal-backdrop fade in'));
      modalBackdrop.remove();
    };
    var unbind = $rootScope.$on(ConstantService.MANAGE_QUERY_LIBRARY_SCREEN + '_' + ConstantService.DELETE_QUERY, function (event, queryKey) {
      $scope.fnDeleteConfirmation(queryKey);
    });
    $scope.$on('$destroy', unbind);
    $scope.init();
  }]);
