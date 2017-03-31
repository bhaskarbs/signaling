'use strict';
angular.module('saintApp')
  .controller('VerticalBarChartController', [ '$http', '$scope', 'ConstantService', 'CaseListFactory', 'AuthorizeService', function ($http, $scope, ConstantService, CaseListFactory, AuthorizeService) {
    $scope.thisEle = null;
    $scope.caseListObj = CaseListFactory.data;
    $scope.onOver = function() {
      d3.select(this)
        .transition()
        .duration(100)
        .style('stroke',ConstantService.BIPOLAR_UNLISTED_COLOR)
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
      var data = $scope.data;
      var maxNameLength = 0;

      $scope.$on('SORT_TRIGGER_EVENT', function (event,query){
        if(query.dimension === $scope.dimension){
          $scope.data = query.sortedData;
          $scope.fnInit();
        }
      });

      angular.forEach($scope.data, function (data) {
        if (data.name.length>20){
          data.shortName = data.name.substr(0,17);
          data.shortName+='...';
        }
        else{
          data.shortName = data.name;
        }
        if (data.shortName.length > maxNameLength) {
          maxNameLength = data.shortName.length;
        }
      });
      var chartName = $scope.dimension + '-' + $scope.type;
      $scope.size = {
        'height': ($scope.data.length * 50) + 50,
        'width': (maxNameLength * 3) + 500
      };
      chart = document.getElementById(chartName);
      if (chart !== null) {
        chart.innerHTML = '';
      }

      var axisMargin = 20,
        margin = 20,
        width = $scope.size.width,
        height = $scope.size.height,
        barHeight = (height - axisMargin - margin * 2) * 0.4 / data.length,
        barPadding = (height - axisMargin - margin * 2) * 0.6 / data.length,
        bar, svg, scale, xAxis, labelWidth = 0;

      var max = d3.max(data.map(function (i) {
        return i.value;
      }));

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

      var showPopoverName = function (d) {
        $(this).popover({
          placement: 'bottom',
          container: '#' + chartName,
          trigger: 'manual',
          html: true,
          content: d.name
        });
        $(this).popover('show');
      };

      var removePopovers = function () {
        $('.popover').each(function () {
          $(this).remove();
        });
      };

      svg = d3.select(chart)
        .append('svg')
        .attr('width', width)
        .attr('height', height);


      bar = svg.selectAll('g')
        .data(data)
        .enter()
        .append('g');

      bar.attr('class', function(){
        return 'bar';
      })
        .attr('cx', 0)
        .attr('transform', function (d, i) {
          return 'translate(' + margin + ',' + (i * (barHeight + barPadding) + barPadding) + ')';
        });

      bar.append('text')
        .attr('class', 'label')
        .attr('y', barHeight / 2)
        .attr('dy', '.35em') //vertical align middle
        .text(function (d) {
          return d.shortName;
        }).on('click', function (d) {
          var index = -1;
          angular.forEach($scope.data, function(data, idx) {
            if(data.name === d.name){
              index = idx;
            }
          });
          $scope.handleClick(d, $scope.thisEle[0][index]);
        }).on('mouseover', function (d) {
          showPopoverName.call(this, d);
        }).on('mouseout', function () {
          removePopovers();
        }).each(function () {
        labelWidth = Math.ceil(Math.max(labelWidth, this.getBBox().width));
      });

      scale = d3.scale.linear()
        .domain([0, max*1.15])
        .range([0, width - margin * 2 - labelWidth]);

      xAxis = d3.svg.axis()
        .scale(scale)
        .innerTickSize(-height + 2 * margin + axisMargin)
        .outerTickSize(0)
        .orient('bottom');

      bar.append('rect')
        .attr('transform', 'translate(' + labelWidth + ', 0)')
        .attr('height', 20)//Fixed height as per red line pdf
        .attr('width', function (d) {
          return scale(d.value);
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

      svg.insert('g', ':first-child')
        .attr('class', 'axis')
        .attr('transform', 'translate(' + (margin + labelWidth) + ',' + (height - axisMargin - margin) + ')')
        .call(xAxis)
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', 'rotate(-40)');
      $scope.thisEle = bar.select('rect');
      angular.forEach($scope.data,function(data, idx){
        if(data) {
          var chart = _.findWhere($scope.caseListObj.selectedChartsList, {
            'columnName': $scope.dimension,
            'visualHighlight': true
          });
          if (chart) {
            _.each(chart.contents, function(chart){
              if(chart.name === data.name){
                data.isSelected = true;
                $scope.onOver.call($scope.thisEle[0][idx]);
              }
            });
          }
        }
      });
    };

  }]);
