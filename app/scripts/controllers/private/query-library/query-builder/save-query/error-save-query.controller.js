'use strict';
angular.module('saintApp')
  .controller('ErrorSaveQueryController', ['loaderService', 'QueryFactory', '$scope', 'ConstantService', '$rootScope', function (loaderService, QueryFactory, scope, ConstantService, $rootScope) {

    scope.errorMessage = '';

    /**
     * Closes the error popup shown during query creation
     */
    scope.fnClosePopup = function () {
      //Hide the error message
      angular.element('#dsui-query-builder-save-error-message').modal('hide');
      //Show the save dialog box again
      angular.element('#dsui-query-builder-save-query').modal({backdrop: 'static', keyboard: false});
    };

    /**
     * Saving handler for on so as to destroy on cotroller destruction
     * @type {*|(function())}
     */
    var unbind = $rootScope.$on(ConstantService.MANAGE_QUERY_LIBRARY_SCREEN + '_' + ConstantService.SAVE_QUERY_ERROR, function (event, message) {
      scope.errorMessage = message;
      angular.element('#dsui-query-builder-save-error-message').modal({backdrop: 'static', keyboard: false});
    });
    scope.$on('$destroy', unbind);

  }]);
