'use strict';
angular.module('saintApp').provider('BarChartService', [function () {
  return {
    '$get':['ConstantService', function(ConstantService){
      var bar ={};
      bar.createGraph = function (chartName, width, margin, height, data, chart, disableChart, groupSpacing) {
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
        var onOver = function () {
          d3.select(this)
            .transition()
            .duration(100)
            .style('stroke', disableChart ? ConstantService.GRAPH_GRAY_COLOR : ConstantService.BIPOLAR_UNLISTED_COLOR)
            .style('stroke-width', 10)
            .style('stroke-opacity', 0.5);
        };
        var onOut = function () {
          if (!this.__data__.isSelected) {
            d3.select(this)
              .transition()
              .duration(100)
              .style('stroke-width', 0)
              .style('stroke-opacity', 1);
          }
        };
        var x = d3.scale.ordinal()
          .rangeRoundBands([0, width + margin.left + margin.right], 0.3);

        var y = d3.scale.linear()
          .range([height, 0]);

        var xAxis = d3.svg.axis()
          .scale(x)
          .ticks(data.length)
          .tickSize(0)
          .orient('bottom');

        var yAxis = d3.svg.axis()
          .scale(y)
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
        y.domain([0, d3.max(data, function (d) {
          return d.value;
        })]);

        svg.append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(6,' + height + ')')
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

        svg.selectAll('.bar')
          .data(data)
          .enter().append('rect')
          .attr('class', function () {
            if (!disableChart) {
              return 'bar';
            } else {
              return 'disableBar';
            }
          })
          .attr('x', function (d) {
            return x(d.shortName);
          })
          .attr('width', (x.rangeBand() - margin.left - margin.right ) / data.length - groupSpacing)
          .attr('transform', 'translate(20,0)')
          .attr('y', function (d) {
            return y(d.value);
          })
          .attr('height', function (d) {
            return height - y(d.value);
          })
          .on('mouseover', function (d) {
            showPopover.call(this, d);
            onOver.call(this, d);
          })
          .on('mouseout', function (d) {
            removePopovers();
            onOut.call(this, d);
          })
          .on('click', function (d) {
            if (!disableChart) {
              d.isSelected = !d.isSelected;
              onOver.call(this, d);
            }
          });
      };
      return bar;
    }]
  };
}]);
