'use strict';
angular.module('saintApp')
  .controller('ShareCaseListController', ['$timeout', 'loaderService','LanguageService', 'CaseListFactory', '$scope', 'ConstantService', '$rootScope', function ($timeout, loaderService, LanguageService, CaseListFactory, scope, ConstantService, $rootScope) {

    scope.caseList = {};
    scope.caseList.getSelectedUsersGroup = null;
    scope.caseList.selectedUsersGroup = []; // Two way binding not happening with primitive types
    scope.loadUserGroupSelect = false;
    scope.dialogId = 'dsui-share-caselist';
    scope.userSelectId = 'shareCaseListSelect';
    scope.caseList.includeAllUserData = false;
    scope.language = LanguageService.CONSTANTS;

    /**
     * Service to fetch all the selected users
     * @param callback
     */
    scope.fnGetSelectedUserGroup = function () {
      loaderService.start();
       CaseListFactory.getSelectedUser().then(
        function (result) {
          loaderService.stop();
          // Setting true will load the user/group directive
          scope.loadUserGroupSelect = true;
          scope.caseList.getSelectedUsersGroup = result.data.data;
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
    scope.fnSaveShareCaseList = function () {

      var payload = CaseListFactory.computeShareCaseListPayload(scope.caseList);
      loaderService.start();
     CaseListFactory.saveShareCaseList(payload).then(
        function (result) {
          loaderService.stop();
          if (!result.error) {
            angular.element('#' + scope.dialogId).modal('hide');
          }
        });
    };

    //Function to initialize the controller and fetch selected user data
    scope.fnInit = function () {
      scope.fnGetSelectedUserGroup();
    };

    var unbind = $rootScope.$on(ConstantService.MANAGE_CASE_LIST_SHARE + '_' + ConstantService.SHARE_CASE_LIST, function () {
      scope.fnInit();
    });
    scope.$on('$destroy', unbind);

  }
  ]);
