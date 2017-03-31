'use strict';
angular.module('saintApp')
  .directive('queryBuilder', ['$compile', '$rootScope', '$http', 'UrlService', 'logService','QueryGroupEntity', 'QueryRuleEntity', 'DateService', 'ConstantService','$timeout', function ($compile, $rootScope, $http, UrlService, LogService, QueryGroupEntity, QueryRuleEntity, DateService, ConstantService,$timeout) {
    return {
      restrict: 'E',
      scope: {
        group: '=',
        operands: '=',
        dimensions: '=',
        operations: '=',
        caseListObject: '=',
        isReadOnly:'=',
        operatorKey: '@',
        depth: '=',
        context: '@'
      },
      templateUrl: UrlService.getView('QUERY_BUILDER_DIRECTIVE_TEMPLATE'),
      compile: function (element, attributes) {
        var content, directive;
        LogService.log(attributes);
        content = element.contents().remove();
        return function (scope, element, attributes) {
          scope.operators = [];
          scope.fields = [];
          scope.conditions = [];
          scope.conditionKey = null;
          scope.currentActiveRule = null;
          scope.CONSTANTS = ConstantService;
          scope.$watch('operands', function (value) {
            if (value) {
              scope.operators = value;
            }
          });
          /*
          This Function is used to open the date picker
           */
          scope.fnOpenDatePicker=function(id){
            angular.element(id).datepicker('show');
          };
          scope.fnBuildWhereClauseForIngredients = function (rule){
            var whereClause = '';
            if(scope.group.source=== ConstantService.SOURCE && (rule.dimension.columnName === ConstantService.PRODUCT_COLUMN_NAME || rule.dimension.columnName === ConstantService.LICENSE_COLUMN_NAME)){
              angular.forEach(scope.group.rules, function(parentGroupRule){
                if(!parentGroupRule.group && parentGroupRule.dimension.columnName === ConstantService.INGREDIENT_COLUMN_NAME){
                  angular.forEach(scope.caseListObject.selectedIngredients.selectedValues, function(ingredient){
                    whereClause+=ingredient.id;
                    if(scope.caseListObject.selectedIngredients.selectedValues.indexOf(ingredient)<scope.caseListObject.selectedIngredients.selectedValues.length-1){
                      whereClause+=',';
                    }
                  });
                }
              });
            }
            return whereClause;
          };
          scope.searchOptions= function (rule,isSource) {
            return{
              minimumInputLength: -1,
              query: function( options ) {
                var valuesToLoad = 10;
                var errorData = { results: [], more: false};
                var url = UrlService.getService('LOV_SERVICE');
                var method = 'POST';
                var headers = {'content-type': 'application/json', 'Accept': 'application/json'};
                var selected = '';
                angular.forEach(rule.selectedValues,function(value){
                  selected+=value.id+((rule.selectedValues.indexOf(value)===rule.selectedValues.length-1)?'':',');
                });
                var payload = {
                  'COL_NAME':rule.dimension.columnName,
                  'IS_SRC_FILTER':isSource.toString(),
                  'WHERE':options.term,
                  'TOP':valuesToLoad,
                  'SKIP':((options.page*10)-10),
                  'FAMILY_CODE': null,
                  'SELECTED':selected
                };
                $http({
                  'method': method,
                  'url': url,
                  'data': payload,
                  'header': headers
                })
                  .success(function(response){
                    try{
                      rule.values = response.Result;
                      rule.values=rule.values.map(function(data){
                        return {'name':data.name, 'id' : isNaN(data.id)?data.id:Number(data.id), 'code': isNaN(data.code)?data.code:Number(data.code)}; /** If its a number coming as string Convert into number otherwise kepp it as string*/
                      });
                      options.callback({
                          'results': rule.values,
                          'more': rule.values.length===valuesToLoad
                        }
                      );
                    }catch(e){
                      options.callback(errorData);
                    }
                  })
                  .error(function(){
                    options.callback(errorData);
                  });
              },
              formatResult: function( item ) {
                return item.name;//Return the key to display in dropdown
              },
              formatSelection: function( item ) {
                return item.name!==null?item.name:item; //Return the key to display after selection is done in input box
              }
            };
          };
          /**
           *
           *Function to initialize the search options for dropdown with checkboxes.
           *
           */
          scope.multiSearchOptions= function (rule,isSource) {
            return{
              minimumInputLength: -1,
              multiple:false, /**Making it to behave as general behaviour of single select, Done for retaining the search box*/
              closeOnSelect:false,/**No affect of this false option as multiple is false*/
              placeholder:'Multiple Values',/**FIXME -To be moved to constants*/
              query: function( options) {
                var valuesToLoad = 10;
                var errorData = { results: [], more: false};
                var url = UrlService.getService('LOV_SERVICE');
                var method = 'POST';
                var headers = {'content-type': 'application/json', 'Accept': 'application/json'};
                var selected = '';
                angular.forEach(rule.selectedValues,function(value){
                  selected+=value.id+((rule.selectedValues.indexOf(value)===rule.selectedValues.length-1)?'':',');
                });
                var payload = {
                  'COL_NAME':rule.dimension.columnName,
                  'IS_SRC_FILTER':isSource.toString(),
                  'WHERE':options.term,
                  'TOP':valuesToLoad,
                  'SKIP':((options.page*10)-10),
                  'FAMILY_CODE':scope.fnBuildWhereClauseForIngredients(rule),
                  'SELECTED':selected
                };
                $http({
                  'method': method,
                  'url': url,
                  'data': payload,
                  'header': headers
                })
                  .success(function(response){
                    try{
                      rule.values= response.Result;
                      rule.values=rule.values.map(function(data){
                        return {'name':data.name, id : isNaN(data.id)?data.id:Number(data.id), 'code': isNaN(data.code)?data.code:Number(data.code)}; /** If its a number coming as string Convert into number otherwise kepp it as string*/
                      });
                      options.callback({
                          'results': rule.values,
                          'more': rule.values.length===valuesToLoad
                        }
                      );
                    }catch(e){
                      options.callback(errorData);
                    }
                  })
                  .error(function(){
                    options.callback(errorData);
                  });
              },
              formatResult: function( item ,container) {
                if(scope.fnIsSelected(rule,item)){

                  container.append('<input type="checkbox" checked="true">&nbsp;'+item.name);
                }else{
                  container.append('<input type="checkbox" >&nbsp;'+item.name);
                }

                $(container).mouseup(function(e){
                  e.stopPropagation();
                }).click(function(e){
                  e.preventDefault();
                  if(item.name!==null){
                    var existingValue = _.findWhere(rule.selectedValues, {'id': item.id});
                    if(!existingValue){
                      $timeout(function() {
                        $(container).find('input[type=checkbox]').prop('checked',true);

                      }, 0);                    rule.selectedValues.push(item);
                    }else{
                      if(!(isSource===1 && (rule.dimension.columnName === ConstantService.INGREDIENT_COLUMN_NAME || rule.dimension.columnName === ConstantService.LICENSE_COLUMN_NAME || rule.dimension.columnName === ConstantService.PRODUCT_COLUMN_NAME) && rule.selectedValues.length===1)){
                        scope.fnRemoveSelectedLOV(rule,item,isSource);
                        $timeout(function() {
                          $(container).find('input[type=checkbox]').prop('checked',false);
                        }, 0);
                      }
                    }
                  }
                });
              },
              formatSelection: function() {
                return 'Multiple Values';
              }
            };
          };
          scope.fnRemoveProductsForIngredient = function(ingredientKey){
            for(var i=0; i<scope.caseListObject.selectedLicProd.selectedValues.length; i++){
              if(scope.caseListObject.selectedLicProd.selectedValues[i].code === ingredientKey){
                scope.caseListObject.selectedLicProd.selectedValues.splice(i,1);
                i--;
              }
            }
          };
          scope.fnRemoveSelectedLOV=function(rule,objectToBeRemoved){
            var existingValue = _.findWhere(rule.selectedValues, {'id': objectToBeRemoved.id});
            if(existingValue)
            {
              var objectIndex = rule.selectedValues.findIndex(function (existingValue) {
                return existingValue.id === objectToBeRemoved.id;
              });
              if(rule.dimension.columnName === ConstantService.INGREDIENT_COLUMN_NAME){
                scope.fnRemoveProductsForIngredient(objectToBeRemoved.id);
              }
              rule.selectedValues.splice(objectIndex,1);
            }
          };
          scope.fnClearValue = function (rule){
            rule.value = null;
            if(rule.selectedValues) {
              rule.selectedValues.length = 0;
            }
            if('value1' in rule && 'value2' in rule) {
              delete rule.value1;
              delete rule.value2;
            }
          };

          scope.fnOpenModal=function(recieveGroup) {
            var key=recieveGroup;
            scope.$emit('OPEN_THE_INSERT_QUERY_MODAL',key);
          };

          //end of save query modal
          scope.fnIsSelected=function(rule,objectToBeChecked){
            var existingValue = _.findWhere(rule.selectedValues, {'id': objectToBeChecked.id});
            return existingValue?true:false;
          };
          scope.fnGetSearchOptions=function(rule,isSource){
            return scope.searchOptions(rule,isSource);
          };
          scope.fnGetMultiSearchOptions=function(rule,isSource){
            return scope.multiSearchOptions(rule,isSource);
          };
          scope.$watch('dimensions', function (value) {
            if (value) {
              scope.fields = value;
            }
          });
          scope.$watch('operations', function (value) {
            if (value) {
              scope.conditions = value;
            }
          });
          attributes.$observe('operatorKey', function (value) {
            if (value) {
              scope.conditionKey = value;
            }
          });

          scope.changeRefToMSTime = function (rule){
            rule.value = DateService.getMillisecondsInUTCTimeZone(rule.valueOperators);
          };

          scope.changeValueToArray = function (rule) {
              rule.value = null;
              rule.value = [null,null];
          };

          scope.changeRefToMSTimeBtwStart = function (rule){
            rule.value[0] = DateService.getMillisecondsInUTCTimeZone(rule.value1);
          };

          scope.changeRefToMSTimeBtwEnd = function (rule){
            rule.value[1] = DateService.getMillisecondsInUTCTimeZone(rule.value2);
          };

          scope.fnGetConditions = function(field, conditions){
            var tempConditions = [];
            if(field){
              tempConditions = conditions.filter(function(condition){
                return condition[scope.conditionKey]===field[scope.conditionKey];
              });
            }
            return tempConditions;
          };
          scope.addCondition = function () {
            scope.group.rules.push(angular.copy(QueryRuleEntity));
          };

          scope.removeCondition = function (index) {
            scope.group.rules.splice(index, 1);
          };

          scope.addGroup = function () {
            var group = angular.copy(QueryGroupEntity);
            group.group.groupOperator = scope.operators[0];
            scope.group.rules.push(group);
          };

          scope.removeGroup = function () {
            if ('group' in scope.$parent) {
              scope.$parent.group.rules.splice(scope.$parent.$index, 1);
            }
          };
          scope.fnToggleReadWriteMode = function (){
            scope.isReadOnly=!scope.isReadOnly;
          };
          directive = directive || (directive = $compile(content));
          element.append(directive(scope, function ($compile) {
            return $compile;
          }));
        };
      }
    };
  }]);
