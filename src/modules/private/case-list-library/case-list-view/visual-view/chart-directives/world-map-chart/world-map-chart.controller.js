'use strict';
angular.module('saintApp').controller('WorldMapChartController', ['$http', '$scope', 'MapService','CaseListFactory', function ($http, $scope, MapService,CaseListFactory) {
  $scope.caseListObj = CaseListFactory.data;
  $scope.fnInit = function () {
    MapService.fnGetCountryChartForSpecificSection($scope.dimension, $scope.data, $scope.disableCharts);
  };
}]);
