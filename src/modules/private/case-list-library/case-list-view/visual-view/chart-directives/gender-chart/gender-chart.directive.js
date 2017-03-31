'use strict';
angular.module('saintApp')
  .directive('genderChart', [function () {
    return {
      scope: {
        dimension: '=',
        size: '=',
        type: '=',
        data: '=',
        disabled: '='
      },
      template: '<div class="dsui-graph-container" id=\"{{dimension}}-{{type}}\"></div>',
      link: function (scope, element) {
        scope.$watch('data', function (value) {
          if (value && value.length > 0) {
            if(scope.caseListObj.caseListObject.queryBuilderObject.setEntities.length > 1){
              scope.disableCharts = true;
            }
            scope.fnInit();
          }else if(!scope.caseListObj.caseListObject.sourceQueryUI && !scope.caseListObj.caseListObject.visualQueryFilterUI){
            $(element).find('.dsui-graph-container').html('');
          }
        });
        scope.$watch('caseListObj.caseListObject.queryBuilderObject.setEntities', function (value) {
          if (value && value.length > 1) {
            scope.disableCharts = true;
          }else{
            scope.disableCharts = false;
          }
        });
      },
      controller : 'GenderChartController'
    };
  }]);
