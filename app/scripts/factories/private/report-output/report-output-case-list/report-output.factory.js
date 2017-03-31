'use strict';
angular.module('saintApp').factory('ReportOutputFactory', ['PreferencesFactory', '$http', '$q', 'UrlService', 'alertService', 'LanguageService', 'CaseListEntity', 'ConstantService', 'QueryOperatorEntity', 'QueryDimensionEntity', 'DateService', 'QueryGroupEntity', 'QueryRuleEntity', 'QuerySetEntity', function (PreferencesFactory, $http, $q, UrlService, alertService, LanguageService, CaseListEntity, ConstantService, QueryOperatorEntity, QueryDimensionEntity, DateService, QueryGroupEntity, QueryRuleEntity, QuerySetEntity) {

  var reportOutput = function (data) {
    angular.extend(this, data);
  };
  reportOutput.data = {
    caseListLib: [],
    checkedDateBoxes: [],
    selectedFilters: [],
    operatorInfo: [],
    selectedCaseListKey: null,
    caseListSort: {
      sortedBy: null,
      sortedByName: null,
      sortOrder: null,
      secondarySort: null
    },
    countries: [],
    excludeInclude: false,
    updateQueryString: false,
    chartSelected: null,
    selectedChartsList: [],
    clickedChart: null,
    caseListObject: angular.copy(CaseListEntity),
    updateQuerySet: [],
    asOfDate: null,
    dimensionsList: [],
    operatorsList: [],
    checkServiceCount: 0,
    pageMode: null,
    attachCaseListData : {'bclName':null,'bclKey':null},
    isReadyToAttach:false
  };

  /**
   *
   * @param url Web Service url to get the data.
   * @returns {promise}
   * @description This method is used to get the data for tile panel in case list library.
   */
  reportOutput.getCaseListData = function (url) {
    var deferred = $q.defer();
    $http.get(url).success(function (response) {
      try {
        var caseListResponse = angular.copy(response.d.results);
        var mappedCaseList = [];
        var tempCaseList = [];
        var totalRecords = response.d.__count;
        angular.forEach(caseListResponse, function (value, key) {
          tempCaseList[key] = angular.copy(CaseListEntity);
          tempCaseList[key].reportKey=value.RPT_KEY;
          tempCaseList[key].caseId = value.ID;
          /* jshint ignore:start */
          tempCaseList[key].createdBy= value.Audit_CreatedBy;
          /* jshint ignore:end */
          tempCaseList[key].baseCaseListKey = value.BCL_KEY;
          tempCaseList[key].caseListName = value.BCL_NAME;
          tempCaseList[key].caseListDisplayName = value.BCL_DISPLAY_NAME;
          tempCaseList[key].description = value.DESCRIPTION;
          tempCaseList[key].reportingStartDate = value.RPT_START_DATE;
          tempCaseList[key].reportingEndDate = value.RPT_END_DATE;
          tempCaseList[key].creationDate = value[ConstantService.AUDIT_CREATEDDT];
          tempCaseList[key].sourceCasesCount = (value.CASES_COUNT) ? value.CASES_COUNT : 0;
          tempCaseList[key].caseNumber = value.CASE_NUMBER;
          tempCaseList[key].isLocked = value.IS_LOCKED;
          tempCaseList[key].isShared = (value.IS_SHARED) ? true : false;
          mappedCaseList.push(tempCaseList[key]);
        });
        reportOutput.data.caseListLib = mappedCaseList;
        deferred.resolve({'data': mappedCaseList, 'count': totalRecords, 'message': ''});
      } catch (e) {
        alertService.warn(LanguageService.MESSAGES.FAILED_TO_GET_CASE_LISTS);
        deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_TO_GET_CASE_LISTS});
      }
    }).error(function () {
      alertService.warn(LanguageService.MESSAGES.FAILED_TO_GET_CASE_LISTS);
      deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_TO_GET_CASE_LISTS});
    });
    return deferred.promise;
  };
  /**
   *
   * @param param Config Type to filter the configuration received, It can be either Filter Or Sort
   * @returns {*}
   * @description This method is to get the configuration for filter and sort panel for caselist library page.
   */
  reportOutput.getConfig = function (param) {
    var deferred = $q.defer();
    var queryParams = {$filter: 'CONFIG_TYPE eq \'' + param + '\' and SCREEN_NAME eq \'CASELIST_LIBRARY\' and VALUE eq 1'};
    var url = UrlService.getService('REPORT_FILTER_CONFIGURATION', queryParams);
    $http.get(url)
      .success(function (response) {
        try {
          var filterConfig = [];
          _.each(response.d.results, function (object) {
            var actualObject = angular.copy(CaseListEntity);
            actualObject.filterName = object.KEY;
            actualObject.configKey = object.CONFIG_KEY;
            actualObject.searchActive = true;
            actualObject.filterType = object.KEY_TYPE || null;
            actualObject.columnName = object.KEY_NAME;
            actualObject.primarySort = object.PRIMARY_SORT;
            actualObject.secondarySort = object.SECONDARY_SORT;
            filterConfig.push(actualObject);
          });
          deferred.resolve({'data': filterConfig, 'message': ''});
        } catch (e) {
          alertService.warn(LanguageService.MESSAGES.FAILED_TO_GET_CASELIST_CONFIGURATION);
          deferred.resolve({
            'error': 'ok',
            'message': LanguageService.MESSAGES.FAILED_TO_GET_CASELIST_CONFIGURATION
          });
        }
      })
      .error(function () {
        alertService.error(LanguageService.MESSAGES.FAILED_TO_GET_CASELIST_CONFIGURATION);
        deferred.resolve({
          'error': 'ok',
          'message': LanguageService.MESSAGES.FAILED_TO_GET_REPORT_FILTER_CONFIGURATION
        });
      });
    return deferred.promise;
  };
  /**
   *
   * @param queryParams
   * @param key
   * @returns {*}
   * @description This function gets all the contents of a particular filter configuration.
   */
  reportOutput.getFilterContent = function (queryParams, key) {
    var deferred = $q.defer();
    var odataURL = UrlService.getService('GET_CASE_LIST_LIBRARY', queryParams);
    $http.get(odataURL)
      .success(function (response) {
        var res = response.d.results, filterList = angular.copy(CaseListEntity);
        _.each(res, function (list) {
          filterList.contents.push(list[key]);
        });
        deferred.resolve({'data': filterList});
      })
      .error(function () {
        deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_TO_GET_CASELIST_FILTER_CONTENT});
      });
    return deferred.promise;
  };

  reportOutput.getSelectedCaseListDetails = function (baseCaseKey) {
    var deferred = $q.defer();
    var url = UrlService.getService('CASENAME_FILTERQUERY') + baseCaseKey + ')/Results' + '?$select=BCL_KEY,BCL_NAME,AS_OF_DATE';
    $http.get(url).success(function (response) {
      try {
        if(!response.error) {
          var caseListResponse = response.d.results;
          var selectedCaseListObj = _.findWhere(caseListResponse, {'BCL_KEY': parseInt(baseCaseKey) || 0});
          var actualObject = reportOutput.data.caseListObject;
          if (selectedCaseListObj) {
            actualObject.caseListName = selectedCaseListObj.BCL_NAME;
            actualObject.baseCaseListKey = selectedCaseListObj.BCL_KEY;
            actualObject.asOfDate = DateService.getDateObjectFromBackendDateString(selectedCaseListObj.AS_OF_DATE);
          }
          deferred.resolve({'data': actualObject, 'message': ''});
        }
      } catch (e) {
        alertService.warn(LanguageService.MESSAGES.FAILED_TO_GET_CASE_LISTS);
        deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_TO_GET_CASE_LISTS});
      }
    }).error(function () {
      alertService.warn(LanguageService.MESSAGES.FAILED_TO_GET_CASE_LISTS);
      deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_TO_GET_CASE_LISTS});
    });
    return deferred.promise;
  };
  reportOutput.prepareSelectedChartsList = function (rules) {
    _.each(rules, function (rule) {
      if (rule.dimension && rule.dimension.columnName) {
        var selContents = rule.selectedValues && rule.selectedValues.length > 0 ? rule.selectedValues : [rule.value];
        reportOutput.data.selectedChartsList.push({
          columnName: rule.dimension.columnName,
          name: rule.dimension.displayName,
          contents: selContents,
          operator: rule.operator
        });
        reportOutput.data.selectedChartsList.updateDB = false;
      }
    });
  };
  reportOutput.callSetQueryMapping = function (setQueries) {  //parse setQuery coming from CaseListMangement service to querySets in case-list-entity-service
    var sourceGroupEntity = reportOutput.getSourceGroup(); // get the source group from the source filters
    reportOutput.data.selectedChartsList = [];
    reportOutput.data.caseListObject.queryBuilderObject.setEntities.length=0;
    for (var index in setQueries) {  //Refer to QuerySetEntity to build the similar structure
      var setQuery = setQueries[index];
      var querySet = angular.copy(QuerySetEntity);
      querySet.name = setQuery.name.length>0?setQuery.name:ConstantService.SET_DEFAULT_SAVED_QUERY_NAME;
      querySet.setId = setQuery.setId?setQuery.setId:ConstantService.GENERATE_SET_ID();
      querySet.sQLQuery = setQuery.sQLQuery;
      var querySetjSON;
      if (sourceGroupEntity.group.rules.length > 0 && sourceGroupEntity.group.rules[0].group && sourceGroupEntity.group.rules[0].group.rules.length === 0) {
        querySet.jSON = setQuery.jSON;
        querySetjSON = querySet.jSON;
      } else {
        querySet.jSON = angular.copy(sourceGroupEntity);
        querySetjSON = setQuery.jSON;
        if (querySetjSON.group.rules.length > 0) {
          querySet.jSON.group.rules.push(querySetjSON);
        } else {
          querySet.jSON.group.rules.push(QueryGroupEntity);
        }
      }
      var rules = querySetjSON.group ? querySetjSON.group.rules : querySetjSON.rules;
      if (rules && rules.length > 0) {
        reportOutput.prepareSelectedChartsList(rules);
      }
      reportOutput.data.caseListObject.queryBuilderObject.setEntities.push(querySet);
      reportOutput.data.updateQuerySet.push(querySet);
    }
  };
  reportOutput.createQuerySetsForSourceFilters = function () {
    var sourceGroupEntity = reportOutput.getSourceGroup();
    var querySet = angular.copy(QuerySetEntity);
    querySet.name = querySet.name.length?querySet.name:ConstantService.SET_DEFAULT_SAVED_QUERY_NAME;
    querySet.sQLQuery = '';
    querySet.setId = ConstantService.GENERATE_SET_ID();
    querySet.jSON = angular.copy(sourceGroupEntity);
    querySet.jSON.group.rules.push(QueryGroupEntity);
    reportOutput.data.caseListObject.queryBuilderObject.setEntities.push(querySet);
    reportOutput.data.updateQuerySet.push(querySet);
  };
  reportOutput.getDimensionObject = function (columnName) {
    var result = reportOutput.data.dimensionsList.filter(function (o) {
      return o.columnName === columnName;
    });
    return result ? result[0] : null; // or undefined
  };
  reportOutput.getSourceGroup = function () { //build and return source group as a group entity
    var sourceGroupEntity = angular.copy(QueryGroupEntity.group);
    sourceGroupEntity.groupOperator = {key: ConstantService.ONE_KEY, name:ConstantService.AND };
    sourceGroupEntity.source = ConstantService.SOURCE;
    sourceGroupEntity.rules.length = 0;
    //late case indicator --parked for now --@Shrey uncommnet and modify accordingly once its ready
    /* var lateCaseRuleEntity = angular.copy(QueryRuleEntity);   //
     var lateCaseDimensionEntity = angular.copy(QueryDimensionEntity);
     var lateCaseOperatorEntity = angular.copy(QueryOperatorEntity);
     lateCaseDimensionEntity.columnName = 'D_late_CASE_INDIC';

     lateCaseDimensionEntity.dataType = 'NUMERIC';
     lateCaseDimensionEntity.isLOV = 1;
     lateCaseOperatorEntity.dataType='NUMERIC';
     lateCaseOperatorEntity.sQLDisplayName = 'equal';
     lateCaseOperatorEntity.sQLValue = '=';
     lateCaseRuleEntity.operator = lateCaseOperatorEntity;
     lateCaseRuleEntity.dimension = lateCaseDimensionEntity;
     lateCaseRuleEntity.value = ["YES"];
     sourceGroupEntity.rules.push(lateCaseRuleEntity);*/
    //check if products exists
    if (reportOutput.data.caseListObject.products.length > 0) {  //adding product for sorce filter
      var productRuleEntity = angular.copy(QueryRuleEntity);
      var productDimensionEntity = reportOutput.getDimensionObject(LanguageService.CONSTANTS.PRODUCTCOLNAME);
      var productOperatorEntity = angular.copy(QueryOperatorEntity);
      productOperatorEntity.dataType = ConstantService.FILTER_LIST_KEY_TEXT;
      productOperatorEntity.name = ConstantService.CASE_LIST_QUERY_INCLUDES;
      productOperatorEntity.sQLValue = ConstantService.INCLUDE_SQL_VALUE;
      productRuleEntity.operator = productOperatorEntity;
      productRuleEntity.dimension = productDimensionEntity;
      productRuleEntity.selectedValues.length = 0;
      //ingredients
      var ingredientRuleEntity = angular.copy(QueryRuleEntity);
      var ingredientDimensionEntity = reportOutput.getDimensionObject(LanguageService.CONSTANTS.INGREDIENTCOLNAME);
      var ingredientOperatorEntity = angular.copy(QueryOperatorEntity);
      ingredientOperatorEntity.dataType = ConstantService.FILTER_LIST_KEY_TEXT;
      ingredientOperatorEntity.name = ConstantService.CASE_LIST_QUERY_INCLUDES;
      ingredientOperatorEntity.sQLValue = ConstantService.INCLUDE_SQL_VALUE;
      ingredientRuleEntity.operator = ingredientOperatorEntity;
      ingredientRuleEntity.dimension = ingredientDimensionEntity;
      ingredientRuleEntity.selectedValues.length = 0;
      angular.forEach(reportOutput.data.caseListObject.products, function (product) {
        productRuleEntity.selectedValues.push({'id': product.productKey, 'name': product.productName, 'code': isNaN(product.ingredientKey)?product.ingredientKey:Number(product.ingredientKey)});
        var results = ingredientRuleEntity.selectedValues.filter(function (o) {
          return product.ingredientKey === o.id;
        });
        if (results.length === 0) {
          ingredientRuleEntity.selectedValues.push({'id': product.ingredientKey, 'name': product.ingredientName});
        }
      });
      sourceGroupEntity.rules.push(productRuleEntity);
      reportOutput.data.caseListObject.selectedLicProd = productRuleEntity;
      sourceGroupEntity.rules.push(ingredientRuleEntity);
      reportOutput.data.caseListObject.selectedIngredients = ingredientRuleEntity;
    } else if (reportOutput.data.caseListObject.licenses.length > 0) { //check if license exists
      var licenseRuleEntity = angular.copy(QueryRuleEntity);
      var licenseDimensionEntity = reportOutput.getDimensionObject(LanguageService.CONSTANTS.LICENSECOLNAME);
      var licenseOperatorEntity = angular.copy(QueryOperatorEntity);
      licenseOperatorEntity.dataType = ConstantService.FILTER_LIST_KEY_TEXT;
      licenseOperatorEntity.name = ConstantService.CASE_LIST_QUERY_INCLUDES;
      licenseOperatorEntity.sQLValue = ConstantService.INCLUDE_SQL_VALUE;
      licenseRuleEntity.operator = licenseOperatorEntity;
      licenseRuleEntity.dimension = licenseDimensionEntity;
      licenseRuleEntity.selectedValues.length = 0;
      //ingredients
      var ngredientRuleEntity = angular.copy(QueryRuleEntity);
      var ngredientDimensionEntity = reportOutput.getDimensionObject(LanguageService.CONSTANTS.INGREDIENTCOLNAME);
      var ngredientOperatorEntity = angular.copy(QueryOperatorEntity);
      ngredientOperatorEntity.dataType = ConstantService.FILTER_LIST_KEY_TEXT;
      ngredientOperatorEntity.name = ConstantService.CASE_LIST_QUERY_INCLUDES;
      ngredientOperatorEntity.sQLValue = ConstantService.INCLUDE_SQL_VALUE;
      ngredientRuleEntity.operator = ngredientOperatorEntity;
      ngredientRuleEntity.dimension = ngredientDimensionEntity;
      ngredientRuleEntity.selectedValues.length = 0;
      angular.forEach(reportOutput.data.caseListObject.licenses, function (license) {
        licenseRuleEntity.selectedValues.push({'id': license.licenseKey, 'name': license.licenseName, 'code': isNaN(license.ingredientKey)?license.ingredientKey:Number(license.ingredientKey)});
        var results = ngredientRuleEntity.selectedValues.filter(function (o) {
          return license.ingredientKey === o.id;
        });
        if (results.length === 0) {
          ngredientRuleEntity.selectedValues.push({'id': license.ingredientKey, 'name': license.ingredientName});
        }
      });
      sourceGroupEntity.rules.push(licenseRuleEntity);
      reportOutput.data.caseListObject.selectedLicProd = licenseRuleEntity;
      sourceGroupEntity.rules.push(ngredientRuleEntity);
      reportOutput.data.caseListObject.selectedIngredients = ngredientRuleEntity;
    }
    var dateGroupEntity = angular.copy(QueryGroupEntity.group); //date group - it will be OR condition
    dateGroupEntity.groupOperator = {key: ConstantService.ZERO_KEY, name: ConstantService.OR};
    dateGroupEntity.source = ConstantService.SOURCE;
    dateGroupEntity.rules = [];
    if (reportOutput.data.caseListObject.eventReceiptDate) { //event reciept date
      var eventReceiptDateRuleEntity = angular.copy(QueryRuleEntity);   //
      var eventReceiptDateDimensionEntity = reportOutput.getDimensionObject(LanguageService.CONSTANTS.EVENTRECEIPTDT);
      var eventReceiptDateOperatorEntity = angular.copy(QueryOperatorEntity);
      eventReceiptDateOperatorEntity.dataType = ConstantService.FILTER_DATE_TEXT;
      eventReceiptDateOperatorEntity.name = ConstantService.CASE_LIST_QUERY_BETWEEN;
      eventReceiptDateOperatorEntity.sQLValue = ConstantService.NOT_EQUAL_SQL_VALUE;
      eventReceiptDateRuleEntity.value = [];
      eventReceiptDateRuleEntity.operator = eventReceiptDateOperatorEntity;
      eventReceiptDateRuleEntity.dimension = eventReceiptDateDimensionEntity;
      eventReceiptDateRuleEntity.value.push(reportOutput.data.caseListObject.reportingStartDate);
      eventReceiptDateRuleEntity.value.push(reportOutput.data.caseListObject.reportingEndDate);
      dateGroupEntity.rules.push(eventReceiptDateRuleEntity);
    }
    if (reportOutput.data.caseListObject.initialReceiptDate) {
      var initialReceiptDateRuleEntity = angular.copy(QueryRuleEntity);   //
      var initialReceiptDateDimensionEntity = reportOutput.getDimensionObject(LanguageService.CONSTANTS.INITRECVDT);
      var initialReceiptDateOperatorEntity = angular.copy(QueryOperatorEntity);
      initialReceiptDateOperatorEntity.dataType = ConstantService.FILTER_DATE_TEXT;
      initialReceiptDateOperatorEntity.name = ConstantService.CASE_LIST_QUERY_BETWEEN;
      initialReceiptDateOperatorEntity.sQLValue = ConstantService.NOT_EQUAL_SQL_VALUE;
      initialReceiptDateRuleEntity.value = [];
      initialReceiptDateRuleEntity.operator = initialReceiptDateOperatorEntity;
      initialReceiptDateRuleEntity.dimension = initialReceiptDateDimensionEntity;
      initialReceiptDateRuleEntity.value.push(reportOutput.data.caseListObject.reportingStartDate);
      initialReceiptDateRuleEntity.value.push(reportOutput.data.caseListObject.reportingEndDate);
      dateGroupEntity.rules.push(initialReceiptDateRuleEntity);
    }
    if (reportOutput.data.caseListObject.followupReceiptDate) {
      var followupReceiptDateRuleEntity = angular.copy(QueryRuleEntity);
      var followupReceiptDateDimensionEntity = reportOutput.getDimensionObject(LanguageService.CONSTANTS.FOLLOWUPRECVDT);
      var followupReceiptDateOperatorEntity = angular.copy(QueryOperatorEntity);
      followupReceiptDateOperatorEntity.dataType = ConstantService.FILTER_DATE_TEXT;
      followupReceiptDateOperatorEntity.name = ConstantService.CASE_LIST_QUERY_BETWEEN;
      followupReceiptDateOperatorEntity.sQLValue = ConstantService.NOT_EQUAL_SQL_VALUE;
      followupReceiptDateRuleEntity.value = [];
      followupReceiptDateRuleEntity.operator = followupReceiptDateOperatorEntity;
      followupReceiptDateRuleEntity.dimension = followupReceiptDateDimensionEntity;
      followupReceiptDateRuleEntity.value.push(reportOutput.data.caseListObject.reportingStartDate);
      followupReceiptDateRuleEntity.value.push(reportOutput.data.caseListObject.reportingEndDate);
      dateGroupEntity.rules.push(followupReceiptDateRuleEntity);
    }
    if (reportOutput.data.caseListObject.iCSRSubmissionDate) {
      var iCSRSubmissionDateRuleEntity = angular.copy(QueryRuleEntity);
      var iCSRSubmissionDateDimensionEntity = reportOutput.getDimensionObject(LanguageService.CONSTANTS.SUBMITDT);
      var iCSRSubmissionDateOperatorEntity = angular.copy(QueryOperatorEntity);
      iCSRSubmissionDateOperatorEntity.dataType = ConstantService.FILTER_DATE_TEXT;
      iCSRSubmissionDateOperatorEntity.name = ConstantService.CASE_LIST_QUERY_BETWEEN;
      iCSRSubmissionDateOperatorEntity.sQLValue = ConstantService.NOT_EQUAL_SQL_VALUE;
      iCSRSubmissionDateRuleEntity.value = [];
      iCSRSubmissionDateRuleEntity.operator = iCSRSubmissionDateOperatorEntity;
      iCSRSubmissionDateRuleEntity.dimension = iCSRSubmissionDateDimensionEntity;
      iCSRSubmissionDateRuleEntity.value.push(reportOutput.data.caseListObject.reportingStartDate);
      iCSRSubmissionDateRuleEntity.value.push(reportOutput.data.caseListObject.reportingEndDate);
      dateGroupEntity.rules.push(iCSRSubmissionDateRuleEntity);
    }
    if(reportOutput.data.caseListObject.routedDateFlag){
      var routedDateRuleEntity = angular.copy(QueryRuleEntity);   //
      var routedDateDimensionEntity = reportOutput.getDimensionObject(LanguageService.CONSTANTS.ROUTEDT);
      var routedDateOperatorEntity = angular.copy(QueryOperatorEntity);
      routedDateOperatorEntity.dataType = ConstantService.FILTER_DATE_TEXT;
      routedDateOperatorEntity.name = ConstantService.CASE_LIST_QUERY_BETWEEN;
      routedDateOperatorEntity.sQLValue = ConstantService.NOT_EQUAL_SQL_VALUE;
      routedDateRuleEntity.value = [];
      routedDateRuleEntity.operator = routedDateOperatorEntity;
      routedDateRuleEntity.dimension = routedDateDimensionEntity;
      routedDateRuleEntity.value.push(reportOutput.data.caseListObject.reportingStartDate);
      routedDateRuleEntity.value.push(reportOutput.data.caseListObject.reportingEndDate);
      dateGroupEntity.rules.push(routedDateRuleEntity);
    }
    if(reportOutput.data.caseListObject.caseCompletionDateFlag){
      var caseCompletionDateRuleEntity = angular.copy(QueryRuleEntity);   //
      var caseCompletionDateDimensionEntity = reportOutput.getDimensionObject(LanguageService.CONSTANTS.DCASECOMPLETIONDT);
      var caseCompletionDateOperatorEntity = angular.copy(QueryOperatorEntity);
      caseCompletionDateOperatorEntity.dataType = ConstantService.FILTER_DATE_TEXT;
      caseCompletionDateOperatorEntity.name = ConstantService.CASE_LIST_QUERY_BETWEEN;
      caseCompletionDateOperatorEntity.sQLValue = ConstantService.NOT_EQUAL_SQL_VALUE;
      caseCompletionDateRuleEntity.value = [];
      caseCompletionDateRuleEntity.operator = caseCompletionDateOperatorEntity;
      caseCompletionDateRuleEntity.dimension = caseCompletionDateDimensionEntity;
      caseCompletionDateRuleEntity.value.push(reportOutput.data.caseListObject.reportingStartDate);
      caseCompletionDateRuleEntity.value.push(reportOutput.data.caseListObject.reportingEndDate);
      dateGroupEntity.rules.push(caseCompletionDateRuleEntity);
    }



    sourceGroupEntity.rules.push({'group': dateGroupEntity});
    return {'group': sourceGroupEntity};
  };


  reportOutput.mapResponseToCaseListEntity = function (response) {
    if (response.reportOutput) {
      try {
        reportOutput.data.caseListObject.baseCaseListKey = response.reportOutput.BCL_KEY;
        reportOutput.data.caseListObject.reportKey = response.reportOutput.RPT_KEY;
        reportOutput.data.caseListObject.caseListName = response.reportOutput.BCL_NAME;
        reportOutput.data.caseListObject.description = response.reportOutput.DESCRIPTION;
        reportOutput.data.caseListObject.casesCount = response.reportOutput.CASES_COUNT;
        reportOutput.data.caseListObject.isLocked = response.reportOutput.IS_LOCKED;
        reportOutput.data.caseListObject.createdBy = response.reportOutput['Audit.CreatedBy'];
        reportOutput.data.caseListObject.createdDate = DateService.getDateObjectFromBackendDateString(response.reportOutput['Audit.CreatedDt']);
        reportOutput.data.caseListObject.updatedBy = response.reportOutput['Audit.UpdatedBy'];
        reportOutput.data.caseListObject.updatedDate = DateService.getDateObjectFromBackendDateString(response.reportOutput['Audit.UpdatedDt']);
        reportOutput.data.caseListObject.isCCL = response.reportOutput.IS_CCL;
        reportOutput.data.caseListObject.queryFilter = response.reportOutput.QRY_FILTER;
        reportOutput.data.caseListObject.allDatesFlag = (response.reportOutput.ALL_DATES_FLAG === 1);
        reportOutput.data.caseListObject.reportingStartDate = DateService.getDateObjectFromBackendDateString(response.reportOutput.RPT_START_DATE);
        reportOutput.data.caseListObject.reportingEndDate = DateService.getDateObjectFromBackendDateString(response.reportOutput.RPT_END_DATE);
        reportOutput.data.caseListObject.asOfDate = DateService.getDateObjectFromBackendDateString(response.reportOutput.AS_OF_DATE);
        reportOutput.data.caseListObject.submissionDueDate = DateService.getDateObjectFromBackendDateString(response.reportOutput.SUBMISSION_DUE_DATE);
        reportOutput.data.caseListObject.nsMedwatchReportsFlag = (response.reportOutput.NS_MEDWATCH_RPTS_FLAG === 1);
        reportOutput.data.caseListObject.casesNtPreRptdFlag = (response.reportOutput.CASES_NT_PRE_RPTD_FLAG === 1);
        reportOutput.data.caseListObject.eventReceiptDate = (response.reportOutput.EVENT_RCPT_DT_FLAG === 1);
        reportOutput.data.caseListObject.initialReceiptDate = (response.reportOutput.INITIAL_RCPT_DT_FLAG === 1);
        reportOutput.data.caseListObject.followupReceiptDate = (response.reportOutput.FOLLOWUP_RCPT_DT_FLAG === 1);
        reportOutput.data.caseListObject.iCSRSubmissionDate = (response.reportOutput.ICSR_SUBMISSION_DT_FLAG === 1);
        reportOutput.data.caseListObject.otherDateFlag = (response.reportOutput.OTHER_DT_FLAG === 1);
        reportOutput.data.caseListObject.signalCompStartDate = DateService.getDateObjectFromBackendDateString(response.reportOutput.SIGNAL_COMP_START_DATE);
        reportOutput.data.caseListObject.signalCompEndDate = DateService.getDateObjectFromBackendDateString(response.reportOutput.SIGNAL_COMP_END_DATE);
        reportOutput.data.caseListObject.signalCumlStartDate = DateService.getDateObjectFromBackendDateString(response.reportOutput.SIGNAL_CUML_START_DATE);
        reportOutput.data.caseListObject.signalCumlEndDate = DateService.getDateObjectFromBackendDateString(response.reportOutput.SIGNAL_CUML_END_DATE);
        reportOutput.data.caseListObject.signalThreshold = response.reportOutput.SIGNAL_THRESHOLD;
        reportOutput.data.caseListObject.signalDenomCaseFlag = (response.reportOutput.SIGNAL_DENOM_CASE_FLAG === 1);
        reportOutput.data.caseListObject.signalDenomOtherFlag = (response.reportOutput.SIGNAL_DENOM_OTHER_FLAG === 1);
        reportOutput.data.caseListObject.signalDenominator = response.reportOutput.SIGNAL_DENOMINATOR;
        reportOutput.data.caseListObject.routedDateFlag = (response.reportOutput.ROUTED_DT_FLAG === 1);
        reportOutput.data.caseListObject.caseCompletionDateFlag = (response.reportOutput.CASE_COMPLETION_DT_FLAG === 1);
        reportOutput.data.caseListObject.comparatorPeriodKey = response.reportOutput.FK_COMP_PERIOD_KEY;
        reportOutput.data.caseListObject.productLicenseOption = response.reportOutput.PRODUCT_LICENSE_OPTION;
        reportOutput.data.caseListObject.runTime = DateService.getDateObjectFromBackendDateString(response.reportOutput.RUN_TIME);
        reportOutput.data.caseListObject.runDate = DateService.getDateObjectFromBackendDateString(response.reportOutput.RUN_DATE);
        reportOutput.data.caseListObject.caseListDisplayName = response.reportOutput.BCL_DISPLAY_NAME;
        reportOutput.data.caseListObject.queryFilterUI = response.reportOutput.QRY_FILTER_UI;
        reportOutput.data.caseListObject.sourceQueryUI = response.reportOutput.SRC_QRY_FILTER_UI;
        reportOutput.data.caseListObject.caseListMode = response.CASE_LIST_MODE;
        reportOutput.data.caseListObject.visualQueryFilterUI = response.reportOutput.VISUAL_QRY_FILTER_UI;
        reportOutput.data.caseListObject.queryString = response.reportOutput.QUERY_STRING;
      }
      catch (e) {
        console.log('mapResponseToCaseListEntity:',e);
      }

    }
    if (response.reportProducts.length) {
      if (response.reportOutput.PRODUCT_LICENSE_OPTION === ConstantService.PRODUCT_BASED_SELECTION) {
        reportOutput.data.caseListObject.products.length = 0;
        angular.forEach(response.reportProducts, function (product) {
          reportOutput.data.caseListObject.payloadProduct = response.reportProducts;
          reportOutput.data.caseListObject.products.push({
            'key': product.RPT_PRODUCT_KEY,
            'userKey': product.FK_USER_KEY,
            'bclKey': product.FK_BCL_KEY,
            'ingredientKey': product.FK_FAMILY_CODE,
            'productKey': product.FK_PRODUCT_KEY,
            'productName': product.TRADE_NAME + '  ' + product.FORMULATION_DESC,
            'ingredientName': product.FAMILY_DESC
          });
        });
      }
      else if (response.reportOutput.PRODUCT_LICENSE_OPTION === ConstantService.LICENSE_BASED_SELECTION) {
        reportOutput.data.caseListObject.licenses.length = 0;
        angular.forEach(response.reportProducts, function (license) {
          reportOutput.data.caseListObject.payloadLicense = response.reportProducts;
          reportOutput.data.caseListObject.licenses.push({
            'key': license.RPT_PRODUCT_KEY,
            'userKey': license.FK_USER_KEY,
            'bclKey': license.FK_BCL_KEY,
            'ingredientKey': license.FK_FAMILY_CODE,
            'licenseKey': license.FK_LICENSE_KEY,
            'licenseName': license.LIC_NUMBER,
            'ingredientName': license.FAMILY_DESC
          });
        });
      }
    }
    reportOutput.data.caseListObject.queryBuilderObject.setEntities.length = 0; // empties the current shared query sets
    try {
      if (response.reportOutput.JSON_VALUE) {
        var setEntitesJson = JSON.parse(response.reportOutput.JSON_VALUE);
        reportOutput.data.caseListObject.queryBuilderObject.expressionEntity = setEntitesJson.expressionEntity;
        reportOutput.data.caseListObject.queryBuilderObject.type = setEntitesJson.type;
        if (setEntitesJson.setEntities.length) {//check if the json has set entities
          reportOutput.callSetQueryMapping(setEntitesJson.setEntities); // pushes the retrieved querysets into the shared query sets
        }
        //Even if there is no setEntitites , we need to build a querbuilder object with source filters and push it to a default set entitties
      } else if (response.reportProducts.length || (response.reportOutput.RPT_START_DATE !== null && response.reportOutput.RPT_END_DATE !== null)) {
        reportOutput.createQuerySetsForSourceFilters();
      }
    } catch (e) {
      console.log('parsing JSON:', e);
    }
  };
  reportOutput.getSelectedCaseListAllDetails = function (baseCaseListKey) {
    var deferred = $q.defer();
    var errorMessage = LanguageService.MESSAGES.FAILED_TO_GET_CASE_LISTS;
    var url = UrlService.getService('CASE_LIST_DETAILS') + baseCaseListKey;
    $http.get(url)
      .success(function (response) {
        try {
          if (!response.error) {
            reportOutput.mapResponseToCaseListEntity(response);
            deferred.resolve({'data': reportOutput.data.caseListObject, 'message': ''});
          }
        } catch (e) {
          // Added console statement to debug IE issue
          console.log('getSelectedCaseListAllDetails:e:',e);
          alertService.warn(errorMessage);
          deferred.resolve({'error': 'ok', 'message': errorMessage});
        }
      }).error(function (err) {
      // Added console statement to debug IE issue
      console.log('getSelectedCaseListAllDetails:err:',err);
      alertService.warn(errorMessage);
      deferred.resolve({'error': 'ok', 'message': errorMessage});
    });
    return deferred.promise;
  };
  reportOutput.getReportTemplateData = function (bclKey,bclName) {

    var deferred = $q.defer();
    var url=UrlService.getService('REPORT_PACKAGE_TEMPLATE');
    //var url='http://dcidsthana01.dci.local:8000/deloitte/innovation/ls/safety/services/reports/ReportPackage.xsodata/ReportCategory?$format=json&$expand=SubReports';
    $http.get(url)
      .success(function (response) {
        try {
          // Filling Dummy Constant values , Needs to change once backend is ready with new table
          var templateMasterConfiguration = [];
          var reportObject={ 'templateName': '',
            'templateKey': 1,
            'expand': false,
            'children': []};
          angular.forEach(response.d.results, function (object,key) {
            if (object.RPT_CAT_KEY !== undefined && object.RPT_CAT_KEY !== null) { //checking if retrived data is having report category key or not
              var tempReportObject=angular.copy(reportObject);
              tempReportObject.templateName=object.RPT_CAT_NAME;
              tempReportObject.templateKey=object.RPT_CAT_KEY;
              templateMasterConfiguration.push(tempReportObject);
              var tempReportTypeArray=[];
              angular.forEach(object.SubReports.results, function (value) {
                var index=tempReportTypeArray.indexOf(value.RPT_TYPE_KEY);
                if(value.RPT_TYPE_KEY!==null) {
                  var actualObject = {};
                  if(index<0) {
                    var rptType={};
                    rptType.templateName = value.RPT_TYPE_NAME;
                    rptType.expand=false;
                    rptType.children = [];
                    tempReportTypeArray.push(value.RPT_TYPE_KEY);
                    templateMasterConfiguration[key].children.push(rptType);
                  }
                  actualObject.templateName = value.RPT_TYPE_NAME + '_'+ value.SRT_NAME;//setting values so that front end can render it, 1 level hiearchy supported at this level
                  actualObject.reportTypeName=value.RPT_TYPE_NAME;
                  actualObject.subReportName=value.SRT_NAME;
                  actualObject.reportTypeKey = value.RPT_TYPE_KEY;
                  actualObject.templateKey = value.RPT_CAT_KEY;
                  actualObject.srtKey = value.SRT_KEY;
                  actualObject.documentType=value.DOCUMENT_TYPE?1:0;
                  actualObject.isSelectedInPackage =true;
                  actualObject.bclKey = bclKey;
                  actualObject.bclDisplayName = bclName;
                  if(index<0) {
                    templateMasterConfiguration[key].children[templateMasterConfiguration[key].children.length-1].children.push(actualObject);
                  }
                  else
                  {
                    templateMasterConfiguration[key].children[index].children.push(actualObject);
                  }
                }});
            }
          });
          deferred.resolve({'data': templateMasterConfiguration, 'message': ''});
        } catch (e) {
          console.log(e);
          // alertService.warn(LanguageService.MESSAGES.FAILED_LOAD_DIMENSION_INFO);//Need to Fix
          //deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_GET_REPORT_TYPES});
        }
      })
      .error(function () {
        // alertService.error(LanguageService.MESSAGES.FAILED_LOAD_DIMENSION_INFO);
        //deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_GET_REPORT_TYPES});
      });
    return deferred.promise;
  };
  reportOutput.saveReportOutputMetadata = function (payload) {
    var deferred = $q.defer();
    var method = 'POST';
    var url = UrlService.getService('SAVE_REPORT_OUTPUT');
    var errorMessage = LanguageService.FAILED_TO_SAVE_REPORT_OUTPUT;
    var successMessage = LanguageService.MESSAGES.SUCCESS_SAVE_REPORT_OUTPUT;
    $http({
      'method': method,
      'url': url,
      'data': payload
    })
      .success(function (response) {
        if (response !== null) {
          deferred.resolve({'data': response, 'message': successMessage});
          alertService.success(successMessage);
        } else {
          deferred.resolve({'error': 'ok', 'message': errorMessage});
        }
      })
      .error(function () {
        deferred.resolve({'error': 'ok', 'message': errorMessage});
        alertService.warn(errorMessage);
      });
    return deferred.promise;
  };
  return reportOutput;
}]);
