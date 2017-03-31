'use strict';
angular.module('saintApp')
  .directive('bipolarChart', function () {
    return {
      scope: {
        dimension: '=',
        size: '=',
        type: '=',
        data: '='
      },
      template: '<div class=\"dsui-bipolar\" id=\"{{dimension}}-{{type}}\"></div>',
      controller: 'BipolarChartController',
      link: function ($scope) {
        $scope.$watch('data', function (value) {
          if (value) {
            $scope.data = value;
            if($scope.caseListObj.caseListObject.queryBuilderObject.setEntities.length > 1){
              $scope.disableCharts = true;
            }
            $scope.fnInit();
          }
        });
        $scope.$watch('caseListObj.caseListObject.queryBuilderObject.setEntities', function (value) {
          if (value && value.length > 1) {
            $scope.disableCharts = true;
          }else{
            $scope.disableCharts = false;
          }
        });
      }
    };
  });
