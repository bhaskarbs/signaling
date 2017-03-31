'use strict';
angular.module('saintApp').controller('VisualsLayoutController',['$http','$scope','$state','CaseListFactory','ConstantService','loaderService', function($http, scope, $state, CaseListFactory, ConstantService, loaderService) {
  scope.configArray = [];
  scope.filterNames = [];
  scope.sampleData = [];
  scope.countriesList = [];
  scope.counter = 0;
  scope.baseCaseListKey = $state.params.id;
  scope.caseListData = CaseListFactory.data;
  /* Function used to get Country codes required for World Map Chart*/
  scope.fnGetCountryCodes = function(){
    CaseListFactory.getCountryDetails().then(function(result){
      if(!result.error){
        scope.countriesList = result.data;
        scope.counter++;
      }
    });
  };
  scope.fnUpdateConfigData = function(config){
    _.each(config, function(data){
      data.isSelected = false;
    });
  };
  /* Function used to get Visual Charts details.*/
  scope.fnGetVisualChartsDetails = function(filterType, filterNames){
    loaderService.start();
    CaseListFactory.getVisualChartsDetails(scope.baseCaseListKey, filterType, filterNames)
      .then(function (result) {
        if (!result.error) {
          if(!scope.caseListData.caseListObject.sourceQueryUI && !scope.caseListData.caseListObject.visualQueryFilterUI){
            scope.sampleData = {};
          }else {
            scope.sampleData = result.data;
          }
          angular.forEach(scope.configArray, function (config) {
            if(filterNames && filterNames.length > 0 && filterNames.indexOf(config.dimension) > -1){
              return;
            }
            config.data = scope.sampleData[config.dimension];
            scope.fnUpdateConfigData(config.data);
          });
          scope.counter++;
        }
        loaderService.stop();
      });
  };
  /*
  This function is called from the parent , which will refresh the visual charts and saves the data views selected to backend.
   */
  scope.$on('applyDataViews',function(){
    CaseListFactory.getChartDimensions(scope.baseCaseListKey).then(function(result1){
      scope.configArray = result1.data;
      if(!scope.caseListData.caseListObject.sourceQueryUI && !scope.caseListData.caseListObject.visualQueryFilterUI){
        return;
      }
      scope.fnGetChartsData();
    });
  });
  /* Function used to get Visual Charts details.*/
  scope.fnGetChartsData = function(){
    scope.fnGetVisualChartsDetails(parseInt(ConstantService.ONE_KEY), []);
  };
  /* This watch is to check for user input that is click on any charts*/
  scope.$watch('caseListData.chartSelected' , function(value){
    if(value) {
      scope.filterNames.length = 0;
      _.each(scope.configArray, function (config) {
        if (config.dimension === value.name) {
          scope.filterNames.push(config.dimension);
        }
      });
      scope.caseListData.chartSelected = null;
      scope.fnUpdateSelectedChartsList(value);
    }
  }, true);
  /* This watch is to check for user input that is click on any charts*/
  scope.$watch('caseListData.caseListObject.caseListMode' , function(value){
    if(value !== null) {
      if(value === 0 || CaseListFactory.data.selectedChartsList.length === 0){
        scope.filterNames.length = 0;
      }
      if(scope.caseListData.clickedChart) {
        scope.caseListData.clickedChart = false;
        scope.fnGetVisualChartsDetails(parseInt(ConstantService.ONE_KEY), scope.filterNames);
      }
    }
  }, true);
  /* Function used to update shared resource for generation query.*/
  scope.fnUpdateSelectedChartsList = function(selectedChart){
    var chartDisplayName = _.findWhere(scope.configArray, {'dimension': selectedChart.name});
    if(chartDisplayName) {
      var chartsList = CaseListFactory.data.selectedChartsList;
      var index = -1;
      _.each(chartsList, function(chart, idx){
        if(chart.columnName === chartDisplayName.dimension && chart.visualHighlight){
          index  = idx;
        }
      });
      if (index > -1) {
        var contentsIndex= -1, contents = CaseListFactory.data.selectedChartsList[index].contents;
        for( var i=0; i <contents.length; i++){
          if(contents[i].name === selectedChart.data.name){
            contentsIndex = i;
          }
        }
        if(contentsIndex > -1){
          CaseListFactory.data.selectedChartsList[index].contents.splice(contentsIndex,1);
          if(CaseListFactory.data.selectedChartsList[index].contents.length === 0){
            CaseListFactory.data.selectedChartsList.splice(index,1);
            scope.filterNames.splice(selectedChart.name);
          }else if(CaseListFactory.data.selectedChartsList[index].contents.length === 1){
            CaseListFactory.data.selectedChartsList[index].operator = {
              name: ConstantService.CASE_LIST_QUERY_EQUALS
            };
          }
        }else {
          CaseListFactory.data.selectedChartsList[index].contents.push({
            id:selectedChart.data.id,
            name: selectedChart.data.name
          });
          CaseListFactory.data.selectedChartsList[index].operator = {
            name: ConstantService.CASE_LIST_QUERY_INCLUDES
          };
        }
      } else {
        CaseListFactory.data.selectedChartsList.push({
          columnName: selectedChart.name,
          name: chartDisplayName.name,
          contents: [{
            id:selectedChart.data.id,
            name: selectedChart.data.name
          }],
          operator:{
            name: ConstantService.CASE_LIST_QUERY_EQUALS
          }
        });
      }
    }
    CaseListFactory.data.selectedChartsList.updateDB = true;
  };
  /* Get chart details when Case List Details are available */
  scope.$watch('caseListData.caseListObject.baseCaseListKey',function(value){
    if(value){
      CaseListFactory.getChartDimensions(scope.baseCaseListKey).then(function(result1){
        scope.configArray = result1.data;
        if(!scope.caseListData.caseListObject.sourceQueryUI && !scope.caseListData.caseListObject.visualQueryFilterUI){
          return;
        }
        scope.fnGetChartsData();
      });
    }
  });
  scope.fnInit = function() {
    scope.fnGetCountryCodes();
  };
  scope.fnInit();
}]);

