'use strict';
angular.module('saintApp').service('CaseListQueryService',[ 'CaseListFactory','DateService','ConstantService', 'LanguageService', '$filter', 'QueryBuilderEntity','setQueryBoard', function ( CaseListFactory,DateService, ConstantService, LanguageService, $filter, QueryBuilderEntity, SetQueryBoardService ) {
  var caseListQuery = function (data) {
    angular.extend(this, data);
  };
  caseListQuery.computePayload = function(caseList) {
    var reportProductsLicense = [], caseListObj = CaseListFactory.data.caseListObject;
    if(caseListObj.productLicenseOption===ConstantService.PRODUCT_BASED_SELECTION){
      reportProductsLicense = caseListObj.payloadProduct && caseListObj.payloadProduct.length > 0?caseListObj.payloadProduct : [];
    }else{
      reportProductsLicense = caseListObj.payloadLicense && caseListObj.payloadLicense.length > 0?caseListObj.payloadLicense: [];
    }
    var payload = {
      'data': {
        'baseCase': {
          'BCL_KEY': caseList.baseCaseListKey,
          'USER_KEY': null,
          'BCL_NAME': caseListObj.caseListName,
          'DESCRIPTION': caseListObj.description,
          'CASES_COUNT': caseListObj.casesCount,
          'IS_LOCKED': caseListObj.isLocked,
          'Audit.CreatedBy': null,//CaseListFactory.data.caseListObject.createdBy,
          'Audit.CreatedDt': null,//DateService.getMillisecondsInUTCTimeZone(CaseListFactory.data.caseListObject.createdDate),
          'Audit.UpdatedBy': null,//CaseListFactory.data.caseListObject.updatedBy,
          'Audit.UpdatedDt': null,//DateService.getMillisecondsInUTCTimeZone(CaseListFactory.data.caseListObject.updatedDate),
          'IS_CCL': caseListObj.isCCL, //Fixme: To be removed
          'QRY_FILTER': caseListObj.queryFilter,
          'ALL_DATES_FLAG': caseListObj.allDatesFlag? 1: 0,
          'RPT_START_DATE': caseListObj.reportingStartDate?DateService.getMillisecondsInUTCTimeZone(new Date(caseListObj.reportingStartDate)):null,
          'RPT_END_DATE': caseListObj.reportingEndDate?DateService.getMillisecondsInUTCTimeZone(new Date(caseListObj.reportingEndDate)):null,
          'AS_OF_DATE': caseList.asOfDate?DateService.getMillisecondsInUTCTimeZone(new Date(caseList.asOfDate)):null,
          'SUBMISSION_DUE_DATE': caseListObj.submissionDueDate?DateService.getMillisecondsInUTCTimeZone(new Date(caseListObj.submissionDueDate)):null,
          'NS_MEDWATCH_RPTS_FLAG': caseListObj.nsMedwatchReportsFlag? 1: 0,
          'CASES_NT_PRE_RPTD_FLAG': caseListObj.casesNtPreRptdFlag? 1: 0,
          'EVENT_RCPT_DT_FLAG': caseListObj.reportingStartDate?caseListObj.eventReceiptDate? 1: 0:null,
          'INITIAL_RCPT_DT_FLAG': caseListObj.reportingStartDate?caseListObj.initialReceiptDate? 1: 0:null,
          'FOLLOWUP_RCPT_DT_FLAG': caseListObj.reportingStartDate?caseListObj.followupReceiptDate? 1: 0:null,
          'ICSR_SUBMISSION_DT_FLAG': caseListObj.iCSRSubmissionDate? 1: 0,
          'OTHER_DT_FLAG': caseListObj.otherDateFlag? 1: 0,
          'SIGNAL_COMP_START_DATE': caseListObj.signalCompStartDate?DateService.getMillisecondsInUTCTimeZone(new Date(caseListObj.signalCompStartDate)): null,
          'SIGNAL_COMP_END_DATE': caseListObj.signalCompEndDate?DateService.getMillisecondsInUTCTimeZone(new Date(caseListObj.signalCompEndDate)): null,
          'SIGNAL_CUML_START_DATE': caseListObj.signalCumlStartDate?DateService.getMillisecondsInUTCTimeZone(new Date(caseListObj.signalCumlStartDate)): null,
          'SIGNAL_CUML_END_DATE': caseListObj.signalCumlEndDate?DateService.getMillisecondsInUTCTimeZone(new Date(caseListObj.signalCumlEndDate)): null,
          'SIGNAL_THRESHOLD': caseListObj.signalThreshold,
          'SIGNAL_DENOM_CASE_FLAG': caseListObj.signalDenomCaseFlag? 1: 0,
          'SIGNAL_DENOM_OTHER_FLAG': caseListObj.signalDenomOtherFlag? 1: 0,
          'SIGNAL_DENOMINATOR': caseListObj.signalDenominator,
          'ROUTED_DT_FLAG': caseListObj.routedDateFlag? 1: 0,
          'CASE_COMPLETION_DT_FLAG': caseListObj.caseCompletionDateFlag? 1: 0,
          'FK_COMP_PERIOD_KEY': caseListObj.comparatorPeriodKey,
          'COMP_PERIOD_KEY': null,
          'PRODUCT_LICENSE_OPTION': caseListObj.productLicenseOption,
          'RUN_TIME': caseListObj.runTime?DateService.getMillisecondsInUTCTimeZone(new Date(caseListObj.runTime)):null,
          'RUN_DATE': caseListObj.runDate?DateService.getMillisecondsInUTCTimeZone(new Date(caseListObj.runDate)):null,
          'BCL_DISPLAY_NAME': caseListObj.caseListDisplayName,
          'QRY_FILTER_UI': caseListObj.queryFilterUI,
          'SRC_QRY_FILTER_UI': caseListObj.sourceQueryUI,
          'RPT_KEY': caseListObj.reportKey,
          'VISUAL_QRY_FILTER_UI': caseListObj.visualQueryFilterUI,
          'QUERY_STRING': caseListObj.queryString,
          'JSON_VALUE': ''
        },
        'reportProducts': reportProductsLicense,
        'mode': {
          'saveFlag': caseList.saveFlag !== undefined? caseList.saveFlag:1,
          'caselistFlowFlag' : !caseListObj.reportKey? 1: 0
        }
      }
    };
    if(caseList.selectedLicProd){
      payload.data.reportProducts.length = 0;
      angular.forEach(caseList.selectedLicProd.selectedValues, function(selectedLicProd){
        payload.data.reportProducts.push({
          'RPT_PRODUCT_KEY': null,
          'FK_USER_KEY': null,
          'FK_BCL_KEY': caseList.baseCaseListKey,
          'FK_FAMILY_CODE': selectedLicProd.code?selectedLicProd.code:null,
          'FK_PRODUCT_KEY': (caseListObj.productLicenseOption===ConstantService.PRODUCT_BASED_SELECTION?selectedLicProd.id:null),
          'FK_LICENSE_KEY': (caseListObj.productLicenseOption===ConstantService.PRODUCT_BASED_SELECTION?null:selectedLicProd.id),
          'TRADE_NAME': null,
          'LIC_NUMBER': null,
          'FORMULATION_DESC': null,
          'FAMILY_DESC': null
        });
      });
    }
    //build the case-list name
    if(caseList.saveFlag === 0  && caseList.selectedIngredients && caseList.selectedIngredients.selectedValues.length){
      var baseCaseListName = '';
      if(caseList.reportTypeName.length>0){
        baseCaseListName += caseList.reportTypeName + '_';
      }
      angular.forEach(caseList.selectedIngredients.selectedValues, function(selectedIngredient){
        baseCaseListName+=selectedIngredient.name;
        if(caseList.selectedIngredients.selectedValues.indexOf(selectedIngredient)<(caseList.selectedIngredients.selectedValues.length-1)){
          baseCaseListName+='_';
        }
      });
      if (angular.isDate(caseListObj.reportingStartDate) && angular.isDate(caseListObj.reportingEndDate)) {

        baseCaseListName += '_' + $filter('date')(caseListObj.reportingStartDate, 'd-MMM-yyyy') + '-' + $filter('date')(caseListObj.reportingEndDate, 'd-MMM-yyyy');
      }else if(caseListObj.allDatesFlag){
        baseCaseListName += ConstantService.ALL_DATES;
      }
      payload.data.baseCase.BCL_DISPLAY_NAME = baseCaseListName;
      var description=caseListObj.description?'_'+caseListObj.description:'';
      baseCaseListName+=description;
      payload.data.baseCase.BCL_NAME = baseCaseListName;
    }
    var setQuery = angular.copy(QueryBuilderEntity);
    setQuery.type = caseListObj.queryBuilderObject.type;
    setQuery.expressionEntity = caseListObj.queryBuilderObject.expressionEntity;
    var querySets = caseList.queryBuilderObject.setEntities;
    //repeat the following for each query set
    angular.forEach(querySets, function(querySet){
      if (!querySet.jSON.group){
        //do nothing if group isn't present
      }
      else if (querySet.jSON.group.source === ConstantService.SOURCE){
        //create the basecase json with the source group
        angular.forEach(querySet.jSON.group.rules, function(sourceSubGroup){
          if(sourceSubGroup.group && sourceSubGroup.group.source!== ConstantService.SOURCE){
            setQuery.setEntities.push({
              'name': querySet.name,
              'sQLQuery': querySet.sQLQuery, // Actual SQL Query
              'jSON': sourceSubGroup, // JSON Data
              'setId': querySet.setId
            });
          }
        });
      }
      else {
        setQuery.setEntities.push(querySet);
      }
    });
    payload.data.baseCase.JSON_VALUE = JSON.stringify(setQuery);
    return payload;
  };

  caseListQuery.fnGetCaseListObj = function (){
    return CaseListFactory.data.caseListObject;
  };

  caseListQuery.fnUpdateCaseListObj = function (caseListObjectDelta){
    angular.forEach(caseListObjectDelta, function(value,key){
      CaseListFactory.data.caseListObject[key] = caseListObjectDelta[key];
    });
  };

  caseListQuery.fnRunQuery = function (caseListObject){
    CaseListFactory.fnUpdateCaseList(caseListQuery.computePayload(caseListObject)).then(function(){});
  };

  caseListQuery.listen = function($scope) {
    $scope.$watchCollection(function(){return CaseListFactory.data.caseListObject.queryBuilderObject.setEntities;},function(){
      $scope.fnRefreshContext();
    }, true);
  };

  caseListQuery.getIncludeExcludeCountQuery = function (){
    var caseListObject = CaseListFactory.data.caseListObject;
    var includedCount = caseListObject?caseListObject.added:0;
    var excludedCount = caseListObject?caseListObject.removed:0;
    var includeQuery='<b>'+ConstantService.CASE_LIST_QUERY_MANUALLY+ '</b> <b>'+ConstantService.CASE_LIST_QUERY_INCLUDES.toUpperCase()+'</b> '+includedCount+' '+ConstantService.CASE_LIST_QUERY_CASES;
    var excludeQuery='<b>'+ConstantService.CASE_LIST_QUERY_MANUALLY+ '</b> <b> '+ConstantService.CASE_LIST_QUERY_EXCLUDES+' '+excludedCount+'</b> '+ConstantService.CASE_LIST_QUERY_CASES;
    return ' ' +includeQuery+', '+excludeQuery;
  };

  caseListQuery.setExpressionEntity = function (){
    var caseListObj = CaseListFactory.data.caseListObject;
    var expressionEntity = caseListObj.queryBuilderObject.expressionEntity;
    SetQueryBoardService.init(SetQueryBoardService.getData(caseListObj.queryBuilderObject), true);
    if (expressionEntity.length < 1) {
      SetQueryBoardService.init(SetQueryBoardService.getData(caseListObj.queryBuilderObject), false);
      expressionEntity = [];
      expressionEntity.push(({
          'id': ConstantService.GENERATE_SET_ID(),
          'data': {
              'setId': caseListObj.queryBuilderObject.setEntities[0].setId,
              'name': caseListObj.queryBuilderObject.setEntities[0].name,
              'isSelected': caseListObj.queryBuilderObject.setEntities[0].isSelected ? caseListObj.queryBuilderObject.setEntities[0].isSelected : false,
              'type': ConstantService.SET_QUERY_CONFIG.SET_OPERATION_OPERAND,
              'sQLQuery': caseListObj.queryBuilderObject.setEntities[0].sQLQuery
          }
      }));
    }
    caseListObj.queryBuilderObject.expressionEntity = expressionEntity;
  };

  return caseListQuery;
}]);
