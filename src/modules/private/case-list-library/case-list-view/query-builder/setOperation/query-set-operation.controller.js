'use strict';
angular.module('saintApp')
    .controller('QuerySetOperationController', ['$scope', 'setQueryBoard', 'ConstantService', function(scope, setQueryBoardService, ConstantService) {
        var tooltipFlag = false;
        scope.parenthesisConfig = [{
            'type': ConstantService.SET_QUERY_CONFIG.SET_OPERATION_BRACKET,
            'name': ConstantService.SET_QUERY_CONFIG.SET_OPERATION_OPEN_BRACKET
        }, {
            'type': ConstantService.SET_QUERY_CONFIG.SET_OPERATION_BRACKET,
            'name': ConstantService.SET_QUERY_CONFIG.SET_OPERATION_CLOSE_BRACKET
        }]; //default parenthesis objects for open and closed bracket
        scope.sortableOptions = {
            containment: '#board',
            //restrict move across columns. move only within column.
            accept: function(sourceItemHandleScope, destSortableScope) {
                sourceItemHandleScope.itemScope.modelValue = angular.copy(scope.filter.expressionEntity[sourceItemHandleScope.itemScope.$index]); //overrides the digest cycle of the component, to avoid the component rolling back the changes sent in
                return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
            },
            itemMoved: function() {},
            orderChanged: function() {
                contextEvaluator(); //function call to check the sanity of move if move is successful call success Function in oder changed or fail function in order changed
            }
        };
        var contextEvaluator = function() {
             //checks the parenthesis validity of the expression built
            scope.fnSetQueryValidity(setQueryBoardService.fnValidateExpression(scope.filter.expressionEntity));
            scope.filter.expressionEntity = setQueryBoardService.fnDoContextEvaluation(scope.filter.expressionEntity); // context evaluates the expression
            scope.fnSetQueryValidity(setQueryBoardService.fnValidateExpression(scope.filter.expressionEntity));
        };
        //adds a default operator at the position required
        scope.addOperator = function(pos) {
            var data = {
                'type': ConstantService.SET_QUERY_CONFIG.SET_OPERATION_OPERATOR,
                'name': ConstantService.SET_QUERY_CONFIG.INTERSECTION
            };
            var emptyOperatorItem = {
                'id': ConstantService.GENERATE_SET_ID(),
                'data': data
            };
            scope.filter.expressionEntity.splice(pos, 0, emptyOperatorItem);
        };

        //Function to update filter.expressionEntity with rename, add or delete done in filter.setEntities
        scope.fnUpdate = function() {
            var idNameMap = {}; //will store the setId : name map from filter.setEntities
            var itemsMap = []; //will store the setIds from filter.expressionEntity
            //Will build the idNameMap from filter.setEntities
            angular.forEach(scope.filter.setEntities, function(setEntity) {
                idNameMap[setEntity.setId.toString()] = setEntity.name;
            });
            //Loops through the filter.expressionEntity array
            for (var i = 0; i < scope.filter.expressionEntity.length; i++) {
                if ('setId' in scope.filter.expressionEntity[i].data) { //if the current expressionEntity item is a set
                    if (idNameMap[scope.filter.expressionEntity[i].data.setId.toString()] || idNameMap[scope.filter.expressionEntity[i].data.setId.toString()] === '') {
                        scope.filter.expressionEntity[i].data.name = idNameMap[scope.filter.expressionEntity[i].data.setId.toString()]; //Update the name of the expressionEntity item
                        itemsMap.push(scope.filter.expressionEntity[i].data.setId.toString()); //Update itemsMap with the items setId
                    } else { //if the item's setId is not found in itemsMap, delete it from filter.expressionEntity
                        scope.filter.expressionEntity.splice(i, 1);
                        i--;
                    }
                }
            }
            //Loops theough filter.setEntities, and pushes the items not found in itemsMap to filter.expressionEntity
            angular.forEach(scope.filter.setEntities, function(value) {
                if (itemsMap.indexOf(value.setId.toString()) === -1) {
                    scope.filter.expressionEntity.push(({
                        'id': ConstantService.GENERATE_SET_ID(),
                        'data': {
                            'setId': value.setId,
                            'name': value.name,
                            'isSelected': value.isSelected ? value.isSelected : false,
                            'type': ConstantService.SET_QUERY_CONFIG.SET_OPERATION_OPERAND,
                            'sQLQuery': value.sQLQuery
                        }
                    }));
                }
            });
            scope.filter.expressionEntity = setQueryBoardService.fnDoContextEvaluation(scope.filter.expressionEntity); //context evaluation cycle is triggered
            if (!scope.selectedTab.name.length && scope.filter.setEntities.length>0) { //if no set is selected select the first set
              scope.fnSelectTab(scope.filter.setEntities.length ? scope.filter.setEntities[0].setId : null,scope.filter.setEntities.length ? scope.filter.setEntities[0].name : null);
            }
        };

        //Initialization function called when the setQueryBoard is initialized
        scope.fnInit = function() {
            setQueryBoardService.init(setQueryBoardService.getData(scope.filter), true); //calls the service to get setEntities from filter - QueryBuilderEntity object
            scope.$watch('filter.setEntities', function() {
                scope.fnUpdate();
            }, true);
            scope.$watch('filter.expressionEntity.length', function() {
                scope.fnSetQueryValidity(setQueryBoardService.fnValidateExpression(scope.filter.expressionEntity));
            }, true);
        };

        // call out functionality implementation
        scope.fnCallOut = function(current) {
            var some = $('.dsui-wrapper').children();
            angular.forEach(some, function(item) {
                $(item).find('.dsui-tooltip').hide();
            });
            if (tooltipFlag === false) {
                $(current.element).find('.dsui-no-tooltip').show();
                $('.dsui-callout-btn').fadeIn(function() {
                    tooltipFlag = true;
                });
            }
            if (tooltipFlag === true) {
                $(current.element).find('.dsui-no-tooltip').hide();
                $('.dsui-callout-btn').fadeOut(function() {
                    tooltipFlag = false;
                });
            }
        };

        //assigns the clicked operator to the filter.expressionEntity item selected
        scope.fnSelectOperator = function(operatorType, idx) {
            if(scope.filter.expressionEntity[idx].data.name === ConstantService.SET_QUERY_CONFIG.NULL){
              scope.filter.expressionEntity[idx].data.name = operatorType;
              scope.fnSetQueryValidity(setQueryBoardService.fnValidateExpression(scope.filter.expressionEntity));
            }else{
              scope.filter.expressionEntity[idx].data.name = operatorType;
            }

        };
        //this function adds/removes parenthesis with respect to the operand selected
        scope.fnManageParenthesis = function(selectedOption, operandId, index, isToBeAdded) {
            switch (selectedOption) {
                case ConstantService.SET_QUERY_CONFIG.SET_OPERATION_OPEN_BRACKET:
                    if (isToBeAdded) { //if an opening bracket has to be added before the operand
                        scope.filter.expressionEntity.splice(index, 0, {
                            'id': ConstantService.GENERATE_SET_ID(),
                            'data': scope.parenthesisConfig[0]
                        });
                    } else { //if an opening bracket has to be removed from before the operand
                        if (scope.filter.expressionEntity[index - 1].data.name === ConstantService.SET_QUERY_CONFIG.SET_OPERATION_OPEN_BRACKET) {
                            scope.filter.expressionEntity.splice(index - 1, 1);
                        }
                    }
                    break;
                case ConstantService.SET_QUERY_CONFIG.SET_OPERATION_CLOSE_BRACKET:
                    if (isToBeAdded) { //if an closing bracket has to be added after the operand
                        scope.filter.expressionEntity.splice(index + 1, 0, {
                            'id': ConstantService.GENERATE_SET_ID(),
                            'data': scope.parenthesisConfig[1]
                        });
                    } else { //if an closing bracket has to be removed from after the operand
                        if (scope.filter.expressionEntity[index + 1].data.name === ConstantService.SET_QUERY_CONFIG.SET_OPERATION_CLOSE_BRACKET) {
                            scope.filter.expressionEntity.splice(index + 1, 1);
                        }
                    }
                    break;
                default:
                    break;
            }
        };
        scope.fnInit();
    }]);
