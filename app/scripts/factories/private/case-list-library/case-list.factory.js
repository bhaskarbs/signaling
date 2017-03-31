'use strict';
angular.module('saintApp').factory('CaseListFactory', ['PreferencesFactory', '$http', '$q', 'UrlService', 'alertService', 'LanguageService', 'CaseListEntity', 'ConstantService', 'QueryOperatorEntity', 'QueryDimensionEntity', 'DateService', 'QueryGroupEntity', 'QueryRuleEntity', 'QuerySetEntity', function (PreferencesFactory, $http, $q, UrlService, alertService, LanguageService, CaseListEntity, ConstantService, QueryOperatorEntity, QueryDimensionEntity, DateService, QueryGroupEntity, QueryRuleEntity, QuerySetEntity) {

  var caseList = function (data) {
    angular.extend(this, data);
  };
  caseList.data = {
    caseListLib: [],
    checkedDateBoxes: [],
    selectedFilters: [],
    persistedData: [],
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
    enableSave: false
  };

  /*share case list start*/

  caseList.saveShareCaseList = function (payload) {
    var deferred = $q.defer();
    var payloadData = payload;
    var method = 'POST';
    var url = UrlService.getService('SHARE_CASE_LIST');
    var headers = {'content-type': 'application/json', 'Accept': 'application/json'};
    var errorMessage = LanguageService.MESSAGES.FAILED_SAVE_SHARE_CASE_LIST;
    var successMessage = LanguageService.MESSAGES.SUCCESS_SAVE_SHARE_CASE_LIST;
    $http({
      'method': method,
      'url': url,
      'data': payloadData,
      'header': headers
    })
      .success(function (response) {
        if (response !== null) {
          deferred.resolve({'data': response, 'message': successMessage});
          alertService.warn(successMessage);
        } else {
          deferred.resolve({'error': 'ok', 'message': errorMessage});
        }
      })
      .error(function () {
        deferred.resolve({'error': 'ok', 'message': errorMessage});
      });
    return deferred.promise;
  };

  caseList.computeShareCaseListPayload = function (sharedCaseListDetail) {
    var payload = {};
    payload.BCL_KEY = caseList.data.caseListObject.baseCaseListKey;
    payload.data = [];
    for (var i = 0; i < sharedCaseListDetail.selectedUsersGroup.length; i++) {
      var temp = {};
      temp.NAME = sharedCaseListDetail.selectedUsersGroup[i].name;
      temp.OBJ_TYPE = sharedCaseListDetail.selectedUsersGroup[i].type;
      temp.GROUP_ID = sharedCaseListDetail.selectedUsersGroup[i].userGroupKey;
      temp.USER_ID = sharedCaseListDetail.selectedUsersGroup[i].userKey;
      payload.data.push(temp);
    }
    return payload;
  };

  caseList.getSelectedUser = function () {
    var deferred = $q.defer();
    var errorMessage = LanguageService.MESSAGES.FAILED_TO_GET_SELECTED_USER;
    var url = UrlService.getService('SHARE_CASE_LIST');
    url += '?BCL_KEY=' + caseList.data.caseListObject.baseCaseListKey;
    $http.get(url)
      .success(function (response) {
        try {
          caseList.selectedUserGroupInfo = response;
          deferred.resolve({'data': response, 'message': ''});
        } catch (e) {
          alertService.warn(errorMessage);
          deferred.resolve({'error': 'ok', 'message': errorMessage});
        }
      })
      .error(function () {
        alertService.error(errorMessage);
        deferred.resolve({'error': 'ok', 'message': errorMessage});
      });
    return deferred.promise;
  };
  /*share case list ends*/

  caseList.syncSharedObjectWithPersistedData = function () {
    var selectedFilters = [];
    var caseListSort = null;

    _.each(caseList.data.persistedData, function (object) {

      //Prepare selectedSort variable
      if (object.persistedKey === 'SORT_CASE_LIST') {
        caseListSort = object.persistedValue;
      }

      //Prepare selectedFilters variable
      else if (object.persistedKey.split('_')[0].toUpperCase() === 'FILTER') {
        if (object.persistedValue) { // Insert only non-null filters
          if (typeof object.persistedValue === 'object') {
            selectedFilters.push(object.persistedValue);
          }
        }
      }
    });

    caseList.data.selectedFilters = selectedFilters;
    caseList.data.caseListSort = caseListSort || {
        'sortedBy': ConstantService.CASE_LIST_LIBRARY_DEFAULT_SORT_KEY,
        'sortedByName': ConstantService.CASE_LIST_LIBRARY_DEFAULT_SORT_NAME,
        'sortOrder': ConstantService.ASCENDING
      };
  };

  caseList.persistPreference = function (key, value, screenName) {
    PreferencesFactory.persistPreference(key, value, screenName || ConstantService.MANAGE_CASE_LIST_SCREEN, function (data) {
      if (data) {
        caseList.data.persistedData = data; // DELETE will update this shared data
      }
      return caseList.data.persistedData;

    });
  };
  /**
  * gets the tile panel data for the case lists
  *
  */
  caseList.getCaseListData = function (payload) {
      var url = UrlService.getService('CASE_LIST_LIBRARY_TILE_DATA');
      var headers = {'Content-Type': 'application/json'};
       var deferred = $q.defer();
      $http({
          'method': 'POST',
          'url': url,
          'data': payload,
          'header':headers
        })
        .success(function (response) {
        try {
            var caseListResponse = angular.copy(response.result);
            var mappedCaseList = [];
            var tempCaseList = [];
            var totalRecords = response.count.COUNTS;
            angular.forEach(caseListResponse, function (value, key) {
              tempCaseList[key] = angular.copy(CaseListEntity);
              tempCaseList[key].reportKey=value.RPT_KEY;
              tempCaseList[key].caseId = value.ID;
              tempCaseList[key].baseCaseListKey = value.BCL_KEY;
              tempCaseList[key].caseListName = value.BCL_NAME;
              tempCaseList[key].caseListDisplayName = value.BCL_DISPLAY_NAME;
              tempCaseList[key].description = value.DESCRIPTION;
              tempCaseList[key].reportingStartDate = value.RPT_START_DATE;
              tempCaseList[key].reportingEndDate = value.RPT_END_DATE;
              tempCaseList[key].creationDate = value[ConstantService.AUDIT_CREATEDDT];
              tempCaseList[key].sourceCasesCount = (value.CASES_COUNT) ? value.CASES_COUNT : 0;
              tempCaseList[key].caseNumber = value.CASE_NUMBER;
              tempCaseList[key].allDatesFlag = value.ALL_DATES_FLAG;
              tempCaseList[key].isLocked = value.IS_LOCKED;
              tempCaseList[key].isShared = (value.IS_SHARED) ? true : false;
              mappedCaseList.push(tempCaseList[key]);
            });
            caseList.data.caseListLib = mappedCaseList;
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
  caseList.getConfig = function (param) {
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
  caseList.getFilterContent = function (payload,key) {
    var url = UrlService.getService('CASE_LIST_LIBRARY_TILE_DATA');
    var headers = {'Content-Type': 'application/json'};
     var deferred = $q.defer();
    $http({
        'method': 'POST',
        'url': url,
        'data': payload,
        'header':headers
      })
      .success(function (response) {
        var res = response.result, filterList = angular.copy(CaseListEntity);
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

  caseList.getSelectedCaseListDetails = function (baseCaseKey) {
    var deferred = $q.defer();
    var url = UrlService.getService('CASENAME_FILTERQUERY') + baseCaseKey + ')/Results' + '?$select=BCL_KEY,BCL_NAME,AS_OF_DATE';
    $http.get(url).success(function (response) {
      try {
        if(!response.error) {
          var caseListResponse = response.d.results;
          var selectedCaseListObj = _.findWhere(caseListResponse, {'BCL_KEY': parseInt(baseCaseKey) || 0});
          var actualObject = caseList.data.caseListObject;
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
  caseList.prepareSelectedChartsList = function (rules) {
    _.each(rules, function (rule) {
      if (rule.dimension && rule.dimension.columnName) {
        var selContents = rule.selectedValues && rule.selectedValues.length > 0 ? rule.selectedValues : [rule.value];
        caseList.data.selectedChartsList.push({
          columnName: rule.dimension.columnName,
          name: rule.dimension.displayName,
          contents: selContents,
          operator: rule.operator,
          visualHighlight: rule.operator && (rule.operator.name === ConstantService.CASE_LIST_QUERY_INCLUDES || rule.operator.name === ConstantService.CASE_LIST_QUERY_EQUALS)? true: false
        });
        caseList.data.selectedChartsList.updateDB = false;
      }
    });
  };
  caseList.callSetQueryMapping = function (setQueries) {  //parse setQuery coming from CaseListMangement service to querySets in case-list-entity-service
    var sourceGroupEntity = caseList.getSourceGroup(); // get the source group from the source filters
    caseList.data.selectedChartsList = [];
    caseList.data.caseListObject.queryBuilderObject.setEntities.length=0;
    setQueries.forEach(function(setQuery){  //Refer to QuerySetEntity to build the similar structure
      var querySet = angular.copy(QuerySetEntity);
      querySet.name = setQuery.name.length>0?setQuery.name:ConstantService.SET_QUERY_CONFIG.SET_DEFAULT_QUERY_NAME+' 1';
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
          querySet.jSON.group.rules.push(angular.copy(QueryGroupEntity));
        }
      }
      var rules = querySetjSON.group ? querySetjSON.group.rules : querySetjSON.rules;
      if (rules && rules.length > 0) {
        caseList.prepareSelectedChartsList(rules);
      }
      caseList.data.caseListObject.queryBuilderObject.setEntities.push(querySet);
    });
  };
  caseList.createQuerySetsForSourceFilters = function () {
    var sourceGroupEntity = caseList.getSourceGroup();
    var querySet = angular.copy(QuerySetEntity);
    querySet.name = querySet.name.length?querySet.name:ConstantService.SET_QUERY_CONFIG.SET_DEFAULT_QUERY_NAME+' 1';
    querySet.sQLQuery = '';
    querySet.setId = ConstantService.GENERATE_SET_ID();
    querySet.jSON = angular.copy(sourceGroupEntity);
    querySet.jSON.group.rules.push(angular.copy(QueryGroupEntity));
    caseList.data.caseListObject.queryBuilderObject.setEntities.push(querySet);
  };
  caseList.getDimensionObject = function (columnName) {
    var result = caseList.data.dimensionsList.filter(function (o) {
      return o.columnName === columnName;
    });
    return result ? result[0] : null; // or undefined
  };
  caseList.getSourceGroup = function () { //build and return source group as a group entity
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
    if (caseList.data.caseListObject.products.length > 0) {  //adding product for sorce filter
      var productRuleEntity = angular.copy(QueryRuleEntity);
      var productDimensionEntity = caseList.getDimensionObject(LanguageService.CONSTANTS.PRODUCTCOLNAME);
      var productOperatorEntity = angular.copy(QueryOperatorEntity);
      productOperatorEntity.dataType = ConstantService.FILTER_LIST_KEY_TEXT;
      productOperatorEntity.name = ConstantService.CASE_LIST_QUERY_INCLUDES;
      productOperatorEntity.sQLValue = ConstantService.INCLUDE_SQL_VALUE;
      productRuleEntity.operator = productOperatorEntity;
      productRuleEntity.dimension = productDimensionEntity;
      productRuleEntity.selectedValues.length = 0;
      //ingredients
      var ingredientRuleEntity = angular.copy(QueryRuleEntity);
      var ingredientDimensionEntity = caseList.getDimensionObject(LanguageService.CONSTANTS.INGREDIENTCOLNAME);
      var ingredientOperatorEntity = angular.copy(QueryOperatorEntity);
      ingredientOperatorEntity.dataType = ConstantService.FILTER_LIST_KEY_TEXT;
      ingredientOperatorEntity.name = ConstantService.CASE_LIST_QUERY_INCLUDES;
      ingredientOperatorEntity.sQLValue = ConstantService.INCLUDE_SQL_VALUE;
      ingredientRuleEntity.operator = ingredientOperatorEntity;
      ingredientRuleEntity.dimension = ingredientDimensionEntity;
      ingredientRuleEntity.selectedValues.length = 0;
      angular.forEach(caseList.data.caseListObject.products, function (product) {
        productRuleEntity.selectedValues.push({'id': product.productKey, 'name': product.productName, 'code': isNaN(product.ingredientKey)?product.ingredientKey:Number(product.ingredientKey)});
        var results = ingredientRuleEntity.selectedValues.filter(function (o) {
          return product.ingredientKey === o.id;
        });
        if (results.length === 0) {
          ingredientRuleEntity.selectedValues.push({'id': product.ingredientKey, 'name': product.ingredientName});
        }
      });
      sourceGroupEntity.rules.push(productRuleEntity);
      caseList.data.caseListObject.selectedLicProd = productRuleEntity;
      sourceGroupEntity.rules.push(ingredientRuleEntity);
      caseList.data.caseListObject.selectedIngredients = ingredientRuleEntity;
    } else if (caseList.data.caseListObject.licenses.length > 0) { //check if license exists
      var licenseRuleEntity = angular.copy(QueryRuleEntity);
      var licenseDimensionEntity = caseList.getDimensionObject(LanguageService.CONSTANTS.LICENSECOLNAME);
      var licenseOperatorEntity = angular.copy(QueryOperatorEntity);
      licenseOperatorEntity.dataType = ConstantService.FILTER_LIST_KEY_TEXT;
      licenseOperatorEntity.name = ConstantService.CASE_LIST_QUERY_INCLUDES;
      licenseOperatorEntity.sQLValue = ConstantService.INCLUDE_SQL_VALUE;
      licenseRuleEntity.operator = licenseOperatorEntity;
      licenseRuleEntity.dimension = licenseDimensionEntity;
      licenseRuleEntity.selectedValues.length = 0;
      //ingredients
      var ngredientRuleEntity = angular.copy(QueryRuleEntity);
      var ngredientDimensionEntity = caseList.getDimensionObject(LanguageService.CONSTANTS.INGREDIENTCOLNAME);
      var ngredientOperatorEntity = angular.copy(QueryOperatorEntity);
      ngredientOperatorEntity.dataType = ConstantService.FILTER_LIST_KEY_TEXT;
      ngredientOperatorEntity.name = ConstantService.CASE_LIST_QUERY_INCLUDES;
      ngredientOperatorEntity.sQLValue = ConstantService.INCLUDE_SQL_VALUE;
      ngredientRuleEntity.operator = ngredientOperatorEntity;
      ngredientRuleEntity.dimension = ngredientDimensionEntity;
      ngredientRuleEntity.selectedValues.length = 0;
      angular.forEach(caseList.data.caseListObject.licenses, function (license) {
        licenseRuleEntity.selectedValues.push({'id': license.licenseKey, 'name': license.licenseName, 'code': isNaN(license.ingredientKey)?license.ingredientKey:Number(license.ingredientKey)});
        var results = ngredientRuleEntity.selectedValues.filter(function (o) {
          return license.ingredientKey === o.id;
        });
        if (results.length === 0) {
          ngredientRuleEntity.selectedValues.push({'id': license.ingredientKey, 'name': license.ingredientName});
        }
      });
      sourceGroupEntity.rules.push(licenseRuleEntity);
      caseList.data.caseListObject.selectedLicProd = licenseRuleEntity;
      sourceGroupEntity.rules.push(ngredientRuleEntity);
      caseList.data.caseListObject.selectedIngredients = ngredientRuleEntity;
    }
    if(caseList.data.caseListObject.allDatesFlag===false) {
      var dateGroupEntity = angular.copy(QueryGroupEntity.group); //date group - it will be OR condition
      dateGroupEntity.groupOperator = {key: ConstantService.ZERO_KEY, name: ConstantService.OR};
      dateGroupEntity.source = ConstantService.SOURCE;
      dateGroupEntity.rules = [];
      if (caseList.data.caseListObject.eventReceiptDate) { //event reciept date
        var eventReceiptDateRuleEntity = angular.copy(QueryRuleEntity);   //
        var eventReceiptDateDimensionEntity = caseList.getDimensionObject(LanguageService.CONSTANTS.EVENTRECEIPTDT);
        var eventReceiptDateOperatorEntity = angular.copy(QueryOperatorEntity);
        eventReceiptDateOperatorEntity.dataType = ConstantService.FILTER_DATE_TEXT;
        eventReceiptDateOperatorEntity.name = ConstantService.CASE_LIST_QUERY_BETWEEN;
        eventReceiptDateOperatorEntity.sQLValue = ConstantService.NOT_EQUAL_SQL_VALUE;
        eventReceiptDateRuleEntity.value = [];
        eventReceiptDateRuleEntity.operator = eventReceiptDateOperatorEntity;
        eventReceiptDateRuleEntity.dimension = eventReceiptDateDimensionEntity;
        eventReceiptDateRuleEntity.value.push(caseList.data.caseListObject.reportingStartDate);
        eventReceiptDateRuleEntity.value.push(caseList.data.caseListObject.reportingEndDate);
        dateGroupEntity.rules.push(eventReceiptDateRuleEntity);
      }
      if (caseList.data.caseListObject.initialReceiptDate) {
        var initialReceiptDateRuleEntity = angular.copy(QueryRuleEntity);   //
        var initialReceiptDateDimensionEntity = caseList.getDimensionObject(LanguageService.CONSTANTS.INITRECVDT);
        var initialReceiptDateOperatorEntity = angular.copy(QueryOperatorEntity);
        initialReceiptDateOperatorEntity.dataType = ConstantService.FILTER_DATE_TEXT;
        initialReceiptDateOperatorEntity.name = ConstantService.CASE_LIST_QUERY_BETWEEN;
        initialReceiptDateOperatorEntity.sQLValue = ConstantService.NOT_EQUAL_SQL_VALUE;
        initialReceiptDateRuleEntity.value = [];
        initialReceiptDateRuleEntity.operator = initialReceiptDateOperatorEntity;
        initialReceiptDateRuleEntity.dimension = initialReceiptDateDimensionEntity;
        initialReceiptDateRuleEntity.value.push(caseList.data.caseListObject.reportingStartDate);
        initialReceiptDateRuleEntity.value.push(caseList.data.caseListObject.reportingEndDate);
        dateGroupEntity.rules.push(initialReceiptDateRuleEntity);
      }
      if (caseList.data.caseListObject.followupReceiptDate) {
        var followupReceiptDateRuleEntity = angular.copy(QueryRuleEntity);
        var followupReceiptDateDimensionEntity = caseList.getDimensionObject(LanguageService.CONSTANTS.FOLLOWUPRECVDT);
        var followupReceiptDateOperatorEntity = angular.copy(QueryOperatorEntity);
        followupReceiptDateOperatorEntity.dataType = ConstantService.FILTER_DATE_TEXT;
        followupReceiptDateOperatorEntity.name = ConstantService.CASE_LIST_QUERY_BETWEEN;
        followupReceiptDateOperatorEntity.sQLValue = ConstantService.NOT_EQUAL_SQL_VALUE;
        followupReceiptDateRuleEntity.value = [];
        followupReceiptDateRuleEntity.operator = followupReceiptDateOperatorEntity;
        followupReceiptDateRuleEntity.dimension = followupReceiptDateDimensionEntity;
        followupReceiptDateRuleEntity.value.push(caseList.data.caseListObject.reportingStartDate);
        followupReceiptDateRuleEntity.value.push(caseList.data.caseListObject.reportingEndDate);
        dateGroupEntity.rules.push(followupReceiptDateRuleEntity);
      }
      if (caseList.data.caseListObject.iCSRSubmissionDate) {
        var iCSRSubmissionDateRuleEntity = angular.copy(QueryRuleEntity);
        var iCSRSubmissionDateDimensionEntity = caseList.getDimensionObject(LanguageService.CONSTANTS.SUBMITDT);
        var iCSRSubmissionDateOperatorEntity = angular.copy(QueryOperatorEntity);
        iCSRSubmissionDateOperatorEntity.dataType = ConstantService.FILTER_DATE_TEXT;
        iCSRSubmissionDateOperatorEntity.name = ConstantService.CASE_LIST_QUERY_BETWEEN;
        iCSRSubmissionDateOperatorEntity.sQLValue = ConstantService.NOT_EQUAL_SQL_VALUE;
        iCSRSubmissionDateRuleEntity.value = [];
        iCSRSubmissionDateRuleEntity.operator = iCSRSubmissionDateOperatorEntity;
        iCSRSubmissionDateRuleEntity.dimension = iCSRSubmissionDateDimensionEntity;
        iCSRSubmissionDateRuleEntity.value.push(caseList.data.caseListObject.reportingStartDate);
        iCSRSubmissionDateRuleEntity.value.push(caseList.data.caseListObject.reportingEndDate);
        dateGroupEntity.rules.push(iCSRSubmissionDateRuleEntity);
      }
      if (caseList.data.caseListObject.routedDateFlag) {
        var routedDateRuleEntity = angular.copy(QueryRuleEntity);   //
        var routedDateDimensionEntity = caseList.getDimensionObject(LanguageService.CONSTANTS.ROUTEDT);
        var routedDateOperatorEntity = angular.copy(QueryOperatorEntity);
        routedDateOperatorEntity.dataType = ConstantService.FILTER_DATE_TEXT;
        routedDateOperatorEntity.name = ConstantService.CASE_LIST_QUERY_BETWEEN;
        routedDateOperatorEntity.sQLValue = ConstantService.NOT_EQUAL_SQL_VALUE;
        routedDateRuleEntity.value = [];
        routedDateRuleEntity.operator = routedDateOperatorEntity;
        routedDateRuleEntity.dimension = routedDateDimensionEntity;
        routedDateRuleEntity.value.push(caseList.data.caseListObject.reportingStartDate);
        routedDateRuleEntity.value.push(caseList.data.caseListObject.reportingEndDate);
        dateGroupEntity.rules.push(routedDateRuleEntity);
      }
      if (caseList.data.caseListObject.caseCompletionDateFlag) {
        var caseCompletionDateRuleEntity = angular.copy(QueryRuleEntity);   //
        var caseCompletionDateDimensionEntity = caseList.getDimensionObject(LanguageService.CONSTANTS.DCASECOMPLETIONDT);
        var caseCompletionDateOperatorEntity = angular.copy(QueryOperatorEntity);
        caseCompletionDateOperatorEntity.dataType = ConstantService.FILTER_DATE_TEXT;
        caseCompletionDateOperatorEntity.name = ConstantService.CASE_LIST_QUERY_BETWEEN;
        caseCompletionDateOperatorEntity.sQLValue = ConstantService.NOT_EQUAL_SQL_VALUE;
        caseCompletionDateRuleEntity.value = [];
        caseCompletionDateRuleEntity.operator = caseCompletionDateOperatorEntity;
        caseCompletionDateRuleEntity.dimension = caseCompletionDateDimensionEntity;
        caseCompletionDateRuleEntity.value.push(caseList.data.caseListObject.reportingStartDate);
        caseCompletionDateRuleEntity.value.push(caseList.data.caseListObject.reportingEndDate);
        dateGroupEntity.rules.push(caseCompletionDateRuleEntity);
      }
      sourceGroupEntity.rules.push({'group': dateGroupEntity});
    }
    return {'group': sourceGroupEntity};
  };


  caseList.mapResponseToCaseListEntity = function (response) {
    if (response.caseList) {
      try {
        caseList.data.caseListObject.baseCaseListKey = response.caseList.BCL_KEY;
        caseList.data.caseListObject.reportKey = response.caseList.RPT_KEY;
        caseList.data.caseListObject.caseListName = response.caseList.BCL_NAME;
        caseList.data.caseListObject.description = response.caseList.DESCRIPTION;
        caseList.data.caseListObject.casesCount = response.caseList.CASES_COUNT;
        caseList.data.caseListObject.isLocked = response.caseList.IS_LOCKED;
        caseList.data.caseListObject.createdBy = response.caseList['Audit.CreatedBy'];
        caseList.data.caseListObject.createdDate = DateService.getDateObjectFromBackendDateString(response.caseList['Audit.CreatedDt']);
        caseList.data.caseListObject.updatedBy = response.caseList['Audit.UpdatedBy'];
        caseList.data.caseListObject.updatedDate = DateService.getDateObjectFromBackendDateString(response.caseList['Audit.UpdatedDt']);
        caseList.data.caseListObject.isCCL = response.caseList.IS_CCL;
        caseList.data.caseListObject.queryFilter = response.caseList.QRY_FILTER;
        caseList.data.caseListObject.allDatesFlag = (response.caseList.ALL_DATES_FLAG === 1);
        caseList.data.caseListObject.reportingStartDate = DateService.getDateObjectFromBackendDateString(response.caseList.RPT_START_DATE);
        caseList.data.caseListObject.reportingEndDate = DateService.getDateObjectFromBackendDateString(response.caseList.RPT_END_DATE);
        caseList.data.caseListObject.asOfDate = DateService.getDateObjectFromBackendDateString(response.caseList.AS_OF_DATE);
        caseList.data.caseListObject.submissionDueDate = DateService.getDateObjectFromBackendDateString(response.caseList.SUBMISSION_DUE_DATE);
        caseList.data.caseListObject.nsMedwatchReportsFlag = (response.caseList.NS_MEDWATCH_RPTS_FLAG === 1);
        caseList.data.caseListObject.casesNtPreRptdFlag = (response.caseList.CASES_NT_PRE_RPTD_FLAG === 1);
        caseList.data.caseListObject.eventReceiptDate = (response.caseList.EVENT_RCPT_DT_FLAG === 1);
        caseList.data.caseListObject.initialReceiptDate = (response.caseList.INITIAL_RCPT_DT_FLAG === 1);
        caseList.data.caseListObject.followupReceiptDate = (response.caseList.FOLLOWUP_RCPT_DT_FLAG === 1);
        caseList.data.caseListObject.iCSRSubmissionDate = (response.caseList.ICSR_SUBMISSION_DT_FLAG === 1);
        caseList.data.caseListObject.otherDateFlag = (response.caseList.OTHER_DT_FLAG === 1);
        caseList.data.caseListObject.signalCompStartDate = DateService.getDateObjectFromBackendDateString(response.caseList.SIGNAL_COMP_START_DATE);
        caseList.data.caseListObject.signalCompEndDate = DateService.getDateObjectFromBackendDateString(response.caseList.SIGNAL_COMP_END_DATE);
        caseList.data.caseListObject.signalCumlStartDate = DateService.getDateObjectFromBackendDateString(response.caseList.SIGNAL_CUML_START_DATE);
        caseList.data.caseListObject.signalCumlEndDate = DateService.getDateObjectFromBackendDateString(response.caseList.SIGNAL_CUML_END_DATE);
        caseList.data.caseListObject.signalThreshold = response.caseList.SIGNAL_THRESHOLD;
        caseList.data.caseListObject.signalDenomCaseFlag = (response.caseList.SIGNAL_DENOM_CASE_FLAG === 1);
        caseList.data.caseListObject.signalDenomOtherFlag = (response.caseList.SIGNAL_DENOM_OTHER_FLAG === 1);
        caseList.data.caseListObject.signalDenominator = response.caseList.SIGNAL_DENOMINATOR;
        caseList.data.caseListObject.routedDateFlag = (response.caseList.ROUTED_DT_FLAG === 1);
        caseList.data.caseListObject.caseCompletionDateFlag = (response.caseList.CASE_COMPLETION_DT_FLAG === 1);
        caseList.data.caseListObject.comparatorPeriodKey = response.caseList.FK_COMP_PERIOD_KEY;
        caseList.data.caseListObject.productLicenseOption = response.caseList.PRODUCT_LICENSE_OPTION;
        caseList.data.caseListObject.runTime = DateService.getDateObjectFromBackendDateString(response.caseList.RUN_TIME);
        caseList.data.caseListObject.runDate = DateService.getDateObjectFromBackendDateString(response.caseList.RUN_DATE);
        caseList.data.caseListObject.caseListDisplayName = response.caseList.BCL_DISPLAY_NAME;
        caseList.data.caseListObject.queryFilterUI = response.caseList.QRY_FILTER_UI;
        caseList.data.caseListObject.sourceQueryUI = response.caseList.SRC_QRY_FILTER_UI;
        caseList.data.caseListObject.caseListMode = response.CASE_LIST_MODE;
        caseList.data.caseListObject.isShared = response.IS_SHARED;
        caseList.data.caseListObject.visualQueryFilterUI = response.caseList.VISUAL_QRY_FILTER_UI;
        caseList.data.caseListObject.queryString = response.caseList.QUERY_STRING;
        caseList.data.caseListObject.reportTypeName = response.caseList.RPT_TYPE_NAME;
      }
      catch (e) {
        console.log('mapResponseToCaseListEntity:',e);
      }

    }
    if (response.reportProducts.length) {
      if (response.caseList.PRODUCT_LICENSE_OPTION === ConstantService.PRODUCT_BASED_SELECTION) {
        caseList.data.caseListObject.products.length = 0;
        angular.forEach(response.reportProducts, function (product) {
          caseList.data.caseListObject.payloadProduct = response.reportProducts;
          caseList.data.caseListObject.products.push({
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
      else if (response.caseList.PRODUCT_LICENSE_OPTION === ConstantService.LICENSE_BASED_SELECTION) {
        caseList.data.caseListObject.licenses.length = 0;
        angular.forEach(response.reportProducts, function (license) {
          caseList.data.caseListObject.payloadLicense = response.reportProducts;
          caseList.data.caseListObject.licenses.push({
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
    caseList.data.caseListObject.queryBuilderObject.setEntities.length = 0; // empties the current shared query sets
    try {
      if (response.caseList.JSON_VALUE) {
        var setEntitesJson = JSON.parse(response.caseList.JSON_VALUE);
        caseList.data.caseListObject.queryBuilderObject.expressionEntity = setEntitesJson.expressionEntity;
        caseList.data.caseListObject.queryBuilderObject.type = setEntitesJson.type;
        if (setEntitesJson.setEntities.length) {//check if the json has set entities
          caseList.callSetQueryMapping(setEntitesJson.setEntities); // pushes the retrieved querysets into the shared query sets
        }
        //Even if there is no setEntitites , we need to build a querbuilder object with source filters and push it to a default set entitties
      } else if (response.reportProducts.length || (response.caseList.RPT_START_DATE !== null && response.caseList.RPT_END_DATE !== null)) {
        caseList.createQuerySetsForSourceFilters();
      }
    } catch (e) {
      console.log('parsing JSON:', e);
    }
  };
  caseList.getSelectedCaseListAllDetails = function (baseCaseListKey) {
    var deferred = $q.defer();
    var errorMessage = LanguageService.MESSAGES.FAILED_TO_GET_CASE_LISTS;
    var url = UrlService.getService('CASE_LIST_DETAILS') + baseCaseListKey;
    $http.get(url)
      .success(function (response) {
        try {
          if (!response.error) {
            caseList.mapResponseToCaseListEntity(response);
            deferred.resolve({'data': caseList.data.caseListObject, 'message': ''});
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
  caseList.getChartDimensions = function (baseCaseListKey) {
    var deferred = $q.defer();
    var url = UrlService.getService('CHART_DIMENSIONS') + baseCaseListKey +')/Results?$top=20&$format=json&$orderby=IS_ENABLED desc,DATAVIEW_ORDER asc&$filter=IS_ENABLED eq 1';
    $http.get(url).success(function (response) {
      try {
        var configArray = [];
        if(!response.error) {
          angular.forEach(response.d.results, function (config) {
            if (config.IS_ENABLED === 1) {
              configArray.push({
                'name': config.DIM_NAME,
                'type': config.CHART_TYPE,
                'dimension': config.COLUMN_NAME,
                'isShown': config.IS_ENABLED,
                'data': []
              });
            }
          });
        }
        deferred.resolve({'data': configArray, 'message': ''});
      } catch (e) {
        alertService.warn(LanguageService.MESSAGES.FAILED_TO_GET_CHART_DIMENSION);
        deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_TO_GET_CHART_DIMENSION});
      }
    }).error(function () {
      alertService.warn(LanguageService.MESSAGES.FAILED_TO_GET_CHART_DIMENSION);
      deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_TO_GET_CHART_DIMENSION});
    });
    return deferred.promise;
  };
  caseList.getCountryDetails = function () {
    var deferred = $q.defer();
    var url = UrlService.getFixture('COUNTRY_CODES');
    $http.get(url).success(function (response) {
      try {
        var countryResponse = angular.copy(response.d.results);
        caseList.data.countries = countryResponse;
        deferred.resolve({'data': countryResponse, 'message': ''});
      } catch (e) {
        alertService.warn(LanguageService.MESSAGES.FAILED_TO_GET_COUNTRY_CODES);
        deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_TO_GET_COUNTRY_CODES});
      }
    }).error(function () {
      alertService.warn(LanguageService.MESSAGES.FAILED_TO_GET_COUNTRY_CODES);
      deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_TO_GET_COUNTRY_CODES});
    });
    return deferred.promise;
  };
  caseList.getVisualChartsDetails = function (baseCaseListKey, filterType, filters) {
    var deferred = $q.defer();
    var excludedFilters = filters && filters.length > 0 ? filters.join(',') : null;
    var url = UrlService.getService('CASE_LIST_FILTER_DETAILS');
    url = url + 'IN_BCL_KEY=' + baseCaseListKey + '&filterType=' + filterType + '&excludedFilters=' + excludedFilters;
    $http.get(url).success(function (response) {
      try {
        var countryResponse = angular.copy(response.result);
        deferred.resolve({'data': countryResponse, 'message': ''});
      } catch (e) {
        alertService.warn(LanguageService.MESSAGES.FAILED_GET_VISUAL_CHART_DATA);
        deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_GET_VISUAL_CHART_DATA});
      }
    }).error(function () {
      alertService.warn(LanguageService.MESSAGES.FAILED_GET_VISUAL_CHART_DATA);
      deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_GET_VISUAL_CHART_DATA});
    });
    return deferred.promise;
  };
  //Function to return the All Cases Counts from the backend
  caseList.getAllCasesCount = function (caseListKey) {
    var deferred = $q.defer(), url = UrlService.getService('GET_CASES_COUNT') + caseListKey;
    $http.get(url).success(function (response) {
      try {
        var countResponse = response.Result;
        var actualObject = caseList.data.caseListObject;//angular.copy(CaseListEntity);
        actualObject.listed = countResponse.LISTED_COUNT;
        actualObject.added = countResponse.ADDED_COUNT;
        actualObject.removed = countResponse.REMOVED_COUNT;
        actualObject.annotated = countResponse.ANNOTATED_COUNT;
        actualObject.lastRun = countResponse.LAST_RUN_COUNT;
        actualObject.lastSaved = countResponse.LAST_SAVED_COUNT;
        deferred.resolve({'data': actualObject, 'message': ''});
      } catch (e) {
        //alertService.warn(LanguageService.MESSAGES.FAILED_TO_GET_CASE_LIST_COUNT);
        //deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_TO_GET_CASE_LIST_COUNT});
      }
    }).error(function () {
      //alertService.warn(LanguageService.MESSAGES.FAILED_TO_GET_CASE_LIST_COUNT);
      //deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_TO_GET_CASE_LIST_COUNT});
    });
    return deferred.promise;
  };
  caseList.doCreateCaseList = function (url, payload) { // ADDED, REMOVED, ANNOTATED
    var deferred = $q.defer();
    var errorMessage = LanguageService.MESSAGES.FAILED_TO_CREATE_CASE_LIST;
    var headers = {'content-type': 'application/json'};
    $http({'method': 'POST', 'url': url, 'data': payload, 'header': headers})
      .success(function (response) {
        try {
          if(!response.error) {
            deferred.resolve({'data': angular.copy(response), 'message': ''});
          }
        } catch (e) {
          alertService.warn(errorMessage);
          deferred.resolve({'error': 'ok', 'message': errorMessage});
        }
      }).error(function (err) {
        errorMessage = err && err.data? err.data.errorMessage : errorMessage;
        alertService.warn(errorMessage);
        deferred.resolve({'error': 'ok', 'message': errorMessage});
    });
    return deferred.promise;
  };

  caseList.fnUpdateCaseList = function (payload) { // ADDED, REMOVED, ANNOTATED
    var deferred = $q.defer();
    var url = UrlService.getService('UPDATE_CASELIST');
    var headers = {'content-type': 'application/json'};
    $http({'method': 'PUT', 'url': url, 'data': payload, 'header': headers})
      .success(function (response) {
        try {
          if(!response.error){
            caseList.data.caseListObject.caseListMode = null;
            caseList.data.clickedChart = true;
            caseList.getSelectedCaseListAllDetails(payload.data.baseCase.BCL_KEY);
            deferred.resolve({'data': response, 'message': ''});
            alertService.success(LanguageService.MESSAGES.CASE_LIST_UPDATE_SUCCESS);
          }
          else {
            alertService.warn(LanguageService.MESSAGES.FAILED_TO_UPDATE_CASE_LIST);
            deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_TO_UPDATE_CASE_LIST});
          }
        } catch (e) {
          alertService.warn(LanguageService.MESSAGES.FAILED_TO_UPDATE_CASE_LIST);
          deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_TO_UPDATE_CASE_LIST});
        }
      }).error(function () {
        alertService.warn(LanguageService.MESSAGES.FAILED_TO_UPDATE_CASE_LIST);
        deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_TO_UPDATE_CASE_LIST});
    });
    return deferred.promise;
  };

  caseList.getOperatorInfo = function () {
    var deferred = $q.defer();
    $http.get(UrlService.getService('OPERATOR_INFO'))
      .success(function (response) {
        try {
          var operators = _.map(response.d.results, function (object) {
            var actualObject = angular.copy(QueryOperatorEntity);
            actualObject.name = object.OPERATOR_KEY;
            actualObject.dataType = object.DATA_TYPE;
            actualObject.sQLValue = object.SQL_OPERATOR;
            actualObject.sQLDisplayName = object.OPERATOR_KEY;
            return actualObject;
          });
          deferred.resolve({'data': operators, 'message': ''});
        } catch (e) {
          alertService.warn(LanguageService.MESSAGES.FAILED_LOAD_OPERATOR_INFO);
          deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_GET_REPORT_TYPES});
        }
      })
      .error(function () {
        alertService.error(LanguageService.MESSAGES.FAILED_LOAD_OPERATOR_INFO);
        deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_GET_REPORT_TYPES});
      });
    return deferred.promise;
  };

  caseList.getDimensionInfo = function () {
    var deferred = $q.defer();
    $http.get(UrlService.getService('DIMENSION_INFO'))
      .success(function (response) {
        try {
          var dimensions = _.map(response.d.results, function (object) {
            var actualObject = angular.copy(QueryDimensionEntity);
            actualObject.name = object.COLUMN_LABEL;
            actualObject.columnName = object.COLUMN_NAME;
            actualObject.displayName = object.COLUMN_LABEL;
            actualObject.dataType = object.COLUMN_DATATYPE;
            actualObject.isLOV = (object.IS_LOV === 1);
            actualObject.group = object.DIM_GROUP;
            return actualObject;
          });
          deferred.resolve({'data': dimensions, 'message': ''});
        } catch (e) {
          alertService.warn(LanguageService.MESSAGES.FAILED_LOAD_DIMENSION_INFO);
          deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_GET_REPORT_TYPES});
        }
      })
      .error(function () {
        alertService.error(LanguageService.MESSAGES.FAILED_LOAD_DIMENSION_INFO);
        deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_GET_REPORT_TYPES});
      });
    return deferred.promise;
  };
  caseList.createCaseListCSV = function(baseCaseListKey){
    window.open(UrlService.getService('EXPORT_EXCEL')+'?bclkey='+baseCaseListKey);
  };

  caseList.getOperatorDimensionInfo = function (callback) {
    caseList.getDimensionInfo().then(function (response) {
      caseList.data.dimensionsList.length = 0;
      angular.forEach(response.data, function (dimensionInput) {
        caseList.data.dimensionsList.push(dimensionInput);
      });
      caseList.getOperatorInfo().then(function (response1) {
        caseList.data.operatorsList.length = 0;
        angular.forEach(response1.data, function (operatorInput) {
          caseList.data.operatorsList.push(operatorInput);
        });
        if (callback instanceof Function) {
          callback();
        }
      });
    });
  };
  return caseList;
}]);
