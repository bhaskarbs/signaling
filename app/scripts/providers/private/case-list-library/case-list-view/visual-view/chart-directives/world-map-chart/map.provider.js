'use strict';
angular.module('saintApp')
  .provider('MapService',[function(){
    return {
      '$get':['$rootScope','CaseListFactory','ConstantService','$state','AuthorizeService',  function ($rootScope,CaseListFactory,ConstantService,$state,AuthorizeService) {
        var map = function (data) {
          angular.extend(this, data);
        };

        map.data = null;
        map.showPoup = function(id, countryCode, name, value){
          $(this).popover({
            placement: 'bottom',
            container: '#'+id,
            trigger: 'manual',
            html: true,
            content: name + ': ' + value
          });
          $(this).popover('show');
        };
        map.hidePoup = function(){
          $('.popover').each(function() {
            $(this).remove();
          });
        };
        map.onOver = function(fillKey) {
          d3.select(this)
            .transition()
            .duration(100)
            .style('stroke',ConstantService.WORLD_MAP_COLORS[fillKey])
            .style('stroke-width',6)
            .style('stroke-opacity',0.5);
        };
        map.onOut = function(){
          if(!this.__data__.isSelected) {
            d3.select(this)
              .transition()
              .duration(100)
              .style('stroke-width', 0)
              .style('stroke-opacity', 1);
          }
        };

        // map chart
        map.fnGetCountryChartForSpecificSection = function(id,dataArray, disableChart){
          var stateUrl = $state.current.url;
          if(stateUrl.indexOf(ConstantService.CASE_VISUALS_URL)!== -1){
            var data = angular.copy(dataArray);
            var filterCountries = [];
            var formattedArray = [];
            var countries = CaseListFactory.data.countries;
            var totalCountries = [];
            var totalCountryCodes = [];
            totalCountries = Datamap.prototype.worldTopo.objects.world.geometries;
            if (data && data.length>0) {
              _.each(data, function(chartData){
                if(chartData){
                  filterCountries.push(chartData.name);
                  chartData.isSelected = false;
                  var chart = _.findWhere(CaseListFactory.data.selectedChartsList, {
                    'columnName': id,
                    'visualHighlight': true
                  });
                  if (chart) {
                    _.each(chart.contents, function(chart){
                      if(chart.name === chartData.name){
                        chartData.isSelected = true;
                      }
                    });
                  }
                }
              });
              _.each(totalCountries, function (val) {
                if (val !== undefined && val !== null && val !== '') {
                  totalCountryCodes.push(val.id);
                }
              });
              _.each(totalCountryCodes, function (val) {
                if (val) {
                  var countryName = countries.fromChart[val], fillColor = 'defaultFill' ;
                  if (countryName) {
                    var country = _.findWhere(data, {'name': countryName});
                    if(country){
                      if(country.value && parseInt(country.value) <= 100){ //&& !disableChart){
                        formattedArray.push({fillKey: '<100', numberOfThings: parseInt(country.value), name: val, isSelected: country.isSelected});
                        fillColor = '<100';
                      }if(country.value && (parseInt(country.value) > 100 && parseInt(country.value) <= 500)){
                        formattedArray.push({fillKey: '100-500', numberOfThings: parseInt(country.value), name: val, isSelected: country.isSelected});
                        fillColor = '100-500';
                      }if(country.value && (parseInt(country.value) > 500 && parseInt(country.value) <= 1000)){
                        formattedArray.push({fillKey: '500-1000', numberOfThings: parseInt(country.value), name: val, isSelected: country.isSelected});
                        fillColor = '500-1000';
                      }if(country.value && (parseInt(country.value) > 1000 && parseInt(country.value) <= 1500)){
                        formattedArray.push({fillKey: '1000-1500', numberOfThings: parseInt(country.value), name: val, isSelected: country.isSelected});
                        fillColor = '1000-1500';
                      }else if(country.value && parseInt(country.value) > 1500){
                        formattedArray.push({fillKey: '>1500', numberOfThings: parseInt(country.value), name: val, isSelected: country.isSelected});
                        fillColor = '>1500';
                      }else if(country.value && parseInt(country.value) === 0){
                        formattedArray.push({fillKey: 'defaultFill', numberOfThings: 0, name: val, isSelected: country.isSelected});
                        fillColor = 'defaultFill';
                      }
                    }
                  }
                }
              });
              var requiredFormat = {};
              map.data = angular.copy(formattedArray);
              requiredFormat = _.indexBy(formattedArray, 'name');
              $('#' + id).html('');
              var datamap = new Datamap({
                element: document.getElementById(id),
                responsive: false,
                fills: {
                  '<100': ConstantService.WORLD_MAP_COLORS['COUNT<100'],
                  '100-500': ConstantService.WORLD_MAP_COLORS['COUNT100-500'],
                  '500-1000': ConstantService.WORLD_MAP_COLORS['COUNT500-1000'],
                  '1000-1500': ConstantService.WORLD_MAP_COLORS['COUNT1000-1500'],
                  '>1500': ConstantService.WORLD_MAP_COLORS['COUNT>1500'],
                  defaultFill: ConstantService.GRAPH_GRAY_COLOR
                },
                data: requiredFormat,
                geographyConfig: {
                  highlightOnHover: false
                },
                done: function(datamap) {
                  var objectKeys = Object.keys(this.data);
                  for(var obj = 0; obj < objectKeys.length ; obj++){
                    var selCountry = _.findWhere(map.data,{'name':objectKeys[obj]});
                    if(selCountry.isSelected){
                      map.onOver.call(datamap.svg.selectAll('.'+objectKeys[obj])[0][0], selCountry.fillKey);
                    }
                  }
                  datamap.svg.selectAll('.datamaps-subunit').on('mouseover', function(geo) {
                    var selCountry = _.findWhere(map.data,{'name':this.__data__.id});
                    if(selCountry){
                      map.onOver.call(this, selCountry.fillKey);
                      map.showPoup.call(this, id, geo.id, geo.properties.name, selCountry.numberOfThings);
                    }else{
                      map.showPoup.call(this, id, geo.id, geo.properties.name, 0);
                    }
                  });
                  datamap.svg.selectAll('.datamaps-subunit').on('mouseout', function() {
                    var selCountry = _.findWhere(map.data,{'name':this.__data__.id});
                    this.__data__.isSelected = this.__data__.isSelected?this.__data__.isSelected:selCountry?selCountry.isSelected:false;
                    if(!this.__data__.isSelected) {
                      map.onOut.call(this);
                    }
                    map.hidePoup.call(this);
                  });
                }
              });
              datamap.legend();
              angular.element('.datamaps-subunit').bind('click touchstart', function () {
                /* Privilages removed from Database. This will be handled in future sprints */
                if(AuthorizeService.hasPrivilege(ConstantService.PRIVILEGES.CASE_LIST_VISUAL_FILTER)){
                  if(!disableChart){
                    var countryName = this.getAttribute('class').split(' ')[1];
                    var countries = CaseListFactory.data.countries;
                    var data = {'name': countries.fromChart[countryName]};
                    var color = $(this).attr('style').split('fill: ')[1].split(';')[0];
                    var colorLower = color.toLocaleLowerCase();
                    this.__data__.isSelected = true;
                    map.onOver.call(this, color);
                    if (colorLower !== ConstantService.GRAPH_ACTIVE_COLOR_IN_IE && colorLower !== ConstantService.GRAPH_GRAY_COLOR_IN_IE &&
                      colorLower !== ConstantService.IE_GRAPH_ACTIVE_COLOR && colorLower !==ConstantService.GRAPH_DISABLED_COLOR) {
                        var selectedObj = {
                          'data': data,
                          'index': 0,
                          'name': id
                        };
                        CaseListFactory.data.chartSelected = selectedObj;
                    }
                  }
                }
              });
            }
          }
        };
        return map;
      }]
    };
  }]);
