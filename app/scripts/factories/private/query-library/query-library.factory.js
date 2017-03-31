'use strict';
angular.module('saintApp').factory('QueryFactory', ['UserService', 'QueryOperatorEntity', 'QueryDimensionEntity', 'PreferencesFactory', '$http', '$q', 'UrlService', 'alertService', 'LanguageService', 'QueryEntity', 'ConstantService', 'CaseListEntity', function (UserService, QueryOperatorEntity, QueryDimensionEntity, PreferencesFactory, $http, $q, UrlService, alertService, LanguageService, QueryEntity, ConstantService, CaseListEntity) {
  var query = function (data) {
    angular.extend(this, data);
  };
  query.data = {
    userGroupInfo: [],
    selectedUserGroupInfo: [],
    filterCategoryData: [],
    sortCategoryData: [],
    queryLib: [],
    selectedFilters: [],
    persistedData: [],
    pageMode: null,
    querySort: {
      sortedBy: null,
      sortedByName: null,
      sortOrder: null,
      secondarySort: null
    },

    queryContext: {
      'key': 0,
      'name': LanguageService.CONSTANTS.DEFAULT_QUERY_NAME,
      'description': '',
      'setQueries': null
    },

    caseListObject: angular.copy(CaseListEntity),
    updateQueryString: false,
    updateQuerySet: [],
    dimensionsList: [],
    operatorsList: []
  };

  query.computeQuerySavePayload = function (queryName, queryDescription, saveMode, querySetQuery) {
    var payload = {};
    var queryKey = (saveMode === ConstantService.SAVE_QUERY) ? query.data.queryContext.key : 0;
    payload.data = {};
    payload.data.queryLibraryDetails = [];
    payload.data.queryLibraryDetails.push({
      'QUERY_KEY': queryKey,
      'QUERY_NAME': queryName || '',
      'DESCRIPTION': queryDescription || '',
      'IS_SET': 1
    });

    payload.data.queryLibraryDetails[0].JSON_VALUE = JSON.stringify(querySetQuery);
    payload.data.queryLibraryDetails[0].QUERY_STRING = querySetQuery && querySetQuery[0] && querySetQuery[0].sQLQuery;

    return payload;
  };

  query.screenName = ConstantService.MANAGE_QUERY_LIBRARY_SCREEN;
  query.syncSharedObjectWithPersistedData = function () {
    var selectedFilters = [];
    var querySort = null;

    _.each(query.data.persistedData, function (object) {

      //Prepare selectedSort variable
      if (object.persistedKey === 'SORT_QUERY_LIBRARY') {
        querySort = object.persistedValue;
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

    query.data.selectedFilters = selectedFilters;
    query.data.querySort = querySort || {
        'sortedBy': ConstantService.FILTER_QUERY_NAME_COLUMN,
        'sortedByName': ConstantService.QUERY_LIBRARY_SORT_QUERY_NAME,
        'sortOrder': ConstantService.ASCENDING
      };
  };

  query.persistPreference = function (key, value, screenName) {
    PreferencesFactory.persistPreference(key, value, screenName || query.screenName, function (data) {
      if (data) {
        query.data.persistedData = data; // DELETE will update this shared data
      }
      return query.data.persistedData;

    });
  };

  query.formatTileToEntity = function (queryTileList) {
    var formattedQueryTileList = [];
    var sessionUserName = null;
    if (UserService.data.oUser && UserService.data.oUser.userName) {
      sessionUserName = UserService.data.oUser.userName;
    }
    for (var i = 0; i < queryTileList.length; i++) {
      var tempObject = angular.copy(QueryEntity);
      tempObject.queryId = queryTileList[i].QUERY_KEY;
      tempObject.queryName = queryTileList[i].QUERY_NAME;
      tempObject.queryDesc = queryTileList[i].DESCRIPTION;
      tempObject.createdBy = queryTileList[i][ConstantService.AUDIT_CREATEDBY];

      if (tempObject.createdBy && sessionUserName) {
        tempObject.isShared = (tempObject.createdBy.toLowerCase() !== sessionUserName.toLowerCase());
      } else {
        tempObject.isShared = false;
      }
      tempObject.lastEditedDate = queryTileList[i][ConstantService.AUDIT_UPDATEDDT];
      tempObject.setQueries = queryTileList[i].QuerySetDetails;
      formattedQueryTileList.push(tempObject);
    }
    return formattedQueryTileList;
  };

  /**
   *
   * @param url Web Service url to get the data.
   * @returns {promise}
   * @description This method is used to get the data for tile panel in query library.
   */
  query.getQueryData = function (url) {
    var deferred = $q.defer();
    var errorMessage = LanguageService.MESSAGES.FAILED_TO_GET_QUERY_LIBRARY;
    $http.get(url).success(function (response) {
      try {
        var queryList = query.formatTileToEntity(response.d.results);
        var totalQuery = response.d.__count;
        query.data.queryTiles = queryList;
        deferred.resolve({'data': queryList, 'count': totalQuery, 'message': ''});
      } catch (e) {
        alertService.warn(errorMessage);
        deferred.resolve({'error': 'ok', 'message': errorMessage});
      }
    }).error(function () {
      alertService.warn(errorMessage);
      deferred.resolve({'error': 'ok', 'message': errorMessage});
    });
    return deferred.promise;
  };

  /**
   * Mapping sql queries coming from server backt o local consumption
   * @param setQueries
   * @returns {Array}
   */
  query.callSetQueryMapping = function (setQueries) {  //parse setQuery coming from CaseListMangement service to querySets in case-list-entity-service
    var querySets = []; //holds the array of query set which is of type querySets in case-list-entity-service
    for (var index = 0; index < setQueries.length; index++) {
      var setQuery = setQueries[index];
      var querySet = {};
      querySet.order = setQuery.SET_ORDER;
      querySet.setOperator = setQuery.SET_OPERATOR;
      querySet.sourceOperator = setQuery.SOURCE_OPERATOR;
      querySet.sQLQuery = setQuery.QUERY_STRING;
      querySet.jSON = JSON.parse(setQuery.JSON_VALUE)[0].jSON;
      querySets.push(querySet);
    }
    query.data.caseListObject.querySets = querySets;
    return querySets;
  };

  /**
   * @param url Web Service url to get the data.
   * @returns {promise}
   * @description This method is used to get the data for a particular query.
   */
  query.getQueryDetail = function (queryId) {
    var deferred = $q.defer();
    var errorMessage = LanguageService.MESSAGES.FAILED_TO_GET_QUERY_DETAIL;
    var url = UrlService.getService('GET_QUERY_LIBRARY');
    url += '(IN_DESCRIPTION=\'*\',IN_QUERY_NAME=\'*\')/Results?$filter=QUERY_KEY eq ' + queryId + '&$expand=QuerySetDetails';
    $http.get(url).success(function (response) {
      try {
        var queryDetail = query.formatTileToEntity(response.d.results);
        deferred.resolve({'data': queryDetail, 'message': ''});
      } catch (e) {
        alertService.warn(errorMessage);
        deferred.resolve({'error': 'ok', 'message': errorMessage});
      }
    }).error(function () {
      alertService.warn(errorMessage);
      deferred.resolve({'error': 'ok', 'message': errorMessage});
    });
    return deferred.promise;
  };

  /**
   *
   * @param param Config Type to filter the configuration received, It can be either Filter Or Sort
   * @returns {*}
   * @description This method is to get the configuration for filter and sort panel for query library page.
   */
  query.getConfig = function (param) {
    var deferred = $q.defer();
    var errorMessage = LanguageService.FAILED_TO_GET_QUERY_LIBRARY_CONFIGURATION;
    var queryParams = {$filter: 'CONFIG_TYPE eq \'' + param + '\' and SCREEN_NAME eq \'' + query.screenName + '\' and VALUE eq 1'};
    var url = UrlService.getService('REPORT_FILTER_CONFIGURATION', queryParams);
    $http.get(url)
      .success(function (response) {
        try {
          var filterConfig = [];
          _.each(response.d.results, function (object) {
            var actualObject = angular.copy(QueryEntity);
            actualObject.filterName = object.KEY;
            actualObject.configKey = object.CONFIG_KEY;
            actualObject.searchActive = true;
            actualObject.filterType = object.KEY_TYPE || null;
            actualObject.columnName = object.KEY_NAME;
            actualObject.secondarySort = object.SECONDARY_SORT;
            filterConfig.push(actualObject);
          });
          if (param === ConstantService.FILTER_PARAM_FILTER) {
            query.data.filterCategoryData = filterConfig;
          } else {
            query.data.sortCategoryData = filterConfig;
          }
          deferred.resolve({'data': filterConfig, 'message': ''});
        } catch (e) {
          alertService.warn(errorMessage);
          deferred.resolve({
            'error': 'ok',
            'message': errorMessage
          });
        }
      })
      .error(function () {
        alertService.error(errorMessage);
        deferred.resolve({
          'error': 'ok',
          'message': errorMessage
        });
      });
    return deferred.promise;
  };

  /**
   * Generate the Odata Url comprising of all filters to fetch data for Query Tiles
   * @param pageNumber
   * @returns {string}
   */
  query.generateOdataQueryParameters = function (pageNumber, queryPerPage, startIndex, endIndex) {
    var qBaseSelectParameter = '$select=QUERY_KEY,QUERY_NAME,DESCRIPTION,Audit_CreatedBy,Audit_UpdatedDt';
    var qRecordCount = '$inlinecount=allpages';
    var qTop = '';
    var qSkip = '';
    var masterQueryParameter = [];
    var qOrderBy = '';
    var qFilter = '';
    var filters = [];
    var andFilter = [];
    var tempDescription = '';
    var tempQueryName = '';
    var sortFields = '';
    var url = UrlService.getService('GET_QUERY_LIBRARY');
    masterQueryParameter.push(qBaseSelectParameter);
    masterQueryParameter.push(qRecordCount);
    var filterArray = query.data.selectedFilters;
    var selectedSort = query.data.querySort;
    if (filterArray.length > 0) { //some filter parameters have been applied
      for (var i = 0; i < filterArray.length; i++) {
        var temp = [];
        if (filterArray[i].dbFilterName) { // Make Sure DB_FILTER_NAME is not null
          if (filterArray[i].filterType === ConstantService.FILTER_LIST_KEY_TEXT) { // This is special case for description
            /**
             * Below function is to check if description is the filter category,
             * making search string as separate wildcard appended values to comply with fuzy search logic
             */
            if (filterArray[i].dbFilterName === ConstantService.FILTER_QUERY_NAME_COLUMN) {
              for (var k = 0; k < filterArray[i].contents.length; k++) {
                tempQueryName = tempQueryName + filterArray[i].contents[k] + '*';
                if (k !== filterArray[i].contents.length - 1) {
                  tempQueryName = tempQueryName + ' OR ';
                }
              }
            }
            else if (filterArray[i].dbFilterName === ConstantService.FILTER_DESCRIPTION_TEXT) {
              for (var m = 0; m < filterArray[i].contents.length; m++) {
                tempDescription = tempDescription + filterArray[i].contents[m] + '*';
                if (m !== filterArray[i].contents.length - 1) {
                  tempDescription = tempDescription + ' OR ';
                }
              }
            }
          }
          else {
            for (var j = 0; j < filterArray[i].contents.length; j++) {
              temp.push(filterArray[i].dbFilterName + ' eq \'' + filterArray[i].contents[j] + '\'');
            }

          }
        }
        if (temp.length > 0) {
          filters.push(temp);
        }
      }
      //Joining OR condition
      for (i = 0; i < filters.length; i++) {
        andFilter.push('(' + filters[i].join(' or ') + ')');
      }
      //Applying AND condition
      if (andFilter.length > 0) {
        qFilter = '$filter=' + andFilter.join(' and ');
        masterQueryParameter.push(qFilter);
      }
    }
    startIndex = (pageNumber - 1) * queryPerPage;
    endIndex = startIndex + queryPerPage;
    qTop = '$top=' + (endIndex - startIndex);
    qSkip = '$skip=' + startIndex;
    masterQueryParameter.push(qTop);
    masterQueryParameter.push(qSkip);
    if (selectedSort.sortedBy && selectedSort.sortOrder) {
      sortFields = selectedSort.sortedBy + ' ' + selectedSort.sortOrder;
      if (selectedSort.secondarySort) {
        if (selectedSort.secondarySort.indexOf(',') >= 0) {
          var eachSortField = selectedSort.secondarySort.split(',');
          for (var n = 0; n < eachSortField.length; n++) {
            sortFields += ',' + eachSortField[n] + ' ' + selectedSort.sortOrder;
          }
        } else {
          sortFields += ',' + selectedSort.secondarySort + ' ' + selectedSort.sortOrder;
        }
      }
      qOrderBy = '$orderby=' + sortFields;
      masterQueryParameter.push(qOrderBy);
    }
    url = url + '(IN_DESCRIPTION=\'*' + tempDescription + '\',' + 'IN_QUERY_NAME=\'*' + tempQueryName + '\')/Results?';
    return url + masterQueryParameter.join('&');
  };
  /**
   * Get the Filter Contents when a filter is clicked.
   * @param queryParams,key
   * @returns {*}
   */
  query.getFilterContent = function (queryParams, key) {
    var deferred = $q.defer();
    var odataURL = UrlService.getService('GET_QUERY_LIBRARY');
    odataURL += '(IN_DESCRIPTION=\'*\',IN_QUERY_NAME=\'*\')/Results?' + queryParams;
    $http.get(odataURL)
      .success(function (response) {
        var res = response.d.results, filterList = angular.copy(QueryEntity);
        _.each(res, function (list) {
          filterList.contents.push(list[key]);
        });
        deferred.resolve({
          'data': filterList,
          'message': LanguageService.MESSAGES.FAILED_TO_GET_REPORT_FILTER_CONTENT
        });
      })
      .error(function () {
        deferred.resolve({
          'error': 'ok',
          'message': LanguageService.MESSAGES.FAILED_TO_GET_REPORT_FILTER_CONTENT
        });
      });
    return deferred.promise;
  };

  query.fnUpdateCaseList = function (payload) { // ADDED, REMOVED, ANNOTATED
    var deferred = $q.defer();
    var errorMessage = LanguageService.MESSAGES.FAILED_TO_CREATE_CASE_LIST;
    var url = UrlService.getService('UPDATE_CASELIST');
    var headers = {'content-type': 'application/json'};
    $http({'method': 'PUT', 'url': url, 'data': payload, 'header': headers})
      .success(function (response) {
        try {
          if (!response.error) {
            deferred.resolve({'data': angular.copy(response), 'message': ''});
            alertService.success(LanguageService.MESSAGES.CASE_LIST_UPDATE_SUCCESS);
          }
          else {
            alertService.warn(LanguageService.MESSAGES.FAILED_TO_UPDATE_CASE_LIST);
            deferred.resolve({'error': 'ok', 'message': errorMessage});
          }
        } catch (e) {
          alertService.warn(LanguageService.LanguageService.MESSAGES.FAILED_TO_UPDATE_CASE_LIST);
          deferred.resolve({'error': 'ok', 'message': errorMessage});
        }
      }).error(function () {
      alertService.warn(LanguageService.LanguageService.MESSAGES.FAILED_TO_UPDATE_CASE_LIST);
      deferred.resolve({'error': 'ok', 'message': errorMessage});
    });
    return deferred.promise;
  };
  query.saveShareQuery = function (payload) {
    var deferred = $q.defer();
    var payloadData = payload;
    var method = 'POST';
    var url = UrlService.getService('SHARE_QUERY_LIBRARY');
    var headers = {'content-type': 'application/json', 'Accept': 'application/json'};
    var errorMessage = LanguageService.MESSAGES.FAILED_SAVE_SHARE_QUERY;
    var successMessage = LanguageService.MESSAGES.SUCCESS_SAVE_SHARE_QUERY;
    $http({
      'method': method,
      'url': url,
      'data': payloadData,
      'header': headers
    })
      .success(function (response) {
        if (response !== null) {
          deferred.resolve({'data': response, 'message': successMessage});
          alertService.success(successMessage);
        } else {
          deferred.resolve({'error': 'ok', 'message': errorMessage});
        }
      })
      .error(function (response) {
          try {
            if (response && response.status === 400) {
              errorMessage += '. ' + (response.result.STATUS[0] && response.result.STATUS[0].DETAIL);
            }
            alertService.error(errorMessage);
            deferred.resolve({'error': 'ok', 'message': errorMessage});
          } catch (e) {
            alertService.error(errorMessage);
          }
        }
      );
    return deferred.promise;
  };

  //To save the payload in the library
  query.saveQueryToLibrary = function (queryName, queryDescription, saveMode, setQueries) {
    var deferred = $q.defer();
    var url = UrlService.getService('QUERY_LIBRARY_BUILDER_CREATE');
    var payload = query.computeQuerySavePayload(queryName, queryDescription, saveMode, setQueries);
    var method;
    // Creation will be 'POST' and update will be 'PUT'
    switch (saveMode) {
      case ConstantService.SAVE_AS_QUERY :
        method = 'POST';
        break;
      case ConstantService.SAVE_QUERY :
        method = ( query.data.queryContext.key === 0 ) ? 'POST' : 'PUT';
        break;
    }
    var headers = {'content-type': 'application/json', 'Accept': 'application/json'};
    var errorMessage = LanguageService.MESSAGES.FAILED_SAVE_QUERY_LIBRARY_SAME_NAME;
    var successMessage = (method === 'POST') ? LanguageService.MESSAGES.SUCCESS_SAVE_QUERY_LIBRARY
      : LanguageService.MESSAGES.SUCCESS_UPDATE_QUERY_LIBRARY;
    $http({
      'method': method,
      'url': url,
      'data': payload,
      'header': headers
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
      });
    return deferred.promise;
  };

  query.getOperatorDimensionInfo = function (callback) {
    query.getDimensionInfo().then(function (response) {
      query.data.dimensionsList.length = 0;
      angular.forEach(response.data, function (dimensionInput) {
        query.data.dimensionsList.push(dimensionInput);
      });
      query.getOperatorInfo().then(function (response1) {
        query.data.operatorsList.length = 0;
        angular.forEach(response1.data, function (operatorInput) {
          query.data.operatorsList.push(operatorInput);
        });
        if (callback instanceof Function) {
          callback();
        }
      });
    });
  };

  query.getOperatorInfo = function () {
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

  query.computeShareQueryPayload = function (sharedQueryDetail) {
    var payload = {};
    payload.SELECT_ALL = (sharedQueryDetail.includeAllUserData) ? 1 : 0;
    payload.QUERY_KEY = query.data.queryContext.key;
    payload.data = [];
    for (var i = 0; i < sharedQueryDetail.selectedUsersGroup.length; i++) {
      var temp = {};
      temp.NAME = sharedQueryDetail.selectedUsersGroup[i].name;
      temp.OBJ_TYPE = sharedQueryDetail.selectedUsersGroup[i].type;
      temp.GROUP_ID = sharedQueryDetail.selectedUsersGroup[i].userGroupKey;
      temp.USER_ID = sharedQueryDetail.selectedUsersGroup[i].userKey;
      payload.data.push(temp);
    }
    return payload;
  };

  query.getSelectedUser = function () {
    var deferred = $q.defer();
    var errorMessage = LanguageService.MESSAGES.FAILED_TO_GET_SELECTED_USER;
    var url = UrlService.getService('SHARE_QUERY_LIBRARY');
    url += '?QUERY_KEY=' + query.data.queryContext.key;
    $http.get(url)
      .success(function (response) {
        try {
          query.selectedUserGroupInfo = response;
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

  query.getDimensionInfo = function () {
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
  query.fnDeleteQueryService = function (payload) {
    var deferred = $q.defer();
    var errorMessage = LanguageService.MESSAGES.FAILED_TO_DELETE_QUERY;
    var url = UrlService.getService('DELETE_QUERY') + 'QUERY_KEY=' + payload.QUERY_KEY;
    var headers = {'content-type': 'application/json'};
    $http({'method': 'DELETE', 'url': url, 'data': payload, 'header': headers})
      .success(function (response) {
        try {
          if (!response.error) {
            //delete query code
            deferred.resolve({'data': angular.copy(response), 'message': ''});
            alertService.success(LanguageService.MESSAGES.SUCCESS_DELETE_QUERY);
          }
          else {
            alertService.warn(LanguageService.MESSAGES.FAILED_TO_DELETE_QUERY);
            deferred.resolve({'error': 'ok', 'message': errorMessage});
          }
        } catch (e) {
          alertService.warn(LanguageService.MESSAGES.FAILED_TO_DELETE_QUERY);
          deferred.resolve({'error': 'ok', 'message': errorMessage});
        }
      }).error(function () {
      alertService.warn(LanguageService.MESSAGES.FAILED_TO_DELETE_QUERY);
      deferred.resolve({'error': 'ok', 'message': errorMessage});
    });
    return deferred.promise;
  };


  return query;
}]);

