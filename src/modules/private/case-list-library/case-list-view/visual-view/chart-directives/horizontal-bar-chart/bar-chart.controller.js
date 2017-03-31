'use strict';
angular.module('saintApp')
  .controller('BarChartController', ['$http', '$scope', 'ConstantService', 'CaseListFactory', 'AuthorizeService', function ($http, $scope, ConstantService, CaseListFactory, AuthorizeService) {
    $scope.caseListObj = CaseListFactory.data;
    $scope.thisEle = null;
    $scope.onOver = function() {
      d3.select(this)
        .transition()
        .duration(100)
        .style('stroke',$scope.disableCharts?ConstantService.GRAPH_GRAY_COLOR:ConstantService.BIPOLAR_UNLISTED_COLOR)
        .style('stroke-width',6)
        .style('stroke-opacity',0.5);
    };
    $scope.onOut = function(){
      if(!this.__data__.isSelected) {
        d3.select(this)
          .transition()
          .duration(100)
          .style('stroke-width', 0)
          .style('stroke-opacity', 1);
      }
    };
    $scope.handleClick = function(seldata, element){
      if(AuthorizeService.hasPrivilege(ConstantService.PRIVILEGES.CASE_LIST_VISUAL_FILTER) && !$scope.disableCharts) {
        seldata.isSelected = !seldata.isSelected;
        $scope.onOver.call(element, seldata);
        var selectedObj = {
          'data': seldata,
          'index': 0,
          'name': $scope.dimension
        };
        CaseListFactory.data.chartSelected = selectedObj;
      }
    };
    $scope.fnInit = function () {
      var chart = null;
      var chartName = $scope.dimension + '-' + $scope.type;
      chart = document.getElementById(chartName);
      if (chart !== null) {
        chart.innerHTML = '';
      }
      var data = $scope.data;
      var margin = {top: 20, right: 20, bottom: 50, left: 40},
        width = data.length * 90 - (margin.left - margin.right),
        height = 190 - margin.top - margin.bottom;
      angular.forEach($scope.data, function (data) {
        if (data.name.length>15){
          data.shortName = data.name.substr(0,12);
          data.shortName+='...';
        }
        else{
          data.shortName = data.name;
        }
      });

      var showPopover = function (d) {
        $(this).popover({
          placement: 'bottom',
          container: '#' + chartName,
          trigger: 'manual',
          html: true,
          content: d.name + ': ' + d.value
        });
        $(this).popover('show');
      };

      var removePopovers = function () {
        $('.popover').each(function () {
          $(this).remove();
        });
      };

      var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], 0.3);

      var y = d3.scale.linear()
        .range([height, 0]);

      var xAxis = d3.svg.axis()
        .scale(x)
        .tickSize(0)
        .orient('bottom');

      var yAxis = d3.svg.axis()
        .scale(y)
        .tickSize(-width,0)
        .orient('left')
        .ticks(3);

      var svg = d3.select(chart).append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


      x.domain(data.map(function (d) {
        return d.shortName;
      }));
      y.domain([1, d3.max(data, function (d) {
        return d.value;
      })]);

      svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)
        .selectAll('text')
        .style({'text-anchor': 'end', 'font-size': '0.7em'})
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', function () {
          return 'rotate(-40)';
        });

      var insertLinebreaks = function (d) {
        var el = d3.select(this);
        var words = d.split(d.length === 10);
        el.text('');

        for (var i = 0; i < words.length; i++) {
          var tspan = el.append('tspan').text(words[i]);
          if (i > 0) {
            tspan.attr('x', 0).attr('dy', '15');
          }
        }
      };

      svg.selectAll('g.x.axis g text').each(insertLinebreaks);

      svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis)
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '.71em')
        .style('text-anchor', 'middle');
      svg.selectAll('text')
        .data(data)
        .on('click', function (d) {
          var index = -1;
          angular.forEach($scope.data, function(data, idx) {
            if(data.name === d.name){
              index = idx;
            }
          });
          $scope.handleClick(d, $scope.thisEle[0][index]);
        });
      svg.selectAll('.bar')
        .data(data)
        .enter().append('rect')
        .attr('class', function() {
          return 'bar';
        })
        .attr('x', function (d) {
          return x(d.shortName);
        })
        .attr('width', 25) //Fixed width as per red line pdf
        .attr('transform', 'translate(20,0)')
        .attr('y', function (d) {
          return y(d.value);
        })
        .attr('height', function (d) {
          return height - y(d.value);
        })
        .on('mouseover', function (d) {
          showPopover.call(this, d);
          $scope.onOver.call(this, d);
        })
        .on('mouseout', function (d) {
          removePopovers();
          $scope.onOut.call(this, d);
        })
        .on('click', function (d) {
          $scope.handleClick(d, this);
        });
      $scope.thisEle = svg.selectAll('rect');
      angular.forEach($scope.data,function(data, dataIdx){
        if(data) {
          var chart = _.findWhere($scope.caseListObj.selectedChartsList, {
            'columnName': $scope.dimension,
            'visualHighlight': true
          });
          if (chart) {
            _.each(chart.contents, function(chart){
              if(chart.name === data.name){
                data.isSelected = true;
                $scope.onOver.call($scope.thisEle[0][dataIdx]);
              }
            });
          }
        }
      });
    };
  }]);
