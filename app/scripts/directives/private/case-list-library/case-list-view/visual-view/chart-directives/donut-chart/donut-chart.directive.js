'use strict';
angular.module('saintApp')
  .directive('donutChart', [function () {
    return {
      scope: {
        dimension: '=',
        size: '=',
        type: '=',
        data: '='
      },
      controller: 'DonutChartController',
      template: '<div class="dsui-donut-container clearfix"><p class="clearfix"></p><div class="dsui-graph-container col-sm-8 dsui-no-padding" id="{{dimension}}-{{type}}"></div><div class="dsui-legends-container col-sm-4 dsui-no-padding" style="overflow-y:auto;" id="{{dimension}}-{{type}}-legend"></div></div>',
      link: function (scope, element) {
        $(element).find('.dsui-graph-container').css({padding:10});
        scope.defaultHeight = 130;
        scope.defaultWidth = 130;
        scope.fnGetGraphDimensions = function () {
          scope.elementWidth = $(element).find('.dsui-graph-container').outerWidth();
          scope.elementHeight = $(element).find('.dsui-graph-container').outerHeight();
          if (scope.elementHeight < scope.defaultHeight) {
            scope.elementHeight = angular.copy(scope.defaultHeight);
          }
          if (scope.elementWidth < scope.defaultWidth) {
            scope.elementWidth = angular.copy(scope.defaultWidth);
          }
        };
        $(window).resize(function () {
          scope.fnCreateGraph();
        });
        scope.fnCreateGraph = function () {
          scope.fnGetGraphDimensions();
          $(element).find('.dsui-graph-container').height(scope.elementHeight);
          $(element).find('.dsui-legends-container').height($(element).parent().height());
          var legendContainerWidth = $(element).find('.dsui-legends-container').outerWidth();
          scope.fnInit(scope.elementWidth-10, scope.elementHeight-15, legendContainerWidth);
        };
        scope.$watch('data', function (value) {
          if (value && value.length > 0) {
            scope.data = value;
            if (scope.caseListObj.caseListObject.queryBuilderObject.setEntities.length > 1) {
              scope.disableCharts = true;
            }
            scope.fnCreateGraph();
          }else if(!scope.caseListObj.caseListObject.sourceQueryUI && !scope.caseListObj.caseListObject.visualQueryFilterUI){
            $(element).find('.dsui-graph-container').html('');
            $(element).find('.dsui-legends-container').html('');
          }
        });
        scope.$watch('caseListObj.caseListObject.queryBuilderObject.setEntities', function (value) {
          if (value && value.length > 1) {
            scope.disableCharts = true;
          } else {
            scope.disableCharts = false;
          }
        });
      }
    };
  }]);
