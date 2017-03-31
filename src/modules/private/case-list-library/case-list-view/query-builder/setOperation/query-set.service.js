'use strict';
angular.module('saintApp')
    .factory('setQueryBoard', ['ConstantService', function(ConstantService) {
        var data;
        var configuration = ConstantService.SET_QUERY_CONFIG.SETS_CONFIGURATION;
        return {
            //initialization function of the service to retrieve the data from the inputs provided
            init: function(setOperationData, reset) {
                if (reset) {
                    data = setOperationData;
                } else {
                    data.query = setOperationData.query;
                }
                return configuration.SUCCESSFULLY_REFRESHED;
            },
            //context evaluation function, based on a few rulesets, cleanses the expressionEntity array
            fnDoContextEvaluation: function(arr) {
                var arrCpy = angular.copy(arr);
                var itemType = null,
                    nextItemType = null;
                var itemName = null,
                    nextItemName = null;
                for (var i = 0; i < arrCpy.length; i++) {
                    itemType = arrCpy[i].data.type;
                    nextItemType = arrCpy[i + 1] ? arrCpy[i + 1].data.type : null;
                    itemName = arrCpy[i].data.name;
                    nextItemName = arrCpy[i + 1] ? arrCpy[i + 1].data.name : null;
                    switch (itemType) {
                        case ConstantService.SET_QUERY_CONFIG.SET_OPERATION_OPERAND:
                            if (nextItemType === ConstantService.SET_QUERY_CONFIG.SET_OPERATION_OPERAND) {
                                arrCpy.splice(i + 1, 0, this.getDefaultOperator());
                            }
                            break;
                        case ConstantService.SET_QUERY_CONFIG.SET_OPERATION_BRACKET:
                            switch (itemName) {
                                case ConstantService.SET_QUERY_CONFIG.SET_OPERATION_OPEN_BRACKET:
                                    if (nextItemType === ConstantService.SET_QUERY_CONFIG.SET_OPERATION_OPERATOR) {
                                        arrCpy.splice(i + 1, 1);
                                    }else if(nextItemName === ConstantService.SET_QUERY_CONFIG.SET_OPERATION_CLOSE_BRACKET){
                                        arrCpy.splice(i, 2);
                                        i--;
                                    }
                                    break;
                                case ConstantService.SET_QUERY_CONFIG.SET_OPERATION_CLOSE_BRACKET:
                                    if (nextItemType === ConstantService.SET_QUERY_CONFIG.SET_OPERATION_OPERAND || nextItemName === ConstantService.SET_QUERY_CONFIG.SET_OPERATION_OPEN_BRACKET) {
                                        arrCpy.splice(i + 1, 0, this.getDefaultOperator());
                                    }
                                    break;
                            }
                            break;
                        case ConstantService.SET_QUERY_CONFIG.SET_OPERATION_OPERATOR:
                            if (nextItemType === ConstantService.SET_QUERY_CONFIG.SET_OPERATION_OPERATOR || nextItemName === ConstantService.SET_QUERY_CONFIG.SET_OPERATION_CLOSE_BRACKET || nextItemType === null || i === 0) {
                                arrCpy.splice(i, 1);
                                i--;
                            }
                            break;
                    }
                }
                return arrCpy;
            },
            //returns the default operator to be inserted into the expressionEntity array
            getDefaultOperator: function() {
                return {
                    'id': ConstantService.GENERATE_SET_ID(),
                    'data': {
                        'name': ConstantService.SET_QUERY_CONFIG.NULL,
                        'type': ConstantService.SET_QUERY_CONFIG.SET_OPERATION_OPERATOR
                    }
                };
            },
            //checks if each opening bracket in the expression has a corresponding closing bracket and also checks if any empty operators are present
            fnValidateExpression: function(arr) {
                var depth = 0;
                for (var i = 0; i < arr.length; i++) {
                    if(arr[i].data.name === ConstantService.SET_QUERY_CONFIG.NULL){
                      return false;
                    }
                    if (arr[i].data.name === ConstantService.SET_QUERY_CONFIG.SET_OPERATION_OPEN_BRACKET) {
                        depth++; //if an opening bracket is encountered, increments the counter
                    } else if (arr[i].data.name === ConstantService.SET_QUERY_CONFIG.SET_OPERATION_CLOSE_BRACKET) {
                        depth--; //if a closing bracket is encountered, decrements the counter
                    }
                    if (depth < 0) {
                        return false;
                    }
                }
                if (depth > 0) {
                    return false;
                }
                return true;
            },
            //gets the data from the reference provided and returns the array of type QueryBuilderObject.expressionEntity
            getData: function(reference) {
                var expressionEntityArray = _.map(reference.setEntities, function(querySet) {
                    return {
                        'setId': querySet.setId,
                        'name': querySet.name,
                        'isSelected': querySet.isSelected ? querySet.isSelected : false,
                        'type': ConstantService.SET_QUERY_CONFIG.SET_OPERATION_OPERAND,
                        'sQLQuery': querySet.sQLQuery
                    };
                });
                return {
                    'query': expressionEntityArray
                };
            }
        };
    }]);
