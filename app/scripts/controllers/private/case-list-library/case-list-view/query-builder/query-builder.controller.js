 'use strict';
 /**
  * @ngdoc function
  * @name saintApp.controller.auth:caselist:QueryBuilderController
  * @description
  * # QueryBuilderController
  * Controller of the saintApp
  */
 angular.module('saintApp')
     .controller('QueryBuilderController', ['$scope', '$modal', 'SaintService', '$timeout', 'CaseListQueryService', 'QueryGroupEntity', 'QuerySetEntity', 'CaseListFactory', '$stateParams', 'CaseListEntity', 'QueryRuleEntity', 'DateService', '$filter', 'ConstantService', 'QueryGeneratorService', 'QueryBuilderEntity', 'alertService', 'LanguageService', function(scope, modal, SaintService, $timeout, CaseListQueryService, QueryGroupEntity, QuerySetEntity, CaseListFactory, stateParams, CaseListEntity, QueryRuleEntity, DateService, $filter, ConstantService, QueryGeneratorService, QueryBuilderEntity, alertService, LanguageService) {
         scope.conditionKey = ConstantService.DATA_TYPE;
         scope.operands = [{
             key: 1,
             name: ConstantService.AND
         }, {
             key: 0,
             name: ConstantService.OR
         }];
         scope.dimensions = [];
         scope.operators = [];
         scope.filter = angular.copy(QueryBuilderEntity);
         scope.caseListObject = angular.copy(CaseListEntity);
         scope.isReadOnly = false; /**This Variable Handles Read only and Edit mode of Query Builder*/
         scope.dirtyFlags = SaintService.dirtyFlags;
         scope.dirtyCheckCounter = -1;
         scope.areDateFlagsReady = false;
         scope.selectedTab = {
             setId: null,
             name: ''
         };
         scope.isQueryValid = true;
         scope.isNameInEditMode = false;
         scope.setName = '';

        //set function for the query validity
         scope.fnSetQueryValidity = function(isValid) {
             scope.isQueryValid = isValid;
         };

         //will store name,id of the currently selected tab
         scope.fnSelectTab = function(setId, setName) {
             scope.selectedTab.setId = setId;
             scope.selectedTab.name = setName;
         };

         //function to create a SetEntity object and push it into the filter.setEntites array
         scope.fnAddTab = function() {
             var newSet = angular.copy(QuerySetEntity);
             var newSetNumber = (scope.filter.setEntities.length + 1);
             for (var i = 0; scope.fnCheckIfSetNameExists(ConstantService.SET_QUERY_CONFIG.SET_DEFAULT_QUERY_NAME + ' ' + newSetNumber); i++) {
                 newSetNumber++;
             }
             newSet.name = ConstantService.SET_QUERY_CONFIG.SET_DEFAULT_QUERY_NAME + ' ' + newSetNumber;
             newSet.setId = ConstantService.GENERATE_SET_ID();
             newSet.jSON = angular.copy(QueryGroupEntity);
             if (scope.filter.setEntities[0].jSON.group.source === ConstantService.SOURCE) { //if it has source filter then add the source filter in the new set
                 newSet.jSON.group = scope.getSourceGroupWithoutCustomRules(angular.copy(scope.filter.setEntities[0].jSON.group));
             } else {
                 newSet.jSON.group.groupOperator = angular.copy(scope.operands[0]);
             }
             scope.filter.setEntities.push(newSet);
             scope.fnPopulateQueryBuilder(scope.filter.setEntities[scope.filter.setEntities.length - 1].jSON.group, scope.filter.setEntities[scope.filter.setEntities.length - 1].jSON);
         };

         scope.getSourceGroupWithoutCustomRules = function(groupObject) { //this fucntion removes the custom rules added in the query builder and returns only the source filters
             angular.forEach(groupObject.rules, function(rule) {
                 if (rule.group && rule.group.source !== ConstantService.SOURCE) {
                     rule.group.rules.length = 0;
                 }
             });
             return groupObject;
         };


         //Enabling the tabs and expression evaluation section
         scope.fnSetOperation = function() {
             scope.caseListObject.queryBuilderObject.type = ConstantService.SET_OPERATION_CONTEXT;
             scope.fnSelectTab(scope.filter.setEntities[0].setId, scope.filter.setEntities[0].name);
             scope.filter.setEntities[0].name = scope.filter.setEntities[0].name.length > 0 ? scope.filter.setEntities[0].name : ConstantService.SET_QUERY_CONFIG.SET_DEFAULT_QUERY_NAME + ' 1';
         };

         scope.buildQuerySet = function() {
             //creating a dummy query set array for current implementation
             scope.caseListObject.queryBuilderObject.setEntities.length = 0;
             angular.forEach(scope.filter.setEntities, function(querySet) {
                 scope.caseListObject.queryBuilderObject.setEntities.push(querySet);
             });
             scope.caseListObject.queryBuilderObject.expressionEntity = angular.copy(scope.filter.expressionEntity);
         };

         scope.fnRunQuery = function() {
           var sqlSET = scope.caseListObject.queryBuilderObject ? QueryGeneratorService.computeSQLForSets(scope.filter, scope.caseListObject.sourceQueryUI) : null;
           if(sqlSET && sqlSET.errorType===null) {
             scope.buildQuerySet();
             scope.caseListObject.saveFlag = 1;
             CaseListQueryService.fnUpdateCaseListObj({
               'caseListMode': 1,
               'visualQueryFilterUI': sqlSET ? sqlSET.DisplaySQL : '',
               'queryString': sqlSET ? sqlSET.actualSQL : ''
             });
             scope.caseListObject.asOfDate = scope.caseListData.caseListObject.asOfDate;
             if (scope.caseListObject.reportingStartDate <= scope.caseListObject.reportingEndDate) {
               CaseListQueryService.fnRunQuery(scope.caseListObject);
             } else {
               alertService.warn(LanguageService.MESSAGES.INVALID_REPORT_END_DATE);
             }
           }else if(sqlSET){
             alertService.warn(LanguageService.MESSAGES[sqlSET.errorType.MESSAGE_CODE]);
           }
         };

         //Recursive logic to manually auto-populate the querybuilder according to the json received from the backend
         scope.fnPopulateQueryBuilder = function(group, queryBuilderObject) {
             queryBuilderObject.group = angular.copy(QueryGroupEntity.group);
             queryBuilderObject.group.groupOperator = group.groupOperator;
             queryBuilderObject.group.source = group.source;
             function fnSelectOperator(availableOpe) {
                 if (availableOpe.name === group.rules[i].operator.name && availableOpe.dataType === group.rules[i].operator.dataType) {
                     tempRule.operator = availableOpe;
                 }
             }
             function fnSelectDimension(availableDim) {
                 if (availableDim.columnName === group.rules[i].dimension.columnName) {
                     tempRule.dimension = availableDim;
                 }
             }
             if (group.rules.length) {
                 for (var i = 0; i < group.rules.length; i++) {
                     if (group.rules[i].group) {
                         queryBuilderObject.group.rules.push(angular.copy(QueryGroupEntity));
                         scope.fnPopulateQueryBuilder(group.rules[i].group, queryBuilderObject.group.rules[i]);
                     } else {
                         var tempRule = angular.copy(QueryRuleEntity);
                         angular.forEach(scope.dimensions, fnSelectDimension);
                         angular.forEach(scope.operators, fnSelectOperator);
                         tempRule.value = group.rules[i].value;
                         if (tempRule.operator.dataType === ConstantService.FILTER_DATE_TEXT) {
                             if (tempRule.operator.sQLDisplayName === ConstantService.CASE_LIST_QUERY_EQUALS || tempRule.operator.sQLDisplayName === ConstantService.CASE_LIST_QUERY_DOES_NOT_EQUAL || tempRule.operator.sQLDisplayName === ConstantService.CASE_LIST_QUERY_LT_OR_EQUALS || tempRule.operator.sQLDisplayName === ConstantService.CASE_LIST_QUERY_GT_OR_EQUALS) {
                                 tempRule.valueOperators = new Date(group.rules[i].value);
                                 tempRule.value = DateService.getMillisecondsInUTCTimeZone(tempRule.valueOperators);
                             }
                             if (tempRule.operator.name === ConstantService.CASE_LIST_QUERY_BETWEEN) {
                                 tempRule.value1 = new Date(group.rules[i].value[0]);
                                 tempRule.value2 = new Date(group.rules[i].value[1]);
                             }
                         }
                         tempRule.selectedValues = group.rules[i].selectedValues;
                         queryBuilderObject.group.rules.push(tempRule);
                     }
                 }
             }
         };

         scope.fnRefreshContext = function() {
             if (scope.caseListObject.queryBuilderObject.setEntities.length) {
                 CaseListFactory.getOperatorDimensionInfo(function() {
                     $timeout(function() {
                         scope.operators = CaseListFactory.data.operatorsList;
                         scope.filter = angular.copy(QueryBuilderEntity);
                         scope.filter.expressionEntity = angular.copy(scope.caseListObject.queryBuilderObject.expressionEntity);
                         angular.forEach(scope.caseListObject.queryBuilderObject.setEntities, function(setEntity) {
                             var newSetEntity = angular.copy(QuerySetEntity);
                             newSetEntity.jSON = angular.copy(QueryGroupEntity);
                             newSetEntity.name = setEntity.name;
                             newSetEntity.setId = setEntity.setId ? setEntity.setId : ConstantService.GENERATE_SET_ID();
                             scope.filter.setEntities.push(newSetEntity);
                             scope.fnPopulateQueryBuilder(setEntity.jSON.group, scope.filter.setEntities[scope.caseListObject.queryBuilderObject.setEntities.indexOf(setEntity)].jSON);
                         });
                     }, 500);
                     scope.dirtyCheckCounter = -1;
                     scope.dirtyFlags.QUERY_BUILDER = false;
                 });
             }
         };

         //function to initialize the listener on the setEntites array of the shared caselist object
         scope.fnListenToCaseListObject = function() {
             CaseListQueryService.listen(scope);
         };

         //returns a group for saving into the query library from the query builder
         scope.fnProcessGroup = function(inputGroup) {
             var group = angular.copy(inputGroup);
             if (group.source === ConstantService.SOURCE) {
                 for (var i = 0; i < group.rules.length; i++) {
                     if (!group.rules[i].group) {
                         //copies the licenses/products/ingredients selected from the reference to the group to be returned
                         if (group.rules[i].dimension.columnName === ConstantService.PRODUCT_COLUMN_NAME || group.rules[i].dimension.columnName === ConstantService.LICENSE_COLUMN_NAME) {
                             group.rules[i].selectedValues = scope.caseListObject.selectedLicProd.selectedValues;
                         } else if (group.rules[i].dimension.columnName === ConstantService.INGREDIENT_COLUMN_NAME) {
                             group.rules[i].selectedValues = scope.caseListObject.selectedIngredients.selectedValues;
                         }
                     } else {
                         if (group.rules[i].group.source === ConstantService.SOURCE) {
                             for (var j = 0; j < group.rules[i].group.rules.length; j++) {
                                 //copies the report start date and end date into the receipt date rules of the group
                                 if (group.rules[i].group.rules[j].operator.dataType === ConstantService.CASE_LIST_QUERY_DATA_TYPE_DATE) {
                                     group.rules[i].group.rules[j].value1 = DateService.getMillisecondsInUTCTimeZone(scope.caseListObject.reportingStartDate);
                                     group.rules[i].group.rules[j].value2 = DateService.getMillisecondsInUTCTimeZone(scope.caseListObject.reportingEndDate);
                                 }
                             }
                             //clears the source attributes for the dates group
                             group.rules[i].group.source = '';
                         }
                     }
                 }
                 //clears the source attribute of the source group
                 group.source = '';
             }
             return group;
         };
         //initializes scope.filter contents
         scope.fnInitFilter = function() {
             var setEntity = angular.copy(QuerySetEntity);
             setEntity.jSON = angular.copy(QueryGroupEntity);
             setEntity.setId = ConstantService.GENERATE_SET_ID();
             setEntity.jSON.group.groupOperator = angular.copy(scope.operands[0]);
             scope.filter.setEntities.push(setEntity);
         };
         //opens the delete confirmation modal
         scope.fnConfirmDeleteQuerySet = function() {
             angular.element('#dsui-confirm-set-delete').modal('show');
         };
         //closes the delete confirmation modal
         scope.fnConfirmDeleteQuerySetCancel = function() {
             angular.element('#dsui-confirm-set-delete').modal('hide');
         };
         //on confirmation, deletes the current query set
         scope.fnDeleteQuerySet = function(setId) {
             if (scope.filter.setEntities.length > 1) {
                 for (var i = 0; i < scope.filter.setEntities.length; i++) {
                     if (scope.filter.setEntities[i].setId === setId) {
                         scope.filter.setEntities.splice(i, 1);
                         scope.fnSelectTab(scope.filter.setEntities[i - 1 > 0 ? (i - 1) : 0].setId, scope.filter.setEntities[i - 1 > 0 ? (i - 1) : 0].name);
                         scope.fnConfirmDeleteQuerySetCancel();
                     }
                 }
             }
         };

         //open modal for save query
         scope.fnOpenSaveQueryModal = function(recieveGroup) {
             var queryGroup = angular.copy(recieveGroup);
             scope.$broadcast('SEND_THE_QUERYGROUP_SAVEQUERY', scope.fnProcessGroup(queryGroup));
         };

         //increments the dirtyCheck counter
         scope.fnIncrementDirtyCheckCounter = function (){
             scope.dirtyCheckCounter++;
             if(scope.dirtyCheckCounter>0){
                scope.dirtyFlags.QUERY_BUILDER = true;
             }
         };

         //initialization function for the case list query-builder
         scope.fnInit = function() {
             scope.$on('OPEN_THE_INSERT_QUERY_MODAL', function(event, queryGroup) {
                 scope.$broadcast('SEND_THE_QUERYGROUP', queryGroup);
             });
             scope.caseListObject = CaseListQueryService.fnGetCaseListObj();
             CaseListFactory.getOperatorDimensionInfo(function() {
                 scope.operators = CaseListFactory.data.operatorsList;
                 scope.dimensions = CaseListFactory.data.dimensionsList;
                 if (!scope.caseListObject.queryBuilderObject.setEntities.length) {
                     scope.fnInitFilter();
                 }
             });

             //initializing the watchers to watch for a change on the query builder
             /*scope.$watchGroup(['filter.setEntities','filter.type','caseListObject.selectedLicProd.selectedValues.length','caseListObject.selectedIngredients.selectedValues.length'], function (oldValue,newValue) {
               if(JSON.stringify(oldValue)!==JSON.stringify(newValue)){
                 scope.fnIncrementDirtyCheckCounter();
               }
             }, true);
             scope.$watchGroup(['caseListObject.reportingStartDate','caseListObject.reportingEndDate'], function (oldValue,newValue) {
               if(JSON.stringify(oldValue)!==JSON.stringify(newValue)){
                 scope.fnIncrementDirtyCheckCounter();
               }
             }, true);
             scope.$watch('filter.expressionEntity', function (oldValue,newValue) {
               if((JSON.stringify(oldValue)!==JSON.stringify(newValue)) && scope.dirtyCheckCounter>=0){
                 scope.fnIncrementDirtyCheckCounter();
               }
             }, true);*/
             scope.fnListenToCaseListObject();
             scope.caseListObject.baseCaseListKey = stateParams.id;
         };
         //Check if the set name already exists
         scope.fnCheckIfSetNameExists = function(name, setId) {
             var doesNameExist = false;
             angular.forEach(scope.filter.setEntities, function(set) {
                 if (setId !== undefined && setId !== null) {
                     if (set.name === name && set.setId !== setId) {
                         doesNameExist = true;
                     }
                 } else {
                     if (set.name === name) {
                         doesNameExist = true;
                     }
                 }
             });
             return doesNameExist;
         };
         //This function is for renaming the tab
         scope.fnTitleRename = function(val, data, setReference, name) {
             if (val) {
                 scope.isNameInEditMode = true;
             } else {
                 scope.isNameInEditMode = false;
                 if (!scope.fnCheckIfSetNameExists(name, setReference.setId) && name.length > 0) {
                     setReference.name = name;
                 } else {
                     alertService.warn(LanguageService.MESSAGES.FAILED_RENAME_SET_SAME_NAME);
                 }
             }
         };
         //function to clear the current set selected by the user i.e Clear All interaction
         scope.fnClearCurrentSet = function() {
             angular.forEach(scope.filter.setEntities, function(setEntity) {
                 if (setEntity.setId === scope.selectedTab.setId) {
                     if (setEntity.jSON.group.source === ConstantService.SOURCE) {
                         angular.forEach(setEntity.jSON.group.rules, function(sourceGroupRule) {
                             if (sourceGroupRule.group && sourceGroupRule.group.source !== ConstantService.SOURCE) {
                                 sourceGroupRule.group.rules.length = 0;
                             }
                         });
                     } else {
                         setEntity.jSON.group.rules.length = 0;
                     }
                 }
             });
         };
         scope.fnInit();
     }]);
