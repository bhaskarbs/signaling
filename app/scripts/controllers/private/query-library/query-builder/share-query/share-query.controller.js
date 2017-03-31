'use strict';
angular.module('saintApp')
  .controller('QueryLibraryShareQueryController', ['LanguageService', '$timeout', 'loaderService', 'QueryFactory', '$scope', 'ConstantService', '$rootScope', function (LanguageService, $timeout, loaderService, QueryFactory, scope, ConstantService, $rootScope) {

    scope.query = {};
    scope.query.getSelectedUsersGroup = null;
    scope.query.selectedUsersGroup = []; // Two way binding not happening with primitive types
    scope.loadUserGroupSelect = false;
    scope.dialogId = 'dsui-query-builder-share-query';
    scope.userSelectId = 'queryLibraryShareQuerySelect';
    scope.query.includeAllUserData = false;
    scope.language = LanguageService.CONSTANTS;

    /**
     * Service to fetch all the selected users
     * @param callback
     */
    scope.fnGetSelectedUserGroup = function () {
      loaderService.start();
      QueryFactory.getSelectedUser().then(
        function (result) {
          loaderService.stop();
          // Setting true will load the user/group directive
          scope.loadUserGroupSelect = true;
          scope.query.getSelectedUsersGroup = result.data.data;
          scope.query.includeAllUserData = (result.data.SELECT_ALL) ? true : false;
        }
      );
    };

    /**
     *  Event handler when cancel button is clicked
     */
    scope.fnOnCancel = function () {
      angular.element('#' + scope.dialogId).modal('hide');
      scope.loadUserGroupSelect = false;
    };



    /**
     * Share the query library
     */
    scope.fnSaveShareQuery = function () {

      var payload = QueryFactory.computeShareQueryPayload(scope.query);
      loaderService.start();
      QueryFactory.saveShareQuery(payload).then(
        function (result) {
          loaderService.stop();
          if (!result.error) {
            angular.element('#' + scope.dialogId).modal('hide');
          }
        });
    };

    scope.fnInit = function () {
      scope.fnGetSelectedUserGroup();
    };

    var unbind = $rootScope.$on(ConstantService.MANAGE_QUERY_LIBRARY_SCREEN + '_' + ConstantService.SHARE_QUERY, function () {
      scope.fnInit();
    });
    scope.$on('$destroy', unbind);

  }
  ]);
