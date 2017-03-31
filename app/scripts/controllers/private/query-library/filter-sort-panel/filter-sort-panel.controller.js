'use strict';
angular.module('saintApp')
  .controller('QueryLibraryFilterSortPanelController', ['$scope', function ($scope) {
    $scope.tab = 1;
    $scope.fnIsSet = function (checkTab) {
      return $scope.tab === checkTab;
    };

    $scope.fnSetTab = function (setTab) {
      $scope.tab = setTab;
    };
  }]);
