 'use strict';

/**
 * @ngdoc function
 * @name saintApp.controller.auth:caselist:DisplayQueryController
 * @description
 * # DisplayQueryController
 * Controller of the saintApp
 */
angular.module('saintApp')
  .controller('DisplayQueryController', ['$scope','CaseListFactory','QueryGroupEntity','QueryRuleEntity','CaseListQueryService','ConstantService','QuerySetEntity','CaseListEntity','QueryGeneratorService', function (scope,CaseListFactory,QueryGroupEntity,QueryRuleEntity,CaseListQueryService,ConstantService,QuerySetEntity,CaseListEntity,QueryGeneratorService) {
    scope.defaultQuery = null;
    scope.displayDefaultQuery = null;
    scope.filtersDraftQuery = null;
    scope.caseListData = CaseListFactory.data;
    scope.showExpand = false;
    scope.operators = null;
    scope.dimensions = null;
    scope.expandQueryBox = 0;

    scope.fnAppendIncludeExcludeCount = function(qBObject){
      scope.filtersDraftQuery = qBObject? QueryGeneratorService.computeSQLForSets(qBObject, scope.defaultQuery).DisplaySQL : '';
      var addedQuery = CaseListQueryService.getIncludeExcludeCountQuery();
      if(scope.filtersDraftQuery){
        scope.filtersDraftQuery = scope.filtersDraftQuery + addedQuery;
      }
    };
    /**
     * @description This watch to check for any updateQueryString appropriate Query String is formed.
     */
    scope.$watch('caseListData.updateQueryString', function(value){
      if(value) {
        scope.caseListData.updateQueryString = false;
        scope.defaultQuery = scope.caseListData.caseListObject.sourceQueryUI;
        if(scope.defaultQuery) {
          scope.defaultQuery = scope.defaultQuery.replace(new RegExp(' AND ', 'ig'), '<b> AND </b>');
          scope.defaultQuery = scope.defaultQuery.replace(new RegExp(' OR ', 'ig'), '<b> OR </b>');
        }
        var querySet = scope.caseListData.caseListObject.queryBuilderObject.setEntities;
        if(querySet && querySet.length > 0){
          scope.fnAppendIncludeExcludeCount(scope.caseListData.caseListObject.queryBuilderObject);
        }else{
          scope.fnAppendIncludeExcludeCount();
        }

      }
    }, true);
    /**
     * @description This watch to check for any new chart has been clicked, so that appropriate Query String is formed.
     */
    scope.$watch('caseListData.selectedChartsList', function(value){
      if(value && value.length > 0 && value.updateDB) {
        scope.composeGroupObject(value);
        scope.saveAnalyticalQuery();
      }else if(value.updateDB){
        var setEntity = scope.caseListData.caseListObject.queryBuilderObject.setEntities[0];
        _.each(setEntity.jSON.group.rules, function(rule){
          if(rule.group && rule.group.source !== ConstantService.SOURCE){
            rule.group.rules.length = 0;
          }
        });
        scope.saveAnalyticalQuery();
        if(!scope.caseListData.caseListObject.sourceQueryUI && !scope.caseListData.caseListObject.visualQueryFilterUI) {
          scope.fnAppendIncludeExcludeCount();
        }
      }
    }, true);
    /**
     * @description This Function is used to persist draft query string.
     */
    scope.saveAnalyticalQuery = function(saveFlag){
      scope.caseListData.caseListObject.saveFlag = saveFlag || 1;
      var sqlSET = scope.caseListData.caseListObject.queryBuilderObject?QueryGeneratorService.computeSQLForSets(scope.caseListData.caseListObject.queryBuilderObject, scope.defaultQuery):null;
      CaseListQueryService.fnUpdateCaseListObj({
        'visualQueryFilterUI' : sqlSET?sqlSET.DisplaySQL:'',
        'queryString' :  sqlSET?sqlSET.actualSQL:''
      });
      scope.caseListData.caseListObject.queryFilterUI = (scope.displayDefaultQuery + scope.filtersDraftQuery)||null;

      CaseListQueryService.fnRunQuery(scope.caseListData.caseListObject);
    };
    scope.composeGroupObject = function(value){
      scope.operators = scope.caseListData.operatorsList;
      scope.dimensions = scope.caseListData.dimensionsList;
      var groupEntity = angular.copy(QueryGroupEntity);
      var setEntity = scope.caseListData.caseListObject.queryBuilderObject.setEntities[0];
      _.each(setEntity.jSON.group.rules, function(rule){
          if(rule.group && rule.group.source !== ConstantService.SOURCE){
            rule.group.rules.length = 0;
            groupEntity = rule;
          }
      });
      if(value && value.length > 0 ) {
        var ruleEntity = angular.copy(QueryRuleEntity);
        _.each(value, function (chart) {
          var dimension = _.findWhere(scope.dimensions, {'columnName': chart.columnName});
          var selOperator = chart.operator?chart.operator.name:null, selValues = null;
          if(chart.contents.length > 1){
            selOperator = selOperator||ConstantService.CASE_LIST_QUERY_INCLUDES;
            selValues = chart.contents;
          }else{
            selOperator = selOperator||ConstantService.CASE_LIST_QUERY_EQUALS;
            selValues = chart.contents[0];
          }
          var operator = _.findWhere(scope.operators, {'dataType': dimension.dataType,'name':selOperator});
          ruleEntity = {
            'operator': operator,
            'operators': [],
            'dimension': dimension,
            'selectedValues': [],
            'value': []
          };
          if(selValues.length > 1){
            ruleEntity.selectedValues = selValues;
          }else{
            ruleEntity.value = selValues;
          }
          groupEntity.group.rules.push(ruleEntity);
        });
      }
      if(setEntity.jSON.group.source === ConstantService.SOURCE){
        angular.forEach(setEntity.jSON.group.rules, function(groupContent){
          if('group' in groupContent && groupContent.source !== ConstantService.SOURCE){
            groupContent = groupEntity;
          }
        });
      }else{
        setEntity.jSON = groupEntity;
      }
      setEntity.sQLQuery = QueryGeneratorService.computeActualSQL(setEntity.jSON.group).sql;
    };

    scope.fnInit = function(){
      CaseListFactory.data.selectedChartsList = [];
      scope.filtersDraftQuery = null;
      scope.defaultQuery = null;
    };
    scope.fnInit();
  }]);
