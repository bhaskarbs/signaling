'use strict';
angular.module('saintApp')
  .controller('QueryLibraryBuilderController', ['LanguageService', 'UrlService', 'CaseListFactory', 'loaderService', '$scope', 'QueryGeneratorService', 'QueryGroupEntity', 'QuerySetEntity', 'QueryFactory', '$stateParams', 'CaseListEntity', 'QueryRuleEntity', 'ConstantService', '$state', 'CaseListQueryService', function (LanguageService, UrlService, CaseListFactory, loaderService, scope, QueryGeneratorService, QueryGroupEntity, QuerySetEntity, QueryFactory, stateParams, CaseListEntity, QueryRuleEntity, ConstantService, $state, CaseListQueryService) {

    scope.conditionKey = 'dataType';
    scope.filterJsonString = null;
    scope.output = '';
    scope.conditionKey = 'dataType';
    scope.operands = [{key: 1, name: 'AND'}, {key: 0, name: 'OR'}];
    scope.dimensions = [];
    scope.operators = [];
    scope.filter = null;
    scope.caseList = angular.copy(CaseListEntity);

    /**
     * Set the page mode 'EDIT' OR 'READ' mode for the page
     * @param pageMode
     */
    scope.setPageMode = function(pageMode) {
      QueryFactory.data.pageMode = pageMode;
    };

    scope.getPageMode = function() {
      return QueryFactory.data.pageMode;
    };

    scope.togglePageMode = function() {
      if( scope.getPageMode() === ConstantService.READ_MODE){
        scope.setPageMode(ConstantService.EDIT_MODE);
      } else if (scope.getPageMode() === ConstantService.EDIT_MODE) {
        scope.setPageMode(ConstantService.READ_MODE);
      }
    };

    scope.fnHtmlEntities = function (tempString) {
      return String(tempString).replace(/</g, '&lt;').replace(/>/g, '&gt;');
    };
    scope.fnGetOperatorName=function(operator,operators){
      return operators.filter(function(object){
        return object.key===operator.key;
      })[0].name;
    };

    /**
     * Set the query context (name, description and the key) and queryset of available
     * @param data
     */
    scope.fnSetQueryContext = function (data) {
      var querySet;
      QueryFactory.data.queryContext.name = data.queryName || LanguageService.CONSTANTS.DEFAULT_QUERY_NAME;
      QueryFactory.data.queryContext.description = data.queryDesc || null;
      QueryFactory.data.queryContext.key = data.queryId || 0;

      if (data.setQueries && data.setQueries.results.length) {
        querySet = QueryFactory.callSetQueryMapping(data.setQueries.results); // pushes the retrieved querysets into the shared query sets
        QueryFactory.data.updateQuerySet = querySet;
      }
    };

    scope.fnComputedString = function (group, operators) {
      var string = '', i;
      if (group) {
        for (string = '(', i = 0; i < group.rules.length; i++) {
          if (i > 0) {
            string += ' <strong>' + scope.fnGetOperatorName(group.groupOperator, operators) + '</strong> ';
          }
          if(group.rules[i].group){
            string += scope.fnComputedString(group.rules[i].group, operators);
          }else{
            if(group.rules[i].dimension && group.rules[i].operator && group.rules[i].value){
              string += group.rules[i].dimension.name + ' ' + scope.fnHtmlEntities(group.rules[i].operator.name) + ' ' + group.rules[i].value.name;
            }
          }
        }
        string=string + ')';
      }
      return string;
    };

    /**
     * Generate the query set for query builder
     * @returns {*}
     */
    scope.buildQuerySet = function(){
      //creating a dummy query set array for current implementation
      //Changing the Entity from CaseListQuerySetEntity
      var querySet = angular.copy(QuerySetEntity);
      querySet.jSON = angular.copy(scope.filter);
      //Changing the Service from CaseListQueryService
      querySet.sQLQuery = QueryGeneratorService.computeActualSQL(querySet.jSON.group).sql;
      scope.caseList.querySets.length = 0;
      scope.caseList.querySets.push(querySet);
      return querySet;
    };

    /**
     * Update the dosplay query text and generate the payload. Will be called after the save query builder
     */
    scope.fnRunQuery = function(){
      var querySet = scope.buildQuerySet();
      var payload;
      QueryFactory.data.updateQuerySet = [];
      QueryFactory.data.updateQuerySet.push(querySet);
      payload = CaseListQueryService.computePayload(scope.caseList);

      // PreProcessing to reuse caselist payload and adding/removing some properties
      payload.data.setQuery = _.map(payload.data.setQuery, function(o) { return _.omit(o, 'BCL_KEY'); });
      payload.data.setQuery = _.map(payload.data.setQuery, function(o) { return _.omit(o, 'USER_KEY'); });
      payload.data.setQuery = _.map(payload.data.setQuery, function(element) {
        return _.extend({}, element, {QUERY_KEY: QueryFactory.data.queryContext.key});
      });

      QueryFactory.data.queryContext.setQueries = payload.data.setQuery; // Wrapper to existing payload
    };

    //Recursive logic to manually auto-populate the querybuilder according to the json received from the backend
    scope.fnPopulateQueryBuilder = function (group, queryBuilderObject){
          queryBuilderObject.group = angular.copy(QueryGroupEntity.group);
          queryBuilderObject.group.groupOperator = group.groupOperator;
          queryBuilderObject.group.source = group.source;
          function fnSelectOperator(availableOpe){
            if(availableOpe.name === group.rules[i].operator.name && availableOpe.dataType === group.rules[i].operator.dataType){
              tempRule.operator = availableOpe;
            }
          }
          function fnSelectDimension(availableDim){
            if(availableDim.columnName === group.rules[i].dimension.columnName){
              tempRule.dimension = availableDim;
            }
          }
          if(group.rules.length){
            for(var i = 0; i < group.rules.length; i++){
              if(group.rules[i].group){
                queryBuilderObject.group.rules.push(angular.copy(QueryGroupEntity));
                scope.fnPopulateQueryBuilder(group.rules[i].group,queryBuilderObject.group.rules[i]);
              }
              else{
                var tempRule = angular.copy(QueryRuleEntity);
                angular.forEach(scope.dimensions, fnSelectDimension);
                angular.forEach(scope.operators, fnSelectOperator);
                tempRule.value = group.rules[i].value;
                if(tempRule.operator.dataType===ConstantService.FILTER_DATE_TEXT){
                  if(tempRule.operator.name === ConstantService.CASE_LIST_QUERY_EQUALS){
                    tempRule.valueOperators = new Date(group.rules[i].value);
                  }
                  if(tempRule.operator.name === ConstantService.CASE_LIST_QUERY_BETWEEN){
                    tempRule.value1 = new Date(group.rules[i].value[0]);
                    tempRule.value2 = new Date(group.rules[i].value[1]);
                  }
                }
                tempRule.selectedValues=group.rules[i].selectedValues;
                queryBuilderObject.group.rules.push(tempRule);
              }
            }
          }
        };

    scope.fnInit = function () {

      QueryFactory.data.caseListObject.querySets = [];
      scope.caseListObject = QueryFactory.data.caseListObject;
      scope.fnSetQueryContext({});
      scope.setPageMode($state.params.pageMode);
      if (scope.getPageMode() === ConstantService.READ_MODE || scope.getPageMode() === ConstantService.SHARED_MODE) {

        loaderService.start();
        QueryFactory.getQueryDetail($state.params.id).then(
          function (result) {
            loaderService.stop();
            if (!result.error) {
              scope.fnSetQueryContext(result.data[0]);
            }
          }
        );
      } else if (scope.getPageMode() === ConstantService.EDIT_MODE) {
        QueryFactory.data.caseListObject.querySets = [];
        QueryFactory.data.updateQuerySet = [];
      }

      QueryFactory.getOperatorDimensionInfo(function(){
        scope.operators = QueryFactory.data.operatorsList;
        scope.dimensions = QueryFactory.data.dimensionsList;
        scope.filter = angular.copy(QueryGroupEntity);
        scope.filter.group.groupOperator = angular.copy(scope.operands[0]);
      });
      scope.$watch('filter', function (newValue) {
        scope.filterJsonString = JSON.stringify(newValue, null, 2);
        scope.output = newValue ? scope.fnComputedString(newValue.group, scope.operands) : null;
      }, true);

      scope.$watchCollection('caseListObject.querySets', function () {
        if(QueryFactory.data.caseListObject.querySets.length){
          QueryFactory.getOperatorDimensionInfo(function(){
            scope.operators = QueryFactory.data.operatorsList;
            scope.dimensions = QueryFactory.data.dimensionsList;
            scope.filter = angular.copy(QueryGroupEntity);
            scope.filter.group.groupOperator = QueryFactory.data.caseListObject.querySets[0].jSON.group.groupOperator;
            scope.fnPopulateQueryBuilder(QueryFactory.data.caseListObject.querySets[0].jSON.group, scope.filter);
          });
        }
      }, true);
    };
    scope.fnInit();

  }]);
