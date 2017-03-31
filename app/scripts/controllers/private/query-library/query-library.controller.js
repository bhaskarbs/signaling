'use strict';
angular.module('saintApp')
  .controller('QueryLibraryController', ['PreferencesFactory', 'ConstantService', 'QueryFactory', '$scope','$state', function (PreferencesFactory, ConstantService, QueryFactory, $scope, $state) {
    $scope.fnInit = function () {
      window.scrollTo(0, 0);
      $scope.showFilterPanel = true;
    };

    /**
     * Event handler to create Query
     */
    $scope.fnCreateQueryButtonClicked = function () {
      $state.go(ConstantService.STATE.QUERY_LIBRARY_BUILDER, {id: '0', pageMode:ConstantService.EDIT_MODE});
    };

    /**
     * Switch between filter and sort panel
     */
    $scope.fnToggleFilterPanel = function () {
      $scope.showFilterPanel = !$scope.showFilterPanel;
    };
    $scope.fnInit();

    /**
     * Remove filters for query libraray
     * @param contents
     */
    $scope.fnRemoveFilters=function(contents)
    {
     $scope.$broadcast('ClearFilters',contents);
    };

    /**
     * Manually refresh the tiles once the data is received
     */
    $scope.fnPostProcessingPersistedDataReceived = function () {
      QueryFactory.syncSharedObjectWithPersistedData();

      //Trigger all the initialization functions manually
      $scope.fnCallRefreshQueryTiles();

      //Enable the watchers again to listen to furthur changes
      $scope.$broadcast(ConstantService.MANAGE_QUERY_LIBRARY_SCREEN + '_INIT_WATCHERS');
    };

    /**
     * Get persisted user data for the query library
     */
    $scope.fngetPersistedUserData = function () {

      if (QueryFactory.data.persistedData.length > 0) { // Persisted Data Already Fetched
        $scope.fnPostProcessingPersistedDataReceived();
      } else {
        PreferencesFactory.getUserPreferencedData(ConstantService.MANAGE_QUERY_LIBRARY_SCREEN, function (data) {
          QueryFactory.data.persistedData = data;
        }).then(
          function () {
            $scope.fnPostProcessingPersistedDataReceived();
          }
        );
      }
    };

    $scope.$on(ConstantService.MANAGE_QUERY_LIBRARY_SCREEN + '_' + ConstantService.GET_USER_PREFERENCE, function () {
      $scope.fngetPersistedUserData();
    });

      /**
       * Calling the refresh tile for the query library
       */
    $scope.fnCallRefreshQueryTiles = function () {
      $scope.$broadcast('MANAGE_QUERY_TILES_INIT');
    };
  }]);
