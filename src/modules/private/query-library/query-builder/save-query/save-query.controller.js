'use strict';
angular.module('saintApp')
  .controller('QueryLibrarySaveQueryController', ['alertService', 'LanguageService', 'loaderService', 'QueryFactory', '$scope', 'ConstantService', '$rootScope', function (alertService, LanguageService, loaderService, QueryFactory, scope, ConstantService, $rootScope) {

    scope.dialogMode = ConstantService.SAVE_QUERY;

    /**
     * Initialise the default save and description value
     */
    scope.fnInit = function () {
      if( scope.dialogMode === ConstantService.SAVE_AS_QUERY ){
        scope.queryName = 'Copy_of'+'_'+QueryFactory.data.queryContext.name;
      } else if( scope.dialogMode === ConstantService.SAVE_QUERY ) {
        scope.queryName = QueryFactory.data.queryContext.name;
      }
      scope.queryDescription = QueryFactory.data.queryContext.description;
    };

    /**
     *  Event handler when cancel button is clicked
     */
    scope.fnOnCancel = function () {
      angular.element('#dsui-query-builder-save-query').modal('hide');
    };

    /**
     * Save the query library
     */
    scope.fnSaveQuery = function () {
      var errorMessage = scope.validateSavePayload();
      scope.fnRunQuery();
      if (errorMessage) {
        alertService.error(errorMessage);
      } else {
        loaderService.start();
        QueryFactory.saveQueryToLibrary(scope.queryName, scope.queryDescription,
          scope.dialogMode, QueryFactory.data.updateQuerySet).then(
          function (result) {
            loaderService.stop();
            angular.element('#dsui-query-builder-save-query').modal('hide');
            if (!result.error) {
              QueryFactory.data.queryContext.name = scope.queryName;
              QueryFactory.data.queryContext.description = scope.queryDescription;
              QueryFactory.data.queryContext.key = result.data.result.QUERY_ID;
            } else {
              $rootScope.$emit(ConstantService.MANAGE_QUERY_LIBRARY_SCREEN + '_' + ConstantService.SAVE_QUERY_ERROR, result.message);
            }
          });
      }
      scope.togglePageMode();
    };

    /**
     * Do the basic validation for the saving shared query payload
     * @returns {string}
     */
    scope.validateSavePayload = function () {
      var errorMessage = '';
      //Check query name should not be empty
      if (!scope.queryName) {
        errorMessage = LanguageService.MESSAGES.FAILED_SAVE_QUERY_LIBRARY_NAME_EMPTY;
      }
      return errorMessage;
    };

    scope.fnInit();
    var unbind = $rootScope.$on(ConstantService.MANAGE_QUERY_LIBRARY_SCREEN + '_' + ConstantService.SAVE_QUERY, function (event, mode) {
      scope.dialogMode = mode;
      scope.fnInit();
    });
    scope.$on('$destroy', unbind);

  }]);
