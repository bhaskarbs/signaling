'use strict';
angular.module('saintApp').controller('QueryLibraryTilePanelController', ['loaderService', 'ConstantService', 'DateService', 'LanguageService', 'UrlService', '$scope', 'QueryFactory', '$timeout', '$state','$rootScope', function (loaderService, ConstantService, DateService, LanguageService, UrlService, $scope, QueryFactory, $timeout, $state,$rootScope) {
  //Initial Configuration
  $scope.myQueryDataRepo = [];
  $scope.myQueryData = [];
  $scope.totalQuery = 0;
  $scope.startPageShown = 0;
  $scope.endPageShown = 0;
  $scope.queryPerPage = 50; // this should match however many results your API puts on one page
  $scope.queryFactoryData = QueryFactory.data;
  $scope.sortBy = '';
  $scope.containerHeight = 0;
  var oldPageNumber = 1;

  /**
   * Applying dynamic class based on paginator displayed or not
   * @returns {*}
   */
  $scope.fnGetPaginatorClass = function () {
    if ($scope.totalQuery > $scope.queryPerPage) {
      return 'dsui-query-tile-container-with-paginator';
    } else {
      return 'dsui-query-tile-container-without-paginator';
    }
  };

  $scope.$on(ConstantService.MANAGE_QUERY_LIBRARY_SCREEN + '_INIT_WATCHERS', function () {
    $scope.$watch('queryFactoryData.selectedFilters', function (newValue, oldValue) {
      if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
        $scope.fnPageInitialization();
      }
    }, true);
    // Watching the sort
    $scope.$watch('queryFactoryData.querySort', function (newValue, oldValue) {
      if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
        if (newValue.sortedBy && newValue.sortOrder) {
          $scope.fnPageInitialization();
        }
      }
    }, true);
  });

  $scope.pagination = {
    current: 1
  };
  $scope.startIndex = 0;
  $scope.endIndex = 0;
  /**
   * Callled when the pagiantor is clicked
   * @param newPage
   */
  $scope.fnPageChanged = function (newPage) {
    if (oldPageNumber !== newPage) {
      window.scroll(0,0);
      $scope.myQueryData = $scope.fnGetRecordPage(newPage);
      oldPageNumber = newPage;
    }
  };

  /**
   * Event Handler to denote the tile which has been selected
   * @param queryTile
   */
  $scope.fnTilesSelected = function (queryTile) {
    var pageMode = (queryTile.isShared) ? ConstantService.SHARED_MODE : ConstantService.READ_MODE;
    QueryFactory.data.selectedTileId = queryTile.queryId;
    $state.go(ConstantService.STATE.QUERY_LIBRARY_BUILDER, {id: queryTile.queryId, pageMode: pageMode});
  };

  $scope.fnGetDate = function (dateInMilli) {
    return DateService.getDateStringInDateFormatOne(dateInMilli);
  };
  /**
   * Get the query library based on the page number selected on paginator
   * @param pageNumber
   */
  $scope.fnGetRecordPage = function (pageNumber) {
    $scope.startIndex = (pageNumber - 1) * $scope.queryPerPage;
    $scope.endIndex = $scope.startIndex + $scope.queryPerPage;
    var url=QueryFactory.generateOdataQueryParameters(pageNumber, $scope.queryPerPage, $scope.startIndex, $scope.endIndex);
    loaderService.start();
    QueryFactory.getQueryData(url).then(
      function (result) {
        loaderService.stop();
        if (!result.error) {
          $scope.myQueryData = result.data;
          $scope.totalQuery = parseInt(result.count);
          // Update isSelected property for queryData
          for (var i = 0; i < $scope.myQueryData.length; i++) {
            $scope.myQueryData[i].isSelected = false;
          }
          if ($scope.totalQuery === 0) {
            $scope.startPageShown = 0;
            $scope.endPageShown = 0;
          } else {
            $scope.startPageShown = $scope.startIndex + 1;
            $scope.endPageShown = ($scope.endIndex > $scope.totalQuery) ? $scope.totalQuery : $scope.endIndex;
          }
        }
      }
    );
  };

  /**
   * Initialises the query library
   */
  $scope.fnPageInitialization = function () {
    $scope.fnGetRecordPage(1); // second parameter is for whether page initialization called it
    $scope.pagination.current = 1;
  };

  $scope.$on('MANAGE_QUERY_TILES_INIT', function () {
    $scope.fnPageInitialization();
  });

  $scope.$on('ngRepeatFinished', function () {
    $timeout(
      function () {
        $scope.containerHeight = $('#ql_tile_panel').outerHeight(true) - $('#ql_breadcrumb').outerHeight(true) - $('#ql_display_detail').outerHeight(true) - $('#ql_paginator').outerHeight(true);
      }, 0);
  });

  $scope.fnDeleteQuery = function (queryKey) {
    angular.element('#dsui-query-delete-error-message').modal({backdrop: 'static', keyboard: false});
    $rootScope.$emit(ConstantService.MANAGE_QUERY_LIBRARY_SCREEN + '_' + ConstantService.DELETE_QUERY,queryKey);
  };
}]);
