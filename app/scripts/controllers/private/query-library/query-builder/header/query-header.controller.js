'use strict';
angular.module('saintApp')
  .controller('QueryLibraryHeaderController', ['QueryFactory', '$rootScope','$scope', 'ConstantService','LanguageService', function (QueryFactory, $rootScope, scope, ConstantService,LanguageService) {

    scope.queryFactoryData = QueryFactory.data;
    scope.language=LanguageService.MESSAGES;
    /**
     * Save or Save as query in query library
     * @param mode
     */
    scope.fnSaveQuery = function(mode){
      angular.element('#dsui-query-builder-save-query').modal({backdrop: 'static', keyboard: false});
      $rootScope.$emit(ConstantService.MANAGE_QUERY_LIBRARY_SCREEN + '_' + ConstantService.SAVE_QUERY, mode);
    };

    scope.fnEditButtonClicked = function(){
      scope.togglePageMode();
    };

    scope.fnShareQuery = function () {
      angular.element('#dsui-query-builder-share-query').modal({backdrop: 'static', keyboard: false});
      $rootScope.$emit(ConstantService.MANAGE_QUERY_LIBRARY_SCREEN + '_' + ConstantService.SHARE_QUERY);
    };

    scope.fnDeleteQuery = function (queryKey) {
      angular.element('#dsui-query-delete-error-message').modal({backdrop: 'static', keyboard: false});
      $rootScope.$emit(ConstantService.MANAGE_QUERY_LIBRARY_SCREEN + '_' + ConstantService.DELETE_QUERY,queryKey);
    };
  }]);
