'use strict';
angular.module('saintApp')
  .controller('CaseListLibraryController', ['PreferencesFactory','ConstantService','CaseListFactory','$scope','loaderService', 'UrlService', '$state','CaseListEntity', function (PreferencesFactory , ConstantService, CaseListFactory, $scope, loaderService, UrlService, $state,CaseListEntity) {

    $scope.fnInit = function () {
      window.scrollTo(0, 0);
      $scope.showFilterPanel = true;
    };

    $scope.caseListCreationPayload = {
      'data' : null
    };

    $scope.fnToggleFilterPanel = function () {
      $scope.showFilterPanel = !$scope.showFilterPanel;
    };
    $scope.fnInit();

    /**
     *
     */
    $scope.fnCreateCaseList = function(){
      var url = UrlService.getService('CREATE_CASE_LIST');
      var caseListId = null;
      loaderService.start();
      CaseListFactory.doCreateCaseList(url, $scope.caseListCreationPayload).then(function (result) {
        loaderService.stop();
        if (!result.error) {
          //Do a forward navigation to Query Builder
          if( result.data && result.data.CASE_LIST_ID){
            CaseListFactory.data.caseListObject = angular.copy(CaseListEntity);
            caseListId = parseInt(result.data.CASE_LIST_ID);
            $state.go(ConstantService.STATE.CASE_LIST_QUERY_STATE, {id: caseListId, page : ConstantService.PAGE_NAVIGATION_CREATE_CASE_LIST, pageMode: ConstantService.EDIT_MODE});

          }
        }
      });
    };
    $scope.fnPostProcessingPersistedDataReceived = function () {
      CaseListFactory.syncSharedObjectWithPersistedData();

      //Trigger all the initialization functions manually
      $scope.fnCallRefreshReportTiles();

      //Enable the watchers again to listen to furthur changes
      $scope.$broadcast(ConstantService.MANAGE_CASE_LIST_SCREEN + '_INIT_WATCHERS');
    };
    $scope.fnRemoveFilters=function(filters){
      $scope.$broadcast('ClearFilters',filters);
    };
    $scope.fngetPersistedUserData = function () {

      if (CaseListFactory.data.persistedData.length > 0) { // Persisted Data Already Fetched
        $scope.fnPostProcessingPersistedDataReceived();
      } else {
        PreferencesFactory.getUserPreferencedData(ConstantService.MANAGE_CASE_LIST_SCREEN, function (data) {
          CaseListFactory.data.persistedData = data;
        }).then(
          function (result) {
            if (!result.error) {
              $scope.fnPostProcessingPersistedDataReceived();

            }
          }
        );
      }
    };
    $scope.$on(ConstantService.MANAGE_CASE_LIST_SCREEN + '_' + ConstantService.GET_USER_PREFERENCE, function () {
      $scope.fngetPersistedUserData();
    });
    $scope.fnCallRefreshReportTiles = function () {
      $scope.$broadcast('CASE_LIST_TILES_INIT');
    };

  }]);
