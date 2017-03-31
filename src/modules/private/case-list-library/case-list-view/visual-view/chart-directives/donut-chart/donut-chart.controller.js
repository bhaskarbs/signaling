'use strict';
angular.module('saintApp').controller('DonutChartController', ['$http', '$scope', 'ConstantService', 'CaseListFactory', 'AuthorizeService', function($http, scope, ConstantService, CaseListFactory, AuthorizeService) {
    scope.caseListObj = CaseListFactory.data;
    scope.thisEle = null;
    scope.onOver = function() {
        d3.select(this)
            .transition()
            .duration(100)
            .style('stroke', this.__data__.color)
            .style('stroke-width', 6)
            .style('stroke-opacity', 0.5);
    };
    scope.onOut = function() {
        if (!this.__data__.data.isSelected) {
            d3.select(this)
                .transition()
                .duration(100)
                .style('stroke-width', 0)
                .style('stroke-opacity', 1);
        }
    };
    scope.handleClick = function(seldata, disableChart, element){
      if(AuthorizeService.hasPrivilege(ConstantService.PRIVILEGES.CASE_LIST_VISUAL_FILTER) && !disableChart) {
        seldata.isSelected = !seldata.isSelected;
        if(seldata.data){
          seldata.data.isSelected = !seldata.data.isSelected;
        }
        scope.onOver.call(element, seldata);
        var selectedObj = {
          'data': seldata.data? seldata.data: seldata,
          'index': 0,
          'name': scope.dimension
        };
        CaseListFactory.data.chartSelected = selectedObj;
      }
    };
    scope.fnInit = function(width, height, legendContainerWidth) {
        var data = scope.data;
        if(!data){
          return;
        }
        var disableChart = scope.disableCharts;
        angular.forEach(scope.data, function(data) {
            if (data.name.length > 13) {
                data.shortName = data.name.substr(0,9);
                data.shortName += '...';
            } else {
                data.shortName = data.name;
            }
        });
        var chart = null,
            legendElement = null;
        var chartName = scope.dimension + '-' + scope.type;
        chart = document.getElementById(chartName);
        legendElement = document.getElementById(chartName + '-legend');
        if (chart !== null) {
            chart.innerHTML = '';
            legendElement.innerHTML = '';
        }
        var showPopover = function(d) {
            $(this).popover({
              placement: 'bottom',
              container: '#' + chartName,
                trigger: 'manual',
                html: true,
                content: d.data.name + ': ' + d.data.value
            });
            $(this).popover('show');
        };
        var removePopovers = function() {
            $('.popover').each(function() {
                $(this).remove();
            });
        };
        var showPopoverName = function(d) {
            $(this).popover({
                placement: 'bottom',
                container: '#' + chartName+'-legend',
                trigger: 'manual',
                html: true,
                content: d.name
            });
            $(this).popover('show');
        };
        var radius = (Math.min(width, height) / 2)-5;

        var color = d3.scale.category20();
        var arc = d3.svg.arc()
            .innerRadius(radius - (radius - 25))
            .outerRadius(radius);
        var svg = d3.select(chart).append('svg').data([data])
          // .style('padding', 10)
          .attr('width', width)
          .attr('height', height)
          .append('g')
            .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');
        var path = svg.selectAll('path')
            .data(d3.layout.pie(data).value(function(d) {
                return d.value;
            }));
        path.enter().append('path')
            .attr('fill', function(d, i) {
              if(i >= ConstantService.DONUT_CHART_COLORS.length) {
                d.color = color(i);
                d.data.color = color(i);
                return color(i);
              }else{
                d.color = ConstantService.DONUT_CHART_COLORS[i];
                d.data.color = ConstantService.DONUT_CHART_COLORS[i];
                return ConstantService.DONUT_CHART_COLORS[i];
              }
            })
            .attr('d', arc)
            .on('mouseover', function(d) {
                showPopover.call(this, d);
                scope.onOver.call(this, d);
            })
            .on('mouseout', function(d) {
                removePopovers();
                scope.onOut.call(this, d);
            })
            .on('click', function(d) {
              scope.handleClick(d, disableChart, this);
            });
        scope.thisEle = path;
        angular.forEach(scope.data, function(data, idx) {
            if (data) {
                var chart = _.findWhere(scope.caseListObj.selectedChartsList, {
                  'columnName': scope.dimension,
                  'visualHighlight': true
                });
                if (chart) {
                  _.each(chart.contents, function(chart){
                    if(chart.name === data.name){
                      data.isSelected = true;
                      scope.onOver.call(scope.thisEle[0][idx]);
                    }
                  });
                }
            }
        });
        /* Display legend */
        var legendSvg = d3.select(legendElement).append('svg');
        var legend = legendSvg
            .attr('width', legendContainerWidth)
            .attr('class', 'text-right')
            .append('g');

        legend.selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .attr('x', 0)
            .attr('y', function(d, i) {
                return i * 20;
            })
            .attr('width', 6)
            .attr('height', 13)
            .style('fill', function(d) {
                return d.color;
            });
        legend.selectAll('text')
            .data(data)
            .enter()
            .append('text')
            .attr('class', 'dsui-chart-legend')
            .attr('x', 8)
            .attr('y', function(d, i) {
                return i * 20 +12;
            })
            .text(function(d) {
                var text = d.shortName;
                return text;
            })
            .on('click', function(d) {
              var index = -1;
              angular.forEach(scope.data, function(data, idx) {
                if(data.name === d.name){
                  index = idx;
                }
              });
              scope.handleClick(d, disableChart, scope.thisEle[0][index]);
            })
            .on('mouseover', function(d) {
                showPopoverName.call(this, d);
            })
            .on('mouseout', function() {
                removePopovers();
            });
      var s1 = ((legend[0][0]).getBoundingClientRect().height);
      legendSvg.attr('height', s1);
    };
}]);
