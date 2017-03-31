'use strict';
angular.module('saintApp')
  .controller('GenderChartController', ['$scope', 'ConstantService', 'CaseListFactory', 'GenderService', function (scope, ConstantService, CaseListFactory, GenderService) {
    scope.caseListObj = CaseListFactory.data;
    scope.fnGetClickedGenderDetail = function (data, index, chartName, color) {
      var colorLower = color;
      if (colorLower !== ConstantService.GRAPH_ACTIVE_COLOR_IN_IE && colorLower !== ConstantService.GRAPH_GRAY_COLOR_IN_IE && colorLower !== ConstantService.IE_GRAPH_ACTIVE_COLOR) {
        data.isSelected = !data.isSelected;
        var selectedObj = {
          'data': data,
          'index': 0,
          'name': ConstantService.PATIENT_SEX_DESC
        };
        CaseListFactory.data.chartSelected = selectedObj;
      }
    };
    scope.fnGetColor=function(){
      var colors;
      colors = [ConstantService.GRAPH_ACTIVE_COLOR_MALE, ConstantService.GRAPH_ACTIVE_COLOR_FEMALE, ConstantService.GRAPH_ACTIVE_COLOR_OTHERS];
      return colors;
    };
    scope.fnInit = function () {
      var dataArray = scope.data;
      var temp = [];
      temp[0] = scope.data.filter(function (data) {
        return data.name === ConstantService.MALE_TEXT;
      })[0];
      temp[1] = scope.data.filter(function (data) {
        return data.name === ConstantService.FEMALE_TEXT;
      })[0];
      temp[2] = scope.data.filter(function (data) {
        return (data.name === ConstantService.OTHERS_TEXT || data.name === 'null');//FIXME: Temporary fix as we are getting null value for Gender chart
      })[0];
      var chartName = scope.dimension + '-' + scope.type;
      var maleValue = 0, femaleValue = 0, othersValue = 0;
      var totalValue = 0;
      var values = [];
      var valueObjects = [];
      var colorsArray = scope.fnGetColor();
      var contentArray = angular.copy(temp);
      var availableColors = [ConstantService.GRAPH_AVAILABLE_COLOR_MALE, ConstantService.GRAPH_AVAILABLE_COLOR_FEMALE, ConstantService.GRAPH_AVAILABLE_COLOR_OTHERS];
      //FIXME need to handle availableColors if scope.disabled is true

      contentArray.forEach(function (tempObject) {
        if(tempObject){
          var valueCount = parseInt(angular.copy(tempObject.value));
          if(isNaN(valueCount)){
            valueCount = 0;
          }
          totalValue = totalValue + valueCount;
          if(!tempObject.isSelected){
            tempObject.isSelected = false;
          }
          if (tempObject.name === ConstantService.FEMALE_TEXT) {
            femaleValue = valueCount;
          } else if (tempObject.name === ConstantService.MALE_TEXT) {
            maleValue = valueCount;
          } else {
            //FIXME: Temporary fix as we are getting null value for Gender chart
            if(tempObject.name === 'null'){
              tempObject.id = ConstantService.OTHERS_TEXT;
            }
            othersValue = valueCount;
          }
          var chart = _.findWhere(scope.caseListObj.selectedChartsList, {
            'columnName': scope.dimension,
            'visualHighlight': true
          });
          if (chart) {
            _.each(chart.contents, function(chart){
              if(chart.name === tempObject.name){
                tempObject.isSelected = true;
              }
            });
          }
        }
      });

      values = [maleValue, femaleValue, othersValue];
      valueObjects = [
        { 'percent': maleValue, 'actualValue': maleValue, 'name': 'male', 'data': contentArray[0], 'parentData': {id: chartName}, color: {forDisplay: colorsArray[0], forFill: availableColors[0]}},
        { 'percent': femaleValue, 'actualValue': femaleValue, 'name': 'female', 'data': contentArray[1], 'parentData': {id: chartName}, color: {forDisplay: colorsArray[1], forFill: availableColors[1]}},
        { 'percent': othersValue, 'actualValue': othersValue, 'name': 'others', 'data': contentArray[2], 'parentData': {id: chartName}, color: {forDisplay: colorsArray[2], forFill: availableColors[2]}}
      ];

      if (dataArray.length > 0) {
        valueObjects[0].percent = values[0] / totalValue;
        valueObjects[1].percent = values[1] / totalValue;
        valueObjects[2].percent = values[2] / totalValue;
      }

      GenderService.createGraph(scope.disableCharts, scope.type, chartName, values, valueObjects, colorsArray, availableColors, scope.fnGetClickedGenderDetail);
    };
  }]);
