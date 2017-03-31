'use strict';
angular.module('saintApp')
  .controller('BipolarChartController',['$http','$scope','$rootScope','ConstantService','CaseListFactory', 'AuthorizeService', function ($http, $scope, $rootScope,ConstantService, CaseListFactory, AuthorizeService) {
    $scope.fnInit = function () {
      var chart = null;
      var disableChart = $scope.disableCharts;
      var chartName = $scope.dimension + '-' + $scope.type;
      chart = document.getElementById(chartName);
      if(chart !== null){
        chart.innerHTML = '';
      }
      var data = $scope.data;
      //this will return the total count of yes and no for the bar length
      var totalTime = function() {
        var sum = 0;
        angular.forEach(data, function(d) {
          sum = sum+d.value;
        });
        return sum;
      };
      var total = totalTime();
      data.splice(1, 0, {'name':'', 'value': 0.02*total});
      var height = 25,
        percSoFar = 0;

      var showPopover = function (d) {
        if (d.name!== '') {
          $(this).popover({
            placement: 'bottom',
            container: '#' + chartName,
            trigger: 'manual',
            html: true,
            content: d.name + ': ' + d.value
          });
          $(this).popover('show');
        }
      };

      var removePopovers = function () {
        $('.popover').each(function () {
          $(this).remove();
        });
      };
      var svg = d3.select(chart).append('svg')
        .attr('width', '100%')
        .attr('height', height);

      function colors(n) {
        var colorsG = [ConstantService.BIPOLAR_LISTED_COLOR,ConstantService.GRAPH_WHITE_COLOR,ConstantService.BIPOLAR_UNLISTED_COLOR];
        return colorsG[n % colorsG.length];
      }

      var bar = svg.selectAll('g')
        .data(data)
        .enter().append('g');

      bar.append('rect')
        .attr('width', function(d) { return ((d.value/total)*100) + '%'; } )
        .attr('x', function(d) {
          var prevPerc = percSoFar;
          var thisPerc = 100*(d.value/total);
          percSoFar = percSoFar + thisPerc;
          return prevPerc + '%';
        })
        .attr('height', height)
        .attr('fill',  function(d,i) { return (colors(i)); } )
        .on('mouseover', function (d) {
          showPopover.call(this, d);
        })
        .on('mouseout', function () {
          removePopovers();
        })
        .on('click', function (d) {
          if(AuthorizeService.hasPrivilege(ConstantService.PRIVILEGES.CASE_LIST_VISUAL_FILTER)) {
            if (d.name !== '' && !disableChart) {
              d.isSelected = !d.isSelected;
              var selectedObj = {
                'data': d,
                'index': 0,
                'name': $scope.dimension
              };
              CaseListFactory.data.chartSelected = selectedObj;
            }
          }
        });

      percSoFar = 0;
      bar.append('text')
        .attr('x', function(d) {
          var prevPerc = percSoFar;
          var thisPerc = 100*(d.value/total);
          percSoFar = percSoFar + thisPerc;
          prevPerc = (percSoFar - 4);
          return prevPerc + '%';
        })
        .attr('dy', '1.20em')
        .attr('class', 'value')
        .text(function(d) { if(d.name!== ''){ return d.value; }})
        .style('text-anchor', 'end');

      //white bar

      var svg2 = d3.select(chart).append('svg')
        .attr('width', '100%')
        .attr('height', height);

      function colorWhite(n) {
        var colorsG = [ConstantService.GRAPH_WHITE_COLOR,ConstantService.GRAPH_WHITE_COLOR,ConstantService.GRAPH_WHITE_COLOR];
        return colorsG[n % colorsG.length];
      }

      var bar2 = svg2.selectAll('g')
        .data(data)
        .enter().append('g');

      bar2.append('rect')
        .attr('width', function(d) { return ((d.value/total)*100) + '%'; } )
        .attr('x', function(d) {
          var prevPerc = percSoFar;
          var thisPerc = 100*(d.value/total);
          percSoFar = percSoFar + thisPerc;
          return prevPerc + '%';
        })
        .attr('height', height)
        .attr('fill',  function(d,i) { return (colorWhite(i)); } );

      percSoFar = 0;
      bar2.append('text')
        .attr('x', function(d) {
          { if (d.name === ConstantService.LISTED){return 0;} if (d.name === ConstantService.UNLISTED) {return 148;} }
        })
        .attr('dy', '1.20em')
        .attr('class', 'label')
        .text(function(d) { return d.name; });

    };

  }]);
