'use strict';

angular.module('saintApp').factory('ReportFactory', ['PreferencesFactory', 'SignalEntity', 'ReportTypeEntity', 'ReportEntity', '$http', '$q', 'UrlService', 'alertService', 'LanguageService', 'ConstantService', 'ReportMileStoneEntity', 'IngredientEntity', 'UserEntity', 'DateService', 'ReportCategoryEntity', 'StringOperationsService','CaseListFactory','QueryGeneratorService','AdditionalReportsEntity','SubReportEntity', function (PreferencesFactory, SignalEntity, ReportTypeEntity, ReportEntity, $http, $q, UrlService, alertService, LanguageService, ConstantService, ReportMileStoneEntity, IngredientEntity, UserEntity, DateService, ReportCategoryEntity, StringOperationsService,CaseListFactory,QueryGeneratorService,AdditionalReportsEntity,SubReportEntity) {
  var report = function (data) {
    angular.extend(this, data);
  };
  report.data = {
    list: [],
    checkedDateBoxes : [],
    reportNames: [],
    reportStatus: [],
    reportTypes: [],
    reportTiles: [],
    reportDetails: null,
    filteredReports: [],
    reportTypeList: [],
    favouriteList: [],
    statusList: [],
    operationalTypes: [],
    selectedDetailReportIndex: null,
    filterConfig: [],
    persistedData: [],
    selectedFilters: [],
    selectedTileId: null,
    reportSort: {
      sortedBy: null,
      secondarySort: null,
      sortedByName: null,
      sortOrder: null
    },
    watchInitialization:false,
    reportPanelState: null,//HIDDEN:COLLAPSED:EXPANDED
    filterPanelState: null,//EXPANDED:COLLAPSED
    reportPanelDetails: [],
    selectedGanttBarID: null,
    ganttChartView: '' //MONTH:YEAR; By default the view is month view for all users (@uthored by: bhdwivedi)
  };
  report.bPersist = true;

  //delete report
  report.deleteReport = function(payload){
    var deferred = $q.defer();
    var errorMessage = LanguageService.MESSAGES.FAILED_TO_DELETE_REPORT;
    var url = UrlService.getService('DELETE_REPORT') + '(' + payload.RPT_KEY + ')';
    var headers = {'content-type': 'application/json','accept': 'application/json'};
    $http({'method': 'PUT', 'url': url, 'data': payload, 'header': headers})
      .success(function (response) {
        try {
          if(!response.error){
            //delete report code
            deferred.resolve({'data': angular.copy(response), 'message': ''});
            alertService.success(LanguageService.MESSAGES.SUCCESS_DELETE_REPORT);
          }
          else {
            alertService.warn(LanguageService.MESSAGES.FAILED_TO_DELETE_REPORT);
            deferred.resolve({'error': 'ok', 'message': errorMessage});
          }
        } catch (e) {
          alertService.warn(LanguageService.MESSAGES.FAILED_TO_DELETE_REPORT);
          deferred.resolve({'error': 'ok', 'message': errorMessage});
        }
      }).error(function () {
      alertService.warn(LanguageService.MESSAGES.CANNOT_DELETE_REPORT);
      deferred.resolve({'error': 'ok', 'message': errorMessage});
    });
    return deferred.promise;
  };

  report.extractFilterObject = function ($stateParams) {
    var filters = [];
    _.each($stateParams, function (value, key) {
      var temp = {};
      if (key === ConstantService.FILTER_STATUS_KEY) {
        try {
          temp = {};
          temp.filterName = 'Status';
          temp.dbFilterName = key;
          temp.contents = value.split(',');
          temp.category = 'Overdue';
          filters.push(temp);
        } catch (e) {
        }
      } else if (key === ConstantService.DB_KEY_DUE_DAYS) {
        try {
          temp = {};
          temp.filterName = ConstantService.DB_KEY_DUE_DAYS;
          temp.dbFilterName = key;
          temp.contents = value.split(',');
          temp.category = ConstantService.FILTER_CATEGORY_NUMBER;
          filters.push(temp);
        } catch (e) {
        }
      } else if (key === ConstantService.DB_KEY_RPT_CAT_KEY) {
        try {
          temp = {};
          temp.filterName = 'Report Category';
          temp.dbFilterName = key;
          temp.contents = [value];
          temp.category = ConstantService.FILTER_CATEGORY_NUMBER;
          filters.push(temp);
        } catch (e) {
        }
      }
    });
    return filters;
  };

  report.persistPreference = function (key, value, screenName, isSessionBased) {
    if (report.bPersist) {
      PreferencesFactory.persistPreference(key, value, screenName || ConstantService.MANAGE_REPORTS_SCREEN, function (data) {
        if (data) {
          report.data.persistedData = data; // DELETE will update this shared data
        }
        return report.data.persistedData;

      }, isSessionBased || ConstantService.NOT_SESSION_BASED);
    }
  };

  report.syncSharedObjectWithPersistedData = function () {
    var selectedFilters = [];
    var selectedTileId = null;
    var selectedSort = null;
    var reportPanelState = null;
    var filterPanelState = null;
    var ganttChartView=null;

    _.each(report.data.persistedData, function (object) {

      //Prepare Report Panel State variable
      if (object.persistedKey === 'REPORT_PANEL_STATE') {
        reportPanelState = object.persistedValue;
      }
      //Prepare Filter Panel State variable
      else if (object.persistedKey === 'FILTER_PANEL_STATE') {
        filterPanelState = object.persistedValue;
      }
      //Prepare selectedSort variable
      else if (object.persistedKey === 'SORT_REPORT') {
        selectedSort = object.persistedValue;
      }
      //Selected Report ID
      else if (object.persistedKey === 'CURR_REPORT_ID') {
        if (object.persistedValue) {
          selectedTileId = parseInt(object.persistedValue);
        }
      }
      //Prepare selectedFilters variable
      else if (object.persistedKey.split('_')[0].toUpperCase() === 'FILTER') {
        if (object.persistedValue) { // Insert only non-null filters
          if (typeof object.persistedValue === 'object') {
            selectedFilters.push(object.persistedValue);
          }
        }
      }
      //Prepare gnatChartView
      else if(object.persistedKey===ConstantService.GANTT_CHART_VIEW){
        ganttChartView=object.persistedValue?object.persistedValue:ConstantService.MONTH_VIEW;
      }
    });
    report.data.ganttChartView = ganttChartView;
    if(report.bPersist) {
      report.data.selectedFilters = selectedFilters;
    }
    report.data.reportPanelState = reportPanelState;
    report.data.filterPanelState = filterPanelState;
    report.data.selectedTileId = selectedTileId;
    report.data.reportSort = selectedSort || {
        'sortedBy': ConstantService.REPORT_LIBRARY_DEFAULT_SORT_KEY,
        'sortedByName': ConstantService.REPORT_LIBRARY_DEFAULT_SORT_NAME,
        'sortOrder': ConstantService.ASCENDING,
        'secondarySort': ConstantService.DB_KEY_REPORT_TYPE + ',' + ConstantService.DB_KEY_DUE_DAYS
      };
  };

  report.updateReportStatus = function (statusPayload, reportKey, urlKey) {
    var deferred = $q.defer();
    var payload = statusPayload;
    var headers = {'content-type': 'application/json'};
    var url = UrlService.getService('UPDATE_REPORT_STATUS') + urlKey + '(' + reportKey + ')';
    $http({
      'method': 'PUT',
      'url': url,
      'data': payload,
      'header': headers
    })
      .success(function (response) {
        if (response !== null) {

          deferred.resolve({'data': response, 'message': LanguageService.MESSAGES.SUCCESS_UPDATE_STATUS});

        } else {
          alertService.warn(LanguageService.MESSAGES.FAILED_UPDATE_STATUS);
          deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_UPDATE_STATUS});
        }
      })
      .error(function () {
        alertService.error(LanguageService.MESSAGES.FAILED_UPDATE_STATUS);
        deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_UPDATE_STATUS});
      });
    return deferred.promise;
  };
  report.updateReportMode = function(modePayload,reportKey){
    var deferred = $q.defer();
    var payload = modePayload;
    var headers = {'content-type': 'application/json'};
    var url = UrlService.getService('UPDATE_REPORT_MODE') + '(' + reportKey + ')';
    $http({
      'method': 'PUT',
      'url': url,
      'data': payload,
      'header': headers
    })
      .success(function (response) {
        if (response !== null) {
          deferred.resolve({'data': response, 'message': LanguageService.MESSAGES.SUCCESS_UPDATE_STATUS});
        } else {
          alertService.warn(LanguageService.MESSAGES.FAILED_UPDATE_STATUS);
          deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_UPDATE_STATUS});
        }
      })
      .error(function () {
        alertService.error(LanguageService.MESSAGES.FAILED_UPDATE_STATUS);
        deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_UPDATE_STATUS});
      });
    return deferred.promise;

  };
  report.addFinaltoInprogressComments = function (statusPayload, reportKey) {
    var deferred = $q.defer();
    var payload = statusPayload;
    var headers = {'content-type': 'application/json'};
    var url = UrlService.getService('UPDATE_REPORT_STATUS') + '/CommentsUpdate(' + reportKey + ')';
    $http({
      'method': 'PUT',
      'url': url,
      'data': payload,
      'header': headers
    })
      .success(function (response) {
        if (response !== null) {
          deferred.resolve({'data': response, 'message': LanguageService.MESSAGES.SUCCESS_UPDATE_STATUS});
        } else {
          alertService.warn(LanguageService.MESSAGES.FAILED_UPDATE_STATUS);
          deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_UPDATE_STATUS});
        }
      })
      .error(function () {
        alertService.error(LanguageService.MESSAGES.FAILED_UPDATE_STATUS);
        deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_UPDATE_STATUS});
      });
    return deferred.promise;

  };
 report.fnGeneratePayloadForStatusUpdate=function(reportKey,comments,dateSubmitted){
   if(dateSubmitted === undefined){
     dateSubmitted='1454288218000';
   }
   var statusPayload = {
     'RPT_KEY': reportKey,
     'RPT_NAME': '',
     'DESCRIPTION': '',
     'IS_BLINDED': 1,
     'SUBMITTED_DATE': '/Date('+ dateSubmitted+')/',
     'FK_RPT_TYPE_KEY': null,
     'FK_STATUS_KEY': 0,
     'FK_BCL_KEY': 0,
     'FK_SCL_KEY': null,
     'COMMENTS': comments,
     'Audit.CreatedBy': '',
     'Audit.CreatedDt': '/Date(1453887956000)/',
     'Audit.UpdatedBy': '',
     'Audit.UpdatedDt': '/Date(1454288218000)/'
   };
   return statusPayload;
 };
  report.fnGeneratePayloadForModeUpdate=function(reportKey,mode){
    var modePayload = {
      'RPT_KEY':reportKey,
      'STATUS_MODE':mode
    };
    return modePayload;
  };
  report.fnmilestoneUpdate = function (milestoneStatusSave,url) {
        var deferred = $q.defer();
        var payload = milestoneStatusSave;
        var headers = {'content-type': 'application/json'};
        $http({
          'method': 'PUT',
          'url': url,
          'data': payload,
          'header': headers
        })
          .success(function (response) {
            if (response !== null) {
              deferred.resolve({'data': response, 'message': LanguageService.MESSAGES.MILESTONE_SAVED_SUCCESS});

            } else {
              alertService.warn(LanguageService.MESSAGES.FAILED_MILESTONE_SAVE);
              deferred.resolve({
                'error': 'ok',
                'message': LanguageService.MESSAGES.FAILED_TO_SAVE_MILESTONE_STATUS
              });
            }
          })
          .error(function () {
            alertService.error(LanguageService.MESSAGES.FAILED_SAVE_FAVOURITE);
            deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_TO_SAVE_MILESTONE_STATUS});
          });
        return deferred.promise;
  };
  report.getReportInformation = function (url) {
    var deferred = $q.defer();
    $http.get(url)
      .success(function (response) {
        try {
          var reportsList = response.d.results;
          report.data.reportPanelDetails = report.mapToEntityDetails(reportsList[0]);

          deferred.resolve({'data': report.data.reportPanelDetails, 'message': ''});
        } catch (e) {
          alertService.warn(LanguageService.MESSAGES.FAILED_GET_REPORTS_LIST);
          deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_GET_REPORTS_LIST});
        }
      })
      .error(function () {
        alertService.error(LanguageService.MESSAGES.FAILED_GET_REPORTS_LIST);
        deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_GET_REPORTS_LIST});
      });
    return deferred.promise;
  };


  report.mapToEntityDetails = function (reportPanelDetail) {
    var mappedReportDetailList = [];
    var temp = angular.copy(ReportEntity);
    var tempSignallingDetails = angular.copy(SignalEntity);
    var tempAdditionalReportsEntity = angular.copy(AdditionalReportsEntity);
    temp.users = [];
    temp.groups = [];
    temp.reportKey = reportPanelDetail.RPT_KEY;
    temp.reportID = reportPanelDetail.ID;
    temp.reportName = reportPanelDetail.RPT_NAME;
    temp.reportStartDate = DateService.getDateObjectFromBackendDateString(reportPanelDetail.RPT_START_DATE);
    temp.reportEndDate = DateService.getDateObjectFromBackendDateString(reportPanelDetail.RPT_END_DATE);
    temp.submittedDate = DateService.getDateObjectFromBackendDateString(reportPanelDetail.SUBMITTED_DATE);
    temp.submissionDate = DateService.getDateObjectFromBackendDateString(reportPanelDetail.SUBMISSION_DUE_DATE);
    temp.reportUpdatedDate = DateService.getDateObjectFromBackendDateString(reportPanelDetail[ConstantService.AUDIT_UPDATEDDT]);
    temp.baseCaseListKey = reportPanelDetail.BCL_KEY;
    temp.reportLicenses = [];
    temp.reportProducts = [];
    temp.additionalReports = [];
    temp.caseListDesc = reportPanelDetail.BCL_DESCRIPTION;
    temp.baseCaseListKey = reportPanelDetail.BCL_KEY;
    temp.reportDesc = reportPanelDetail.DESCRIPTION;
    temp.reportStatus = reportPanelDetail.STATUS_NAME;
    temp.reportMode = reportPanelDetail.STATUS_MODE;
    temp.isBlinded = reportPanelDetail.IS_BLINDED;
    temp.reportOwner = reportPanelDetail.FK_RPT_OWNER_KEY;
    temp.nonSeriousListMedWatchReports = (reportPanelDetail.NS_MEDWATCH_RPTS_FLAG === 1);
    temp.includeCasesNotPreviouslyReported = (reportPanelDetail.CASES_NT_PRE_RPTD_FLAG === 1);
    temp.eventReceiptDate = (reportPanelDetail.EVENT_RCPT_DT_FLAG === 1);
    temp.initialReceiptDate = (reportPanelDetail.INITIAL_RCPT_DT_FLAG === 1);
    temp.followReceiptDate = (reportPanelDetail.FOLLOWUP_RCPT_DT_FLAG === 1);
    temp.iCSRSubmissionDate = (reportPanelDetail.ICSR_SUBMISSION_DT_FLAG === 1);
    temp.otherReceiptType = (reportPanelDetail.OTHER_DT_FLAG === 1);
    temp.isProductBasedSelection = reportPanelDetail.PRODUCT_LICENSE_OPTION;
    temp.reportType = reportPanelDetail.FK_RPT_TYPE_KEY;
    temp.reportTypeName = reportPanelDetail.RPT_TYPE_NAME;
    temp.submissionRunDate = DateService.getDateObjectFromBackendDateString(reportPanelDetail.RUN_DATE);
    temp.submissionRunTime =(reportPanelDetail.RUN_TIME)?DateService.fnMsToTimeString(DateService.getDateObjectFromBackendDateString(reportPanelDetail.RUN_TIME)):null;
    temp.allDatesFlag = (reportPanelDetail.ALL_DATES_FLAG === 1);
    temp.routedDate = (reportPanelDetail.ROUTED_DT_FLAG === 1);
    temp.caseCompletionDate = (reportPanelDetail.CASE_COMPLETION_DT_FLAG === 1);
    temp.otherReceiptValue = (reportPanelDetail.ROUTED_DT_FLAG === 1) ? 0 : ((reportPanelDetail.CASE_COMPLETION_DT_FLAG === 1) ? 1 : null);
    temp.reportAsOfDateDetails = DateService.getDateObjectFromBackendDateString(reportPanelDetail.AS_OF_DATE);
    temp.cuid = reportPanelDetail.CUID;
    temp.bclKey = reportPanelDetail.BCL_KEY;
    if (temp.isProductBasedSelection === 1)//if it is License
    {
      angular.forEach(reportPanelDetail.IngredientsLicense.results, function (license) {
        var tempIngredients = angular.copy(IngredientEntity);
        tempIngredients.ingredientName = license.INGREDIENT_DESC;
        tempIngredients.ingredientId = license.INGREDIENT_CODE;
        temp.reportIngredients.push(tempIngredients);
        angular.forEach(license.ReportIngredientLicenses.results, function (eachLicense) {
          temp.reportLicenses.push({
            'licenseKey': eachLicense.LICENSE_KEY,
            'familyKey': tempIngredients.ingredientId,
            'licenseNumber': eachLicense.LIC_NUMBER,
            'licenseDesc': eachLicense.LICENSE_TYPE_DESC
          });
        });
      });
    }
    else {
      angular.forEach(reportPanelDetail.ReportIngredients.results, function (value) {
        var tempIngredients = angular.copy(IngredientEntity);
        tempIngredients.ingredientName = value.INGREDIENT_DESC;
        temp.reportIngredients.push(tempIngredients);
        if (value.ReportIngredientProducts.results) {
          angular.forEach(value.ReportIngredientProducts.results, function (products) {
            var newProduct = {};
            newProduct.productKey = products.PRODUCT_KEY;
            newProduct.productName = products.TRADE_NAME;
            newProduct.productDisplayName = products.TRADE_NAME + ',' + products.FORMULATION_DESC;
            newProduct.familyKey = products.FAMILY_CODE;
            newProduct.familyName = products.FAMILY_DESC;
            temp.reportProducts.push(newProduct);
          });
        }
      });
    }
    for (var i = 0; i < temp.reportIngredients.length; i++) {
      if (temp.reportIngredientsNames.indexOf(temp.reportIngredients[i].ingredientName) === -1) {
        temp.reportIngredientsNames.push(temp.reportIngredients[i].ingredientName);
      }
    }
    temp.baseCaseListName = reportPanelDetail.BCL_NAME;
    temp.bclDisplayName = reportPanelDetail.BCL_DISPLAY_NAME;
    temp.baseCaseListCustomName = StringOperationsService.getFormattedCaseListName(temp.reportIngredientsNames, temp.reportStartDate, temp.reportEndDate);
    temp.baseCaseListCustomName = reportPanelDetail.BCL_DISPLAY_NAME;
    temp.reportName = reportPanelDetail.RPT_NAME;
    temp.reportCustomName = reportPanelDetail.REPORT_DISPLAY_NAME;
    temp.reportAssignees = reportPanelDetail.ReportAssignees;

    /**
     * Making it backward compatible with the previous implementation
     */
    reportPanelDetail.ReportUsers = _.filter(reportPanelDetail.ReportAssignees.results, {
      'OBJ_TYPE': ConstantService.USER_ENTITY
    });
    reportPanelDetail.ReportUsersGroups = _.filter(reportPanelDetail.ReportAssignees.results, {
      'OBJ_TYPE': ConstantService.GROUP_ENTITY
    });

    angular.forEach(reportPanelDetail.ReportUsers, function (value) {
      var tempUsers = angular.copy(UserEntity);
      tempUsers.name = value.NAME; //FIXME align to entity object field userName
      tempUsers.userName = value.NAME;
      tempUsers.userKey = value.USER_ID;
      temp.users.push(tempUsers);
    });
    angular.forEach(reportPanelDetail.ReportUsersGroups, function (value) {
      var tempGroups = {};
      tempGroups.roleId = value.GROUP_ID;
      tempGroups.roleName = value.NAME;
      tempGroups.actualRoleName = value.NAME; //REmoved Description
      temp.groups.push(tempGroups);
    });
    tempSignallingDetails.comparatorStartDate = DateService.getDateObjectFromBackendDateString(reportPanelDetail.SIGNAL_COMP_START_DATE);
    tempSignallingDetails.comparatorEndDate = DateService.getDateObjectFromBackendDateString(reportPanelDetail.SIGNAL_COMP_END_DATE);
    tempSignallingDetails.cumulativeStartDate = DateService.getDateObjectFromBackendDateString(reportPanelDetail.SIGNAL_CUML_START_DATE);
    tempSignallingDetails.cumulativeEndDate = DateService.getDateObjectFromBackendDateString(reportPanelDetail.SIGNAL_CUML_END_DATE);
    tempSignallingDetails.threshold = reportPanelDetail.SIGNAL_THRESHOLD;
    tempSignallingDetails.denominatorType = (reportPanelDetail.SIGNAL_DENOM_CASE_FLAG === 1);
    tempSignallingDetails.denominatorValue = reportPanelDetail.SIGNAL_DENOMINATOR;
    tempSignallingDetails.comparatorPeriod = reportPanelDetail.FK_COMP_PERIOD_KEY;
    temp.signal = tempSignallingDetails;

    angular.forEach(reportPanelDetail.ReportMilestones.results, function (value) {
      var tempMilestone = angular.copy(ReportMileStoneEntity);
      tempMilestone.reportMilestoneDays = value.MILESTONE_DAYS;
      tempMilestone.milestoneName = value.MILESTONE_NAME;
      tempMilestone.reportMilestoneDate = DateService.getDateObjectFromBackendDateString(value.MILESTONE_DATE);
      tempMilestone.milestoneStatus = value.MILESTONE_STATUS;
      tempMilestone.milestoneKey = value.MILESTONE_KEY;
      tempMilestone.milestoneForeignKey = value.FK_RPT_KEY;
      tempMilestone.milestoneCreatedBy = value[ConstantService.AUDIT_CREATED_BY];
      tempMilestone.milestoneCreatedDate = DateService.getDateObjectFromBackendDateString(value[ConstantService.AUDIT_CREATED_DT]);
      tempMilestone.milestoneUpdatedDate = DateService.getDateObjectFromBackendDateString(value[ConstantService.AUDIT_UPDATED_DT]);
      tempMilestone.milestoneUpdatedBy = value[ConstantService.AUDIT_UPDATED_BY];
      tempMilestone.milestoneCompletionDate = DateService.getDateObjectFromBackendDateString(value.MS_COMPLETION_DATE);
      tempMilestone.assignedUserGroups = [];
      tempMilestone.assignedUsers = [];
      tempMilestone.preAssignedUsersGroups = value.MilestoneAssignees.results;

      angular.forEach(tempMilestone.preAssignedUsersGroups, function (userGroup) {
        if (userGroup.OBJ_TYPE === ConstantService.GROUP_ENTITY) {
          tempMilestone.assignedUserGroups.push({'roleId': parseInt(userGroup.GROUP_ID)});
        } else if (userGroup.OBJ_TYPE === ConstantService.USER_ENTITY) {
          tempMilestone.assignedUsers.push({'userKey': parseInt(userGroup.USER_ID)});
        }
      });
      temp.reportMilestones.push(tempMilestone);
    });
    angular.forEach(reportPanelDetail.ReportSetQuery.results, function (value) {
      if(value){
        CaseListFactory.callSetQueryMapping([value]);
        var querySets = CaseListFactory.data.caseListObject.queryBuilderObject.setEntities;
        if(querySets && querySets.length > 0) {
          temp.setQueryUI = QueryGeneratorService.computeDisplaySQL(querySets[0].jSON.group||querySets[0].jSON);
        }
      }
    });

    if (reportPanelDetail.FK_RPT_PACKAGE_KEY){
      tempAdditionalReportsEntity.reportKey = reportPanelDetail.RPT_KEY;
      tempAdditionalReportsEntity.reportTypeKey = reportPanelDetail.FK_RPT_TYPE_KEY;
      tempAdditionalReportsEntity.bclKey = reportPanelDetail.FK_BCL_KEY;
      tempAdditionalReportsEntity.bclName = reportPanelDetail.BCL_NAME;
      tempAdditionalReportsEntity.subReports = report.mapReportPackageEntity(reportPanelDetail.ReportPackage.results);
    }
    temp.additionalReports = tempAdditionalReportsEntity;
    mappedReportDetailList.push(temp);
    return mappedReportDetailList;
  };
  report.mapReportPackageEntity =function(reportPackage){
    var returnMappedOject = [];
    angular.forEach(reportPackage, function (subreport) {
      var mappedEntity = angular.copy(SubReportEntity);
      mappedEntity.bclKey = subreport.FK_BCL_KEY;
      mappedEntity.documentType= subreport.DOCUMENT_TYPE;
      mappedEntity.isSelectedInPackage= subreport.IS_SELECTED?true:false;
      mappedEntity.srtKey = subreport.FK_SRT_KEY;
      mappedEntity.subReportName= subreport.SRT_NAME;
      mappedEntity.templateName = subreport.RPT_TYPE_NAME + '_' + subreport.SRT_NAME;
      mappedEntity.bclName = subreport.BCL_NAME;
      mappedEntity.bclDisplayName = subreport.BCL_DISPLAY_NAME;
      mappedEntity.isMainReport = subreport.IS_MAIN_REPORT;
      mappedEntity.selectAllFlag = subreport.SELECT_ALL_FLAG?true:false;
      mappedEntity.packageId = subreport.RPT_PACKAGE_KEY;
      mappedEntity.isBlinded = subreport.IS_BLINDED?true:false;
      mappedEntity.isFinal = subreport.IS_FINAL?true:false;
      mappedEntity.instanceId=subreport.RPT_INSTANCE_ID;
      returnMappedOject.push(mappedEntity);
    });
    return returnMappedOject;
  };
  report.formatTileToEntity = function (reportTileList) {
    var formattedReportTileList = [];
    for (var i in reportTileList) {
      var tempObject = angular.copy(ReportEntity);
      tempObject.reportId = reportTileList[i].RPT_KEY;
      tempObject.reportCustomName = reportTileList[i].REPORT_DISPLAY_NAME;
      tempObject.reportDesc = reportTileList[i].DESCRIPTION;
      tempObject.reportCreationDate = reportTileList[i][ConstantService.AUDIT_CREATEDDT];
      tempObject.reportDueDays = reportTileList[i].DAYS_UNTIL_DUE;
      tempObject.reportStartDate = reportTileList[i].RPT_START_DATE;
      tempObject.reportEndDate = reportTileList[i].RPT_END_DATE;
      tempObject.reportStatus = reportTileList[i].STATUS_KEY;
      tempObject.reportSubmittedDate = reportTileList[i].SUBMITTED_DATE;
      tempObject.allDatesFlag = reportTileList[i].ALL_DATES_FLAG;
      tempObject.isReportPackage =reportTileList[i].FK_RPT_PACKAGE_KEY;
      formattedReportTileList.push(tempObject);
    }
    return formattedReportTileList;
  };
  report.getReports = function (url) {
    var deferred = $q.defer();
    $http.get(url)
      .success(function (response) {
        try {
          var reportsList = response.d.results;
          deferred.resolve({'data': reportsList, 'message': ''});
        } catch (e) {
          alertService.warn(LanguageService.MESSAGES.FAILED_GET_REPORTS_LIST);
          deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_GET_REPORTS_LIST});
        }
      })
      .error(function () {
        alertService.error(LanguageService.MESSAGES.FAILED_GET_REPORTS_LIST);
        deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_GET_REPORTS_LIST});
      });
    return deferred.promise;
  };
  report.getTileReports = function (payload) {
    var url = UrlService.getService('REPORT_TILE_LIBRARY');
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

            var reportsList = report.formatTileToEntity(response.result);
            report.data.reportTiles = reportsList;
            deferred.resolve({'data': reportsList, 'count':response.count.COUNTS, 'message': ''});
        } catch (e) {
          alertService.warn(LanguageService.MESSAGES.FAILED_GET_REPORTS_LIST);
          deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_GET_REPORTS_LIST});
        }
      })
      .error(function (response) {
        if (response.status === 500) {
          alertService.error(response.data.errorMessage + '. ');
        }else {
          alertService.error(LanguageService.MESSAGES.FAILED_GET_REPORTS_LIST);
          deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_GET_REPORTS_LIST});
        }});
    return deferred.promise;
  };
  report.getFilterConfig = function (param) {
    var deferred = $q.defer();
    var queryParams = {$filter: 'CONFIG_TYPE eq \'' + param + '\' and SCREEN_NAME eq \'REPORT_LIBRARY\' and VALUE eq 1'};
    var url = UrlService.getService('REPORT_FILTER_CONFIGURATION', queryParams);
    $http.get(url)
      .success(function (response) {
        try {
          var filterConfig = [];
          _.each(response.d.results, function (object) {
            var actualObject = angular.copy(ReportEntity);
            actualObject.filterName = object.KEY;
            actualObject.active = parseInt(object.VALUE) === 1 ? true : false;
            actualObject.configKey = object.CONFIG_KEY;
            actualObject.searchActive = true; //Configurable from backend to show search field or not
            actualObject.filterType = object.KEY_TYPE || null;
            actualObject.columnName = object.KEY_NAME;
            actualObject.primarySort = object.PRIMARY_SORT;
            actualObject.secondarySort = object.SECONDARY_SORT;
            filterConfig.push(actualObject);
          });
          report.data.filterConfig = filterConfig;
          deferred.resolve({'data': filterConfig, 'message': ''});
        } catch (e) {
          alertService.warn(LanguageService.MESSAGES.FAILED_TO_GET_REPORT_FILTER_CONFIGURATION);
          deferred.resolve({
            'error': 'ok',
            'message': LanguageService.MESSAGES.FAILED_TO_GET_REPORT_FILTER_CONFIGURATION
          });
        }
      })
      .error(function () {
        alertService.error(LanguageService.MESSAGES.FAILED_TO_GET_REPORT_FILTER_CONFIGURATION);
        deferred.resolve({
          'error': 'ok',
          'message': LanguageService.MESSAGES.FAILED_TO_GET_REPORT_FILTER_CONFIGURATION
        });
      });
    return deferred.promise;
  };
  report.getFilterContent = function (queryParams, key) {
    var deferred = $q.defer();
    var odataURL = UrlService.getService('FILTER_BY_CATEGORY', queryParams);
    $http.get(odataURL)
      .success(function (response) {
        var res = response.d.results, filterList = angular.copy(ReportEntity);
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

  report.getTileReportsCount = function (url) {
    var deferred = $q.defer();
    $http.get(url)
      .success(function (response) {
        try {
          deferred.resolve({'data': response, 'message': ''});
        } catch (e) {
          alertService.warn(LanguageService.MESSAGES.FAILED_GET_REPORTS_LIST_COUNT);
          deferred.resolve({
            'error': 'ok',
            'message': LanguageService.MESSAGES.FAILED_GET_REPORTS_LIST_COUNT
          });
        }
      })
      .error(function () {
        alertService.error(LanguageService.MESSAGES.FAILED_GET_REPORTS_LIST_COUNT);
        deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_GET_REPORTS_LIST_COUNT});
      });
    return deferred.promise;
  };
  report.fnSaveCreatedReport = function (report) {
    var deferred = $q.defer();

    var payload = {
      'status': null,
      'data': {
        'REPORT_DETAILS': {
          'RPT_KEY': -1,
          'RPT_NAME': report.reportName,
          'DESCRIPTION': report.reportDesc,
          'FK_RPT_TYPE_KEY': report.reportType.reportKey,
          'RPT_CAT_KEY': report.reportType.reportId,
          'REPORT_DISPLAY_NAME': report.reportCustomName,
          'FK_RPT_OWNER_KEY': report.reportOwner && parseInt(report.reportOwner.userId)
        },
        'BASECASELIST_DETAILS': {
          'BCL_KEY': -1,
          'BCL_NAME': report.baseCaseListName,
          'BCL_DISPLAY_NAME': report.baseCaseListCustomName,
          'DESCRIPTION': report.reportDesc,
          'ALL_DATES_FLAG': (report.allDatesFlag ? 1 : 0),
          'RPT_START_DATE': DateService.getMillisecondsInUTCTimeZone(report.reportStartDate),
          'RPT_END_DATE': DateService.getMillisecondsInUTCTimeZone(report.reportEndDate),
          'AS_OF_DATE': DateService.getMillisecondsInUTCTimeZone(report.reportAsOfDateDetails),
          'SUBMISSION_DUE_DATE': DateService.getMillisecondsInUTCTimeZone(report.submissionDate),
          'RUN_DATE': DateService.getMillisecondsInUTCTimeZone(report.submissionRunDate),
          'RUN_TIME': (report.submissionRunTime)?DateService.fnTimeStringToMs(report.submissionRunTime):null,
          'NS_MEDWATCH_RPTS_FLAG': (report.nonSeriousListMedWatchReports ? 1 : 0),
          'CASES_NT_PRE_RPTD_FLAG': (report.includeCasesNotPreviouslyReported ? 1 : 0),
          'EVENT_RCPT_DT_FLAG': (report.eventReceiptDate ? 1 : 0),
          'INITIAL_RCPT_DT_FLAG': (report.initialReceiptDate ? 1 : 0),
          'FOLLOWUP_RCPT_DT_FLAG': (report.followReceiptDate ? 1 : 0),
          'ICSR_SUBMISSION_DT_FLAG': (report.iCSRSubmissionDate ? 1 : 0),
          'OTHER_DT_FLAG': (report.otherReceiptType ? 1 : 0),
          'SIGNAL_COMP_START_DATE': DateService.getMillisecondsInUTCTimeZone(report.signal.comparatorStartDate),
          'SIGNAL_COMP_END_DATE': DateService.getMillisecondsInUTCTimeZone(report.signal.comparatorEndDate),
          'SIGNAL_CUML_START_DATE': DateService.getMillisecondsInUTCTimeZone(report.signal.cumulativeStartDate),
          'SIGNAL_CUML_END_DATE': DateService.getMillisecondsInUTCTimeZone(report.signal.cumulativeEndDate),
          'SIGNAL_THRESHOLD': report.signal.threshold,
          'SIGNAL_DENOM_CASE_FLAG': (report.signal.denominatorType ? 1 : 0),
          'SIGNAL_DENOM_OTHER_FLAG': (report.signal.denominatorType ? 0 : 1),
          'SIGNAL_DENOMINATOR': (report.signal.denominatorType ? null : report.signal.denominatorValue),
          'ROUTED_DT_FLAG': (report.otherReceiptType ? (report.otherReceiptValue === 0 ? 1 : 0) : 0 ),
          'CASE_COMPLETION_DT_FLAG': (report.otherReceiptType ? (report.otherReceiptValue === 1 ? 1 : 0) : 0),
          'FK_COMP_PERIOD_KEY': (report.signal.comparatorPeriod ? report.signal.comparatorPeriod.key : null),
          'PRODUCT_LICENSE_OPTION': report.isProductBasedSelection
        },
        'REPORT_PRODUCTS': [],
        'REPORT_ASSIGNEES': [],
        'MILESTONEDETAILS': []
      }
    };
    angular.forEach(report.reportIngredients, function (ingredient) {
      if (report.isProductBasedSelection === ConstantService.PRODUCT_BASED_SELECTION) {
        angular.forEach(ingredient.products, function (product) {
          if (product.isSelected) {
            payload.data.REPORT_PRODUCTS.push({
              'FK_BCL_KEY': -1,
              'FK_FAMILY_CODE': ingredient.ingredientId,
              'FK_PRODUCT_KEY': product.productId,
              'FK_LICENSE_KEY': null
            });
          }
        });
      }
      else if (report.isProductBasedSelection === ConstantService.LICENSE_BASED_SELECTION) {
        angular.forEach(ingredient.licenses, function (license) {
          if (license.isSelected) {
            payload.data.REPORT_PRODUCTS.push({
              'FK_BCL_KEY': -1,
              'FK_FAMILY_CODE': ingredient.ingredientId,
              'FK_PRODUCT_KEY': null,
              'FK_LICENSE_KEY': license.licenseId
            });
          }
        });
      }
    });

    angular.forEach(report.selectedUsersGroup, function (usergroup) {
      var temp = {};
      temp.NAME = usergroup.name;
      temp.OBJ_TYPE = usergroup.type;
      temp.GROUP_ID = usergroup.userGroupKey;
      temp.USER_ID = usergroup.userKey;
      payload.data.REPORT_ASSIGNEES.push(temp);
    });
    angular.forEach(report.reportMilestones, function (milestone) {
      if ((milestone.milestoneName.length > 0) && (angular.isDate(milestone.reportMilestoneDate))) {
        var milestoneDetails = {
          'MILESTONE_KEY': -1,
          'MILESTONE_NAME': milestone.milestoneName,
          'MILESTONE_DAYS': milestone.offsetToReportDate,
          'MILESTONE_DATE': DateService.getMillisecondsInUTCTimeZone(milestone.reportMilestoneDate),
          'FK_RPT_KEY': -1
        };

        var milestoneAssignees = [];
        angular.forEach(milestone.postAssignedUserGroups, function (usergroup) {
          milestoneAssignees.push({
            'NAME': usergroup.name,
            'OBJ_TYPE': usergroup.type,
            'GROUP_ID': usergroup.userGroupKey,
            'USER_ID': usergroup.userKey
          });
        });

        payload.data.MILESTONEDETAILS.push({
          'MILESTONES': milestoneDetails,
          'MILESTONE_ASSIGNEES': milestoneAssignees
        });
      }
    });
    var headers = {'content-type': 'application/json'};
    $http({
      'method': 'POST',
      'url': UrlService.getService('SAVE_CREATED_REPORT'),
      'data': payload,
      'header': headers
    })
      .success(function (response) {
        if (response !== null) {
          deferred.resolve({'data': response.result, 'message': ''});
        } else {
          alertService.warn(LanguageService.MESSAGES.FAILED_SAVE_REPORT);
          deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_CREATE_REPORT});
        }
      })
      .error(function (response) {
        if (response.status === 500) {
          alertService.error(response.data.errorMessage + '. ' + LanguageService.MESSAGES.FAILED_CREATE_REPORT);
        }
        else {
          alertService.error(LanguageService.MESSAGES.FAILED_SAVE_REPORT);
        }
        deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_CREATE_REPORT});
      });
    return deferred.promise;
  };
  report.fnSaveEditedReport = function (report) {
    var deferred = $q.defer();
    var payload = {
      'status': null,
      'data': {
        'REPORT_DETAILS': {
          'RPT_KEY': report.reportKey,
          'RPT_NAME': report.reportName,
          'DESCRIPTION': report.reportDesc,
          'FK_RPT_TYPE_KEY': report.reportType.reportKey,
          'FK_BCL_KEY': report.baseCaseListKey,
          'RPT_CAT_KEY': report.reportType.reportId,
          'REPORT_DISPLAY_NAME': report.reportCustomName,
          'FK_RPT_OWNER_KEY': report.reportOwner && parseInt(report.reportOwner.userId)
        },
        'BASECASELIST_DETAILS': {
          'BCL_KEY': report.baseCaseListKey,
          'BCL_NAME': report.baseCaseListName,
          'BCL_DISPLAY_NAME': report.baseCaseListCustomName,
          'DESCRIPTION': report.reportDesc,
          'ALL_DATES_FLAG': (report.allDatesFlag ? 1 : 0),
          'RPT_START_DATE': DateService.getMillisecondsInUTCTimeZone(report.reportStartDate),
          'RPT_END_DATE': DateService.getMillisecondsInUTCTimeZone(report.reportEndDate),
          'AS_OF_DATE': DateService.getMillisecondsInUTCTimeZone(report.reportAsOfDateDetails),
          'SUBMISSION_DUE_DATE': DateService.getMillisecondsInUTCTimeZone(report.submissionDate),
          'RUN_DATE': DateService.getMillisecondsInUTCTimeZone(report.submissionRunDate),
          'RUN_TIME': (report.submissionRunTime)?DateService.fnTimeStringToMs(report.submissionRunTime):null,
          'NS_MEDWATCH_RPTS_FLAG': (report.nonSeriousListMedWatchReports ? 1 : 0),
          'CASES_NT_PRE_RPTD_FLAG': (report.includeCasesNotPreviouslyReported ? 1 : 0),
          'EVENT_RCPT_DT_FLAG': (report.eventReceiptDate ? 1 : 0),
          'INITIAL_RCPT_DT_FLAG': (report.initialReceiptDate ? 1 : 0),
          'FOLLOWUP_RCPT_DT_FLAG': (report.followReceiptDate ? 1 : 0),
          'ICSR_SUBMISSION_DT_FLAG': (report.iCSRSubmissionDate ? 1 : 0),
          'OTHER_DT_FLAG': (report.otherReceiptType ? 1 : 0),
          'SIGNAL_COMP_START_DATE': DateService.getMillisecondsInUTCTimeZone(report.signal.comparatorStartDate),
          'SIGNAL_COMP_END_DATE': DateService.getMillisecondsInUTCTimeZone(report.signal.comparatorEndDate),
          'SIGNAL_CUML_START_DATE': DateService.getMillisecondsInUTCTimeZone(report.signal.cumulativeStartDate),
          'SIGNAL_CUML_END_DATE': DateService.getMillisecondsInUTCTimeZone(report.signal.cumulativeEndDate),
          'SIGNAL_THRESHOLD': report.signal.threshold,
          'SIGNAL_DENOM_CASE_FLAG': (report.signal.denominatorType ? 1 : 0),
          'SIGNAL_DENOM_OTHER_FLAG': (report.signal.denominatorType ? 0 : 1),
          'SIGNAL_DENOMINATOR': (report.signal.denominatorType ? null : report.signal.denominatorValue),
          'ROUTED_DT_FLAG': (report.otherReceiptType ? (report.otherReceiptValue === 0 ? 1 : 0) : 0 ),
          'CASE_COMPLETION_DT_FLAG': (report.otherReceiptType ? (report.otherReceiptValue === 1 ? 1 : 0) : 0),
          'FK_COMP_PERIOD_KEY': (report.signal.comparatorPeriod ? report.signal.comparatorPeriod.key : null),
          'PRODUCT_LICENSE_OPTION': report.isProductBasedSelection,
          'VISUAL_QRY_FILTER_UI': report.setQueryUI || ''
        },
        'REPORT_PRODUCTS': [],
        'REPORT_ASSIGNEES': [],
        'MILESTONEDETAILS': []
      }
    };
    angular.forEach(report.reportIngredients, function (ingredient) {
      if (report.isProductBasedSelection === ConstantService.PRODUCT_BASED_SELECTION) {
        angular.forEach(ingredient.products, function (product) {
          if (product.isSelected) {
            payload.data.REPORT_PRODUCTS.push({
              'FK_BCL_KEY': report.baseCaseListKey,
              'FK_FAMILY_CODE': ingredient.ingredientId,
              'FK_PRODUCT_KEY': product.productId,
              'FK_LICENSE_KEY': null
            });
          }
        });
      }
      else if (report.isProductBasedSelection === ConstantService.LICENSE_BASED_SELECTION) {
        angular.forEach(ingredient.licenses, function (license) {
          if (license.isSelected) {
            payload.data.REPORT_PRODUCTS.push({
              'FK_BCL_KEY': report.baseCaseListKey,
              'FK_FAMILY_CODE': ingredient.ingredientId,
              'FK_PRODUCT_KEY': null,
              'FK_LICENSE_KEY': license.licenseId
            });
          }
        });
      }
    });

    angular.forEach(report.selectedUsersGroup, function (usergroup) {
      var temp = {};
      temp.NAME = usergroup.name;
      temp.OBJ_TYPE = usergroup.type;
      temp.GROUP_ID = usergroup.userGroupKey;
      temp.USER_ID = usergroup.userKey;
      payload.data.REPORT_ASSIGNEES.push(temp);
    });

    if (report.reportMilestones.length) {
      payload.data.MILESTONEDETAILS = [];
    }
    angular.forEach(report.reportMilestones, function (milestone) {
      if ((milestone.milestoneName.length > 0) && (angular.isDate(milestone.reportMilestoneDate))) {
        var milestoneDetails = {
          'MILESTONE_KEY': milestone.milestoneKey,
          'MILESTONE_NAME': milestone.milestoneName,
          'MILESTONE_DAYS': milestone.offsetToReportDate,
          'MILESTONE_DATE': DateService.getMillisecondsInUTCTimeZone(milestone.reportMilestoneDate),
          'FK_RPT_KEY': report.reportKey
        };

        var milestoneAssignees = [];
        angular.forEach(milestone.postAssignedUserGroups, function (usergroup) {
          milestoneAssignees.push({
            'NAME': usergroup.name,
            'OBJ_TYPE': usergroup.type,
            'GROUP_ID': usergroup.userGroupKey,
            'USER_ID': usergroup.userKey
          });
        });

        payload.data.MILESTONEDETAILS.push({
          'MILESTONES': milestoneDetails,
          'MILESTONE_ASSIGNEES': milestoneAssignees
        });
      }
    });
    var headers = {'content-type': 'application/json'};
    $http({
      'method': 'PUT',
      'url': UrlService.getService('SAVE_EDITED_REPORT'),
      'data': payload,
      'header': headers
    })
      .success(function (response) {
        if (response !== null) {
          deferred.resolve({'data': response.result, 'message': ''});
        } else {
          alertService.warn(LanguageService.MESSAGES.FAILED_SAVE_REPORT);
          deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_SAVE_REPORT});
        }
      })
      .error(function (response) {
        if (response.status === 500) {
          alertService.error(response.data.errorMessage + '. ' + LanguageService.MESSAGES.FAILED_SAVE_REPORT);
        }
        else {
          alertService.error(LanguageService.MESSAGES.FAILED_SAVE_REPORT);
        }
        deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_SAVE_REPORT});
      });
    return deferred.promise;
  };

  report.getReportTypes = function () {
    var deferred = $q.defer();
    $http.get(UrlService.getService('REPORT_LIST'))
      .success(function (response) {
        try {
          var reports = _.map(response.d.results, function (object) {
            var actualObject = angular.copy(ReportTypeEntity);
            actualObject.reportId = object.RPT_CAT_KEY; //For unit test cases
            actualObject.reportKey = object.RPT_TYPE_KEY;
            actualObject.reportType = object.RPT_TYPE_NAME;
            actualObject.isSignalingEnabled = object.SIGNALING_ENABLE_FLAG === 0 ? false : true;
            actualObject.description = ''; //For unit test cases
            return actualObject;
          });
          deferred.resolve({'data': reports, 'message': ''});
        } catch (e) {
          alertService.warn(LanguageService.MESSAGES.FAILED_GET_REPORT_TYPES);
          deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_GET_REPORT_TYPES});
        }
      })
      .error(function () {
        alertService.error(LanguageService.MESSAGES.FAILED_GET_REPORT_TYPES);
        deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_GET_REPORT_TYPES});
      });
    return deferred.promise;
  };
  report.updateReportTypes = function (reportsMap) {
    var deferred = $q.defer();
    var payload = reportsMap;
     var headers = {'content-type': 'application/json','Accept': 'application/json'};
     $http({
          'method': 'POST',
          'url': UrlService.getService('REPORT_LIST_UPDATE'),
          'data': payload,
          'header': headers
        })
        .success(function (response) {
             if (response !== null) {
               deferred.resolve({'data': response.result, 'message': ''});
             } else {
               alertService.warn(LanguageService.MESSAGES.FAILED_SAVE_FAVOURITE);
               deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_SAVE_FAVOURITE});
             }
           })
           .error(function () {
             alertService.error(LanguageService.MESSAGES.FAILED_SAVE_FAVOURITE);
             deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_SAVE_FAVOURITE});
           });

    return deferred.promise;
  };
  report.fnGenerateReport = function (details) {
    var deferred = $q.defer();
    var url = UrlService.getService('GENERATE_REPORT');
    var payload = details;
    var headers = {'content-type': 'application/json'};
    $http({'method': 'POST', 'url': url, 'data': payload, 'header': headers})
      .success(function (response) {
        try {
          deferred.resolve({'data': angular.copy(response), 'message': ''});
        } catch (e) {
          alertService.warn(LanguageService.MESSAGES.FAILD_TO_GENERATE_REPORT);
          deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILD_TO_GENERATE_REPORT});
        }
      }).error(function () {
      alertService.warn(LanguageService.MESSAGES.FAILD_TO_GENERATE_REPORT);
      deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILD_TO_GENERATE_REPORT});
    });
    return deferred.promise;
  };
  report.getMasterReportStatus = function () {
    var deferred = $q.defer();
    $http.get(UrlService.getService('GET_MASTER_REPORT_STATUS'))
      .success(function (response) {
        try {
          var statusList = [];
          _.each(response.d.results, function (object) {
            statusList.push(object.STATUS_NAME);
          });
          deferred.resolve({'data': statusList, 'message': ''});
        } catch (e) {
          alertService.warn(LanguageService.MESSAGES.FAILED_GET_REPORTS_STATUS);
          deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_GET_REPORTS_STATUS});
        }
      })
      .error(function () {
        alertService.error(LanguageService.MESSAGES.FAILED_GET_REPORTS_STATUS);
        deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_GET_REPORTS_STATUS});
      });
    return deferred.promise;
  };
  report.getWorkspaceReportCounts = function () {
    var deferred = $q.defer();
    $http.get(UrlService.getService('WORKSPACE_COUNTS'))
      .success(function (response) {
        try {
          var data = response.d.results[0];
          var tempData = {
            'reportsDue': data.ReportsDueIn30days,
            'reportsOverDue': data.ReportsOverdue,
            'reportsInProgress': data.ReportsPendingSubmission,
            'reportsCompleted': data.ReportsCompletedwithin30days
          };
          deferred.resolve({'data': tempData, 'message': ''});
        } catch (e) {
          alertService.warn(LanguageService.MESSAGES.FAILED_GET_HOME_PAGE_COUNT);
          deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_GET_HOME_PAGE_COUNT});
        }
      })
      .error(function () {
        alertService.error(LanguageService.MESSAGES.FAILED_GET_HOME_PAGE_COUNT);
        deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_GET_HOME_PAGE_COUNT});
      });
    return deferred.promise;
  };
  report.getGantChartData = function (url,payload) {
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
        var reports =response.result;
        var totalRecords = response.count.COUNTS;
        var result=[];
        angular.forEach(reports,function(object){
          var actualObject = angular.copy(ReportEntity);
          actualObject.reportName = object.RPT_NAME;
          actualObject.reportCustomName=object.REPORT_DISPLAY_NAME;
          actualObject.reportDesc = object.DESCRIPTION;
          actualObject.reportId = object.RPT_KEY;
          actualObject.reportKey = object.RPT_KEY;
          actualObject.reportCategory = angular.copy(ReportCategoryEntity);
          actualObject.reportCategory.reportCategoryTypeKey = object.RPT_CAT_KEY;
          actualObject.reportCategory.reportCategoryTypeName = object.RPT_CAT_NAME;
          if(object.RPT_START_DATE !== null){
            actualObject.reportStartDate = DateService.getDateObjectFromBackendDateString(object.RPT_START_DATE);
          }
          if(object.RPT_END_DATE !== null){
            actualObject.reportEndDate = angular.copy(new Date(DateService.getDateObjectFromBackendDateString(object.RPT_END_DATE).setHours(0,0,0,0)));
          }
          try {
            if (actualObject.reportCategory.reportCategoryTypeKey === 0) {
              actualObject.submissionDate = angular.copy(new Date(DateService.getDateObjectFromBackendDateString(object.SUBMISSION_DUE_DATE).setHours(0,0,0,0)));
              actualObject.submissionRunDate = null;
            } else {
              actualObject.submissionDate = null;
              actualObject.submissionRunDate = angular.copy(new Date(DateService.getDateObjectFromBackendDateString(object.RUN_DATE).setHours(0,0,0,0)));
            }
          } catch (e) {
            //FIXME need to remove this try catch once the backend is fixed
          }
          actualObject.statusId = object.STATUS_KEY;
          actualObject.status = object.STATUS_NAME;
          actualObject.milestones = [];
          angular.forEach(object.milestones,function(milestone){
            var tempMilestone = angular.copy(ReportMileStoneEntity);
            tempMilestone.milestoneKey = milestone.MILESTONE_KEY;
            tempMilestone.milestoneName = milestone.MILESTONE_NAME;
            tempMilestone.milestoneForeignKey = milestone.FK_RPT_KEY;
            tempMilestone.reportMilestoneDate = DateService.getDateObjectFromBackendDateString(milestone.MILESTONE_DATE);
            tempMilestone.milestoneStatus = milestone.MILESTONE_STATUS;
            tempMilestone.milesoneStatusDropDown = [{value: 0, name: 'Incomplete'},
              {value: 1, name: 'Complete'}];//Dropdown for milestone status
            tempMilestone.milestoneCompletedDate = DateService.getDateObjectFromBackendDateString(milestone.MS_COMPLETION_DATE);
            tempMilestone.reportMilestoneDays = milestone.MILESTONE_DAYS;
            tempMilestone.milestoneCreatedBy = milestone[ConstantService.AUDIT_CREATED_BY];
            tempMilestone.milestoneCreatedDate = DateService.getDateObjectFromBackendDateString(milestone[ConstantService.AUDIT_CREATED_DT]);
            tempMilestone.milestoneUpdatedDate = DateService.getDateObjectFromBackendDateString(milestone[ConstantService.AUDIT_UPDATED_DT]);
            tempMilestone.milestoneUpdatedBy = milestone[ConstantService.AUDIT_UPDATED_BY];
            tempMilestone.assignedUserGroups = [];
            tempMilestone.assignedUsers = [];

            /**
             * Making it backward compatible with the previous implementation
             */

            actualObject.milestones.push(tempMilestone);
          });
          result.push(actualObject);
        });
        deferred.resolve({'data': result,'count':totalRecords,message: ''});
      } catch (e) {
        alertService.warn(LanguageService.MESSAGES.FAILED_TO_GET_GANTTCHART_DATA);
        deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_TO_GET_GANTTCHART_DATA});
      }
    }).error(function () {
      alertService.warn(LanguageService.MESSAGES.FAILED_TO_GET_GANTTCHART_DATA);
      deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_TO_GET_GANTTCHART_DATA});
    });
    return deferred.promise;
  };
  report.getPayloadForMilestoneSaveGanttChart = function (milestones, milestoneStatus) {
    var payload = [];
    var completionDate;
    var validation = true;
    angular.forEach(milestones, function (value, key) {
      if (milestoneStatus[key] === true && value.milestoneStatus === 0) {
        if(!value.milestoneCompletedDate)
        {
          completionDate=new Date();
        } else {
         completionDate = new Date(value.milestoneCompletedDate);
        }
        if (!isNaN(completionDate)) {
          validation = true;
          payload.push({
            'MILESTONE_KEY': value.milestoneKey,
            'MILESTONE_NAME': value.milestoneName,
            'MILESTONE_DAYS': value.reportMilestoneDays,
            'MILESTONE_DATE': null,
            'MILESTONE_STATUS': milestoneStatus[key] === true ? 1 : 0,
            'FK_RPT_KEY': value.milestoneForeignKey,
            'Audit.CreatedBy': value.milestoneCreatedBy,
            'Audit.CreatedDt': null,
            'Audit.UpdatedBy': value.milestoneUpdatedBy,
            'Audit.UpdatedDt': null,
            'MS_COMPLETION_DATE': DateService.getMillisecondsInUTCTimeZone(completionDate)
          });
        }
        else {
          validation = false;
        }
      }
      else if(payload.length===0){
          validation = false;
      }
    });
    if (validation === true) {
      return payload;
    }
    else {
      return null;
    }
  };
  report.saveMilestoneGanttChart = function (milestones) {

    var deferred = $q.defer();
    var payload = milestones;
    var headers = {'content-type': 'application/json'};
    var url = UrlService.getService('REPORT_MILESTONE_SAVE');
    $http({
      'method': 'PUT',
      'url': url,
      'data': payload,
      'header': headers
    })
      .success(function (response) {
        if (response !== null) {
          deferred.resolve({'data': response, 'message': LanguageService.MESSAGES.SUCCESS_UPDATE_STATUS});

        } else {
          alertService.warn(LanguageService.MESSAGES.FAILED_UPDATE_STATUS);
          deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_UPDATE_STATUS});
        }
      })
      .error(function () {
        alertService.error(LanguageService.MESSAGES.FAILED_UPDATE_STATUS);
        deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_UPDATE_STATUS});
      });
    return deferred.promise;
  };
  report.generateOdataQueryParameters = function (filterArray, selectedSort, top, skip) {
    var description='';
    var payload = {
      data:{
        'count':'',
        'offset':'',
        'descriptions':'',
        'columnsSelected': ['RPT_NAME','RPT_CAT_KEY','RPT_CAT_NAME','SUBMISSION_DUE_DATE','RUN_DATE','RPT_TYPE_NAME','ALL_DATES_FLAG', 'SUBMITTED_DATE', 'REPORT_DISPLAY_NAME', 'RPT_START_DATE', 'RPT_END_DATE', 'DESCRIPTION', 'DAYS_UNTIL_DUE', 'STATUS_KEY','STATUS_NAME', 'Audit_CreatedDt', 'RPT_KEY'],
        'filters': {},
        'sort':{},
        'datesSelected': {}
      }};
    if (filterArray.length > 0) { //some filter parameters have been applied
      for (var i = 0; i < filterArray.length; i++) {
        if (filterArray[i].dbFilterName) { // Make Sure DB_FILTER_NAME is not null
          /**
           * Below function is to check if description is the filter category,
           * making search string as separate wildcard appended values to comply with fuzy search logic
           */
          if (filterArray[i].dbFilterName.split('_').pop() === ConstantService.FILTER_DATE_TEXT) { // This is a date filter
            var startDate = filterArray[i].contents[0].split(',')[0];
            var endDate = filterArray[i].contents[0].split(',')[1];
            startDate=new Date(startDate).toJSON();
            var endDateInDateFormat = new Date(endDate);
            endDate = new Date(endDateInDateFormat.getTime() + 24*60*60000).toJSON();///right now , if user chooses end date as 2nd feb,2016
            //from datepicker , the date that goes into the system is 2ndFeb,00:00:00 . So if we query to get cases with end date <= 2nd feb
            // , it actually translates to get end date <= 2ndFeb , 00:00:00 ,ie end date actually becomes 1st feb,23:59:59 effectively .
            // Hence , even though user wanted  to get cases with end date as 2nd feb , he will get cases till 1st feb only . Therefore ,
            // adding 24hours while querying
            if (startDate !== 'null' && endDate !== 'null') { // Both the dates exist
              payload.data.datesSelected[filterArray[i].dbFilterName]=[startDate,endDate];
            }
          }
          else if(filterArray[i].dbFilterName === ConstantService.DB_KEY_DUE_DAYS) { // Special case forward navigation to report library
            var start = filterArray[i].contents[0];
            var end = filterArray[i].contents[1];
            payload.data.datesSelected[filterArray[i].dbFilterName]=[start,end];
          }
          else{
            if (filterArray[i].dbFilterName === ConstantService.FILTER_DESCRIPTION_TEXT) { // This is special case for description
              for(var j=0;j<filterArray[i].contents.length;j++)
              {
                description = description + filterArray[i].contents[j]+'*';
                /**
                 * Append OR if more values are there.
                 */
                if(j!==filterArray[i].contents.length-1){
                  description = description + ' OR ';
                }}
              payload.data.descriptions=description;
            }
            else{
              payload.data.filters[filterArray[i].dbFilterName]=filterArray[i].contents;
            }
          }

        }
      }
    }
    if (selectedSort.sortedBy && selectedSort.sortOrder) {
      payload.data.sort[selectedSort.sortedBy]=selectedSort.sortOrder;
      if( selectedSort.secondarySort){
        if(selectedSort.secondarySort.indexOf(',')>=0){
          var eachSortField=selectedSort.secondarySort.split(',');
          for (var k = 0; k < eachSortField.length ; k++) {
            payload.data.sort[eachSortField[k]]=selectedSort.sortOrder;
          }
        }else{
          payload.data.sort[selectedSort.secondarySort]=selectedSort.sortOrder;
        }
      }
    }
    payload.data.count=top;
    payload.data.offset=skip;
    return payload;
  };
  report.getComparatorPeriodData = function () {
    var deferred = $q.defer();
    $http.get(UrlService.getService('COMPARATOR_PERIOD_DATA'))
      .success(function (response) {
        try {
          var comparatorArray = [];
          angular.forEach(response.d.results, function (comparatorPeriod) {
            comparatorArray.push({
              'name': comparatorPeriod.COMP_NAME,
              'days': comparatorPeriod.COMP_VALUE_IN_DAYS,
              'key': comparatorPeriod.COMP_PERIOD_KEY
            });
          });
          deferred.resolve({'data': comparatorArray, 'message': ''});
        } catch (e) {
          deferred.resolve({'error': 'ok', 'message': ''});
        }
      })
      .error(function () {
        deferred.resolve({'error': 'ok', 'message': ''});
      });
    return deferred.promise;
  };
  report.getStatusColorObject = function (status) {
    var colorsObject = {taskColor: ''};
    switch (status) {
      case LanguageService.CONSTANTS.INPROGRESS:
        colorsObject.taskColor = ConstantService.INPROGRESS_COLOR;
        break;
      case LanguageService.CONSTANTS.OPEN:
        colorsObject.taskColor = ConstantService.OPEN_COLOR;
        break;
      case LanguageService.CONSTANTS.COMPLETED:
        colorsObject.taskColor = ConstantService.COMPLETED_COLOR;
        break;
      case LanguageService.CONSTANTS.OVERDUE:
        colorsObject.taskColor = ConstantService.OVERDUE_COLOR;
        break;
      case LanguageService.CONSTANTS.FINAL:
        colorsObject.taskColor = ConstantService.INPROGRESS_COLOR;
        break;
    }
    return colorsObject;
  };
  report.getMileStoneColor = function (reportObject, milestone) {
     var milestoneDate=angular.copy(milestone.reportMilestoneDate.setHours(0,0,0,0));
     var reportEndDate=angular.copy(reportObject.reportEndDate.setHours(0,0,0,0));
     var reportSubmissionDate=angular.copy(reportObject.submissionDate.setHours(0,0,0,0));
    if (milestoneDate < reportEndDate || milestoneDate > reportSubmissionDate) {
      return ConstantService.MILESTONE_GREY_COLOR;
    }
    else {
      return ConstantService.MILESTONE_WHITE_COLOR;
    }
  };
  report.createMileStoneTask = function (milestone, milestoneIndex, reportObject, aggregatedDates) {
    var repeatedDatesCount = 0;
    var isDateRepeated = false;
    if (reportObject.isPeriodic) {
      var isAggregatedMilestonesComplete=true;
      for (var i = 0; i < aggregatedDates.length; i++) {
        if (aggregatedDates[i].indexOf(milestone.reportMilestoneDate) > -1) {
          repeatedDatesCount = aggregatedDates[i].length;
          isDateRepeated = repeatedDatesCount > 1 ? true : false;
          for(var k=0;k<reportObject.milestones.length;k++)
          {
            if(aggregatedDates[i].indexOf(reportObject.milestones[k].reportMilestoneDate)>-1)
            {
              if(reportObject.milestones[k].milestoneStatus===0){
                isAggregatedMilestonesComplete=false;
              }
            }
          }
          return {
            from: milestone.reportMilestoneDate,
            to: milestone.reportMilestoneDate,
            color: report.getMileStoneColor(reportObject, milestone),
            id: 'm' + milestoneIndex + milestone.milestoneKey,
            name: milestone.milestoneName,
            isMilestonePresent:true,
            data: {
              report: reportObject,
              milestone: milestone,
              repeatedDatesCount: repeatedDatesCount,
              isDateRepeated: isDateRepeated,
              isPeriodic: true,
              isSubDateSameAsMilDate:reportObject.status===LanguageService.CONSTANTS.OVERDUE?milestone.reportMilestoneDate.getTime()===new Date().setHours(0,0,0,0):milestone.reportMilestoneDate.getTime()===reportObject.submissionDate.getTime(),
              isMilestoneBeforeRptEndDate:milestone.reportMilestoneDate.getTime()<reportObject.reportEndDate.getTime(),
              milestoneAssignedUserKeys:[],
              selectedMilestones: [],
              tempMilestoneStatus: [],
              aggregatedMilestones: aggregatedDates[i],
              isMilestoneComplete:isAggregatedMilestonesComplete
            }
          };
        }
      }
    }
    else {
      return {
        from:reportObject.submissionRunDate,
        to: reportObject.submissionRunDate,
        id: 'm' + milestoneIndex + milestone.milestoneKey,
        name: milestone.milestoneName,
        isMilestonePresent:false,
        data: {
          report: reportObject,
          milestone: milestone,
          isPeriodic: false,
          milestoneAssignedUserKeys:[],
          selectedMilestones: [],
          tempMilestoneStatus: []
        }
      };

    }
  };
  report.createNonPeriodicTasks = function (tempReport, color, tempGanttRowObject, taskObject, oneDayMilliSeconds,ganttChartStartDate,ganttChartEndDate) {
    var createTask=false;
    if(tempReport.submissionRunDate)
    {
    var runDate = angular.copy(tempReport.submissionRunDate), fromRunDateCount = 1, toRunDateCount = 1;
    var tempTaskObject = angular.copy(taskObject);
    if (tempReport.milestones.length > 1) {
      fromRunDateCount = 3;
    } else if (tempReport.milestones.length === 1) {
      fromRunDateCount = 2;
    }

    tempTaskObject.from = new Date(runDate.getTime() - (fromRunDateCount * oneDayMilliSeconds));
      tempTaskObject.to = new Date(runDate.getTime() + (toRunDateCount * oneDayMilliSeconds));
    tempTaskObject.color = color;
    tempTaskObject.id = 't' + tempReport.reportKey + 'id' + tempReport.reportId;
    tempTaskObject.data = tempReport;
    tempTaskObject.data.isPeriodic = false;
    tempTaskObject.data.isMilestoneComplete=true;
    tempTaskObject.isMilestonePresent=false;
    tempTaskObject.data.milestoneDetailsFetched=false;
      if(ganttChartStartDate.getTime()<tempTaskObject.from.getTime() && ganttChartEndDate>tempTaskObject.to.getTime()){
        createTask=true;
      }
      if(createTask) {
        tempGanttRowObject.tasks.push(tempTaskObject);
    tempTaskObject = angular.copy(taskObject);
    tempTaskObject.from = runDate.getTime();
    tempTaskObject.to = runDate.getTime();
    tempTaskObject.color = color;
    tempTaskObject.id = 'm' + tempReport.reportKey + 'idr' + tempReport.reportId;
    tempTaskObject.data = tempReport;
    tempTaskObject.data.isPeriodic = false;
        tempGanttRowObject.tasks.push(tempTaskObject);
        tempReport.milestones.forEach(function (milestone, milestoneIndex) {
          if(milestone.milestoneStatus===0)
          {
            tempGanttRowObject.tasks[0].data.isMilestoneComplete=false;
          }
          tempGanttRowObject.tasks.push(
            report.createMileStoneTask(milestone, milestoneIndex, tempReport, []));
        });
      }

  }};
  report.isReportPeriodic = function (reportObject) {
    return reportObject.reportCategory.reportCategoryTypeKey === 0;
  };
  report.isMilestoneEarlier = function (reportObject) {
 var status = false, startDate, tempReport = angular.copy(reportObject), earlierMileStone,milestoneIndex;
    startDate = angular.copy(tempReport.reportEndDate.setHours(0,0,0,0));
    if (tempReport.milestones.length > 0) {
      for (var i = 0; i < tempReport.milestones.length; i++) {
        var milestoneDate=angular.copy(tempReport.milestones[i].reportMilestoneDate.setHours(0,0,0,0));
        if (startDate > milestoneDate) {
          status = true;
          if(earlierMileStone){
            var tempLaterMilestone=angular.copy(tempReport.milestones[i].reportMilestoneDate.setHours(0,0,0,0));
            if(tempLaterMilestone<earlierMileStone){
                earlierMileStone=tempLaterMilestone;
                milestoneIndex=i;
            }
          }else{
            earlierMileStone = angular.copy(tempReport.milestones[i].reportMilestoneDate.setHours(0,0,0,0));
            milestoneIndex=i;
          }


        }
      }
    }
    if(status){
    reportObject.milestones[milestoneIndex].isPriorExtream=true;
     }
    return status;
  };
  report.isMilestoneLater = function (reportObject) {
    var status = false,endDate, tempReport = angular.copy(reportObject), laterMileStone,milestoneIndex;
    if(reportObject.status===LanguageService.CONSTANTS.OVERDUE)
    {
     endDate=new Date().setHours(0,0,0,0);
    }
    else {
      endDate = angular.copy(tempReport.submissionDate.setHours(0, 0, 0, 0));
    }
    if (tempReport.milestones.length > 0) {
      for (var i = 0; i < tempReport.milestones.length; i++) {
        var milestoneDate=angular.copy(tempReport.milestones[i].reportMilestoneDate);
        if (endDate < milestoneDate) {
          status = true;
          if(laterMileStone){
            var tempLaterMilestone=angular.copy(tempReport.milestones[i].reportMilestoneDate.setHours(0,0,0,0));
            if(tempLaterMilestone>laterMileStone){
                laterMileStone=tempLaterMilestone;
                milestoneIndex=i;
            }
          }else{
            laterMileStone = angular.copy(tempReport.milestones[i].reportMilestoneDate.setHours(0,0,0,0));
            milestoneIndex=i;
          }
        }
      }
    }
    if(status){
    reportObject.milestones[milestoneIndex].isLaterExtream=true;
     }
    return status;
  };
  report.clearNullObjects = function (data) {
    data = data.filter(function (object) {
      return object !== null;
    });
  };
  report.findMilestoneDatesWeekDuration = function (reportObject) {
    var milestonesDate = [];
    var milestoneOutOfDates = [];
    var finalDates = [];
    var finalOutOfBoundDates = [];
    var currentDate=new Date().setHours(0,0,0,0);
    angular.forEach(reportObject.milestones, function (value) {
      if (value.reportMilestoneDate >= reportObject.reportEndDate && value.reportMilestoneDate <= ((reportObject.status===LanguageService.CONSTANTS.OVERDUE)?currentDate:reportObject.submissionDate)) {
        milestonesDate.push(value.reportMilestoneDate);//This is for dates inside the gantt bar
      }
      else {
        milestoneOutOfDates.push(value.reportMilestoneDate);//This is for the dates falling outside the gantt bar
      }
    });
    var sortAsc = function (date1, date2) {
      if (date1 > date2) {return 1;}
      if (date1 < date2) {return -1;}
      return 0;
    };
    if (milestoneOutOfDates.length > 0) {
      milestoneOutOfDates.sort(sortAsc);//Sorting the dates falling outside the gantt bar
      for (var i = 0; i < milestoneOutOfDates.length; i++) {
        var datesRepeatedOutOfBounds = [];
        var elementOutOfBounds = milestoneOutOfDates[i];
        datesRepeatedOutOfBounds.push(elementOutOfBounds);
        for (var j = i + 1; j < milestoneOutOfDates.length; j++) {
          if(((elementOutOfBounds.getTime()-reportObject.reportEndDate.getTime()<0) &&(milestoneOutOfDates[j].getTime()-reportObject.reportEndDate.getTime()<0))||((elementOutOfBounds.getTime()-reportObject.reportEndDate.getTime()>0) &&(milestoneOutOfDates[j].getTime()-reportObject.reportEndDate.getTime()>0)))
          {
            var diff = (elementOutOfBounds.getTime() - milestoneOutOfDates[j].getTime()) / ((1000 * 3600 * 24));
          if (diff < 7 && diff > -7) {
            datesRepeatedOutOfBounds.push(milestoneOutOfDates[j]);
            milestoneOutOfDates.splice(j, 1);
            j--;
          }}
        }
        milestoneOutOfDates.splice(i, 1);
        i--;
        finalOutOfBoundDates.push(datesRepeatedOutOfBounds);//week aggregation for outside gantt bar
      }
    }
    if (milestonesDate.length > 0) {
      milestonesDate.sort(sortAsc);//Sorting the dates falling inside the gantt bar
      for (var k = 0; k < milestonesDate.length; k++) {
        var datesRepeated = [];
        var element = milestonesDate[k];
        datesRepeated.push(element);
        for (var m = k + 1; m < milestonesDate.length; m++) {
          var diff1 = (element.getTime() - milestonesDate[m].getTime()) / ((1000 * 3600 * 24));
          if (diff1 < 7 && diff1 > -7) {
            datesRepeated.push(milestonesDate[m]);
            milestonesDate.splice(m, 1);
            m--;
          }
        }
        milestonesDate.splice(k, 1);
        k--;
        finalDates.push(datesRepeated);//week aggregation for inside gantt bar
      }
    }
    return {normalDates: finalDates, outOfBoundDates: finalOutOfBoundDates};
  };
  report.getMilestoneAssignedUsers=function(rptKey){
    var deferred = $q.defer();
    var url=UrlService.getService('GET_MILESTONE_ASSIGNEES_GANTT')+'?&$expand=MilestoneAssignees&$filter=FK_RPT_KEY eq ';
    url+=rptKey;
    $http.get(url)
      .success(function (response) {
        try {
          var data = response.d.results;
          var milestoneArray=[];
          angular.forEach(data,function(milestone){
            var tempMilestone = angular.copy(ReportMileStoneEntity);
            tempMilestone.milestoneKey = milestone.MILESTONE_KEY;
            tempMilestone.assignedUserGroups = [];
            tempMilestone.assignedUsers = [];
            tempMilestone.preAssignedUsersGroups=milestone.MilestoneAssignees.results;
            angular.forEach(tempMilestone.preAssignedUsersGroups, function (userGroup) {
              if (userGroup.OBJ_TYPE === ConstantService.GROUP_ENTITY) {
                tempMilestone.assignedUserGroups.push({'roleId': parseInt(userGroup.GROUP_ID)});
              } else if (userGroup.OBJ_TYPE === ConstantService.USER_ENTITY) {
                tempMilestone.assignedUsers.push({'userKey': parseInt(userGroup.USER_ID)});
              }
            });
            milestoneArray.push(tempMilestone);
          });
          deferred.resolve({'data': milestoneArray, 'message': ''});
        } catch (e) {
          alertService.warn(LanguageService.MESSAGES.FAILED_TO_GET_MILESTONE_ASSIGNEES);
          deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_TO_GET_MILESTONE_ASSIGNEES});
        }
      })
      .error(function () {
        alertService.error(LanguageService.MESSAGES.FAILED_TO_GET_MILESTONE_ASSIGNEES);
        deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_TO_GET_MILESTONE_ASSIGNEES});
      });
    return deferred.promise;

  };
  report.createPeriodicTasks = function (tempReport, taskObject, tempGanttRowObject, startDate, endDate) {
    var colorObject = report.getStatusColorObject(tempReport.status);
    var tempTaskObject = angular.copy(taskObject);
    tempTaskObject.data = tempReport;
    tempTaskObject.data.isPeriodic = true;
    tempTaskObject.data.milestoneDetailsFetched=false;
    var ganttTaskObjectStartTime = startDate.getTime();
    var ganttTaskObjectEndTime = endDate.getTime();
    var startTime = tempReport.reportEndDate.getTime();
    var endTime = tempReport.submissionDate.getTime();
    var aggregatedDates = report.findMilestoneDatesWeekDuration(tempReport);
    var tempNormalDates = [];
    var tempOutOfBoundDates = [];
    var isMilestoneLater = report.isMilestoneLater(tempReport);
    var isMilestonePrior = report.isMilestoneEarlier(tempReport);
    var evaluatedMainTaskDates=report.evaluateBarDates(ganttTaskObjectStartTime,ganttTaskObjectEndTime,startTime,endTime);
    if (evaluatedMainTaskDates.evaluatedEndDate && evaluatedMainTaskDates.evaluatedStartDate) {
      if (tempReport.status === LanguageService.CONSTANTS.OVERDUE) {
        tempTaskObject.to = new Date().setHours(0,0,0,0);
      }else{
        tempTaskObject.to=evaluatedMainTaskDates.evaluatedEndDate;
      }
      tempTaskObject.from=evaluatedMainTaskDates.evaluatedStartDate;
      tempTaskObject.color = colorObject.taskColor;
      tempTaskObject.id = 't' + tempReport.reportKey + 'id' + tempReport.reportId;
      tempTaskObject.data = tempReport;
      tempTaskObject.isMilestonePresent=false;
      tempGanttRowObject.tasks.push(tempTaskObject);
      if (isMilestoneLater) {
          tempReport.milestones.forEach(function(milestone) {
                          if (milestone.isLaterExtream) {
                            var evaluatedDates=report.evaluateBarDates(ganttTaskObjectStartTime,ganttTaskObjectEndTime,endTime,milestone.reportMilestoneDate.getTime());
                            if(evaluatedDates.evaluatedStartDate && evaluatedDates.evaluatedEndDate){
                              tempGanttRowObject.tasks.push(report.createExtendedBarRight(tempReport, evaluatedDates));

                            }
                            }
          });
      }
      if (isMilestonePrior) {
          tempReport.milestones.forEach(function(milestone) {
                         if (milestone.isPriorExtream) {
                           var evaluatedDates=report.evaluateBarDates(ganttTaskObjectStartTime,ganttTaskObjectEndTime,milestone.reportMilestoneDate.getTime(),startTime);
                           if(evaluatedDates.evaluatedStartDate && evaluatedDates.evaluatedEndDate){
                             tempGanttRowObject.tasks.push(report.createExtendedBarLeft(tempReport, evaluatedDates));

                           }
                            }});
      }
      tempReport.milestones.forEach(function (milestone, milestoneIndex) {
        if (milestone.reportMilestoneDate >= tempReport.reportEndDate && milestone.reportMilestoneDate <= tempReport.submissionDate &&milestone.reportMilestoneDate>=ganttTaskObjectStartTime && milestone.reportMilestoneDate<=ganttTaskObjectEndTime) {
          for (var i = 0; i < aggregatedDates.normalDates.length; i++) {
            if (aggregatedDates.normalDates[i].indexOf(milestone.reportMilestoneDate) > -1 && tempNormalDates.indexOf(i) < 0) {
              tempNormalDates.push(i);// creating tasks for only milestones which fall into one week group
              tempGanttRowObject.tasks.push(report.createMileStoneTask(milestone, milestoneIndex, tempReport, aggregatedDates.normalDates));
            }
          }
        }
        else {
          for (var j = 0; j < aggregatedDates.outOfBoundDates.length; j++) {
            if (aggregatedDates.outOfBoundDates[j].indexOf(milestone.reportMilestoneDate) > -1 && tempOutOfBoundDates.indexOf(j) < 0 && milestone.reportMilestoneDate>=ganttTaskObjectStartTime && milestone.reportMilestoneDate<=ganttTaskObjectEndTime) {
              tempOutOfBoundDates.push(j);// creating tasks for only milestones which fall into one week group
              tempGanttRowObject.tasks.push(report.createMileStoneTask(milestone, milestoneIndex, tempReport, aggregatedDates.outOfBoundDates));
            }
          }
        }
      });
    }else{
      if (tempReport.status === LanguageService.CONSTANTS.OVERDUE) {
        var evaluatedDates=report.evaluateBarDates(ganttTaskObjectStartTime,ganttTaskObjectEndTime,endTime,new Date().setHours(0,0,0,0));
        if(evaluatedDates.evaluatedStartDate && evaluatedDates.evaluatedEndDate){
          tempTaskObject.from=evaluatedDates.evaluatedStartDate;
          tempTaskObject.to = new Date().setHours(0,0,0,0);
        tempTaskObject.color = colorObject.taskColor;
        tempTaskObject.id = 't' + tempReport.reportKey + 'id' + tempReport.reportId;
        tempTaskObject.data = tempReport;
          tempTaskObject.isMilestonePresent=false;
        tempGanttRowObject.tasks.push(tempTaskObject);
      }}
     }
      if (isMilestoneLater) {
        tempReport.milestones.forEach(function(milestone) {
          if (milestone.isLaterExtream) {
            var evaluatedDates=report.evaluateBarDates(ganttTaskObjectStartTime,ganttTaskObjectEndTime,endTime,milestone.reportMilestoneDate.getTime());
            if(evaluatedDates.evaluatedStartDate && evaluatedDates.evaluatedEndDate){
              tempGanttRowObject.tasks.push(report.createExtendedBarRight(tempReport, evaluatedDates));

            }
          }
        });
      }
      if (isMilestonePrior) {
        tempReport.milestones.forEach(function(milestone) {
          if (milestone.isPriorExtream) {
            var evaluatedDates=report.evaluateBarDates(ganttTaskObjectStartTime,ganttTaskObjectEndTime,milestone.reportMilestoneDate.getTime(),startTime);
            if(evaluatedDates.evaluatedStartDate && evaluatedDates.evaluatedEndDate){
              tempGanttRowObject.tasks.push(report.createExtendedBarLeft(tempReport, evaluatedDates));

            }
          }});
      }
      tempReport.milestones.forEach(function (milestone, milestoneIndex) {
        var milestoneDate=milestone.reportMilestoneDate.getTime();
        var evaluatedDates=report.evaluateBarDates(ganttTaskObjectStartTime,ganttTaskObjectEndTime,milestoneDate,milestoneDate);
        if (milestone.reportMilestoneDate >= tempReport.reportEndDate && milestone.reportMilestoneDate <= tempReport.submissionDate &&milestone.reportMilestoneDate>=ganttTaskObjectStartTime && milestone.reportMilestoneDate<=ganttTaskObjectEndTime) {
          for (var i = 0; i < aggregatedDates.normalDates.length; i++) {
            if (aggregatedDates.normalDates[i].indexOf(milestone.reportMilestoneDate) > -1 && tempNormalDates.indexOf(i) < 0) {
              tempNormalDates.push(i);// creating tasks for only milestones which fall into one week group
              if(evaluatedDates.evaluatedStartDate && evaluatedDates.evaluatedEndDate){
                tempGanttRowObject.tasks.push(report.createMileStoneTask(milestone, milestoneIndex, tempReport, aggregatedDates.normalDates));
              }
            }
          }
        }
        else {
          for (var j = 0; j < aggregatedDates.outOfBoundDates.length; j++) {
            if (aggregatedDates.outOfBoundDates[j].indexOf(milestone.reportMilestoneDate) > -1 && tempOutOfBoundDates.indexOf(j) < 0 && milestone.reportMilestoneDate>=ganttTaskObjectStartTime && milestone.reportMilestoneDate<=ganttTaskObjectEndTime) {
              tempOutOfBoundDates.push(j);// creating tasks for only milestones which fall into one week group
              if(evaluatedDates.evaluatedStartDate && evaluatedDates.evaluatedEndDate){
                tempGanttRowObject.tasks.push(report.createMileStoneTask(milestone, milestoneIndex, tempReport, aggregatedDates.outOfBoundDates));
              }
            }
          }
        }
      });
    };

  report.createExtendedBarRight = function(tempReport,evaluatedDate) {
    var temp;
    if (tempReport.status === LanguageService.CONSTANTS.OVERDUE) {
      temp=new Date(new Date().setHours(0,0,0,0));
    }
    else
    {
      temp=evaluatedDate.evaluatedStartDate;
    }
    return {
        from:temp,
        to: evaluatedDate.evaluatedEndDate,
        isMilestonePresent:false,
        id: 't' + tempReport.reportKey + 'idER' + tempReport.reportId,
        data: {
            isExtended: true,
            isExtendedRight: true,
            isPeriodic: false,
            clicked: false
        }
    };

};
report.createExtendedBarLeft = function(tempReport,evaluatedDate) {
    return {
        from: evaluatedDate.evaluatedStartDate,
        to: evaluatedDate.evaluatedEndDate,
        id: 't' + tempReport.reportKey + 'idEL' + tempReport.reportId,
        isMilestonePresent:false,
        data: {
            isExtended: true,
            isExtendedLeft: true,
            isPeriodic: false,
            clicked: false
        }
    };

};
  report.evaluateBarDates=function(ganttTaskObjectStartTime,ganttTaskObjectEndTime,barStartDate,barEndDate){
    var evaluatedDate={};
    evaluatedDate.evaluatedStartDate= ((barStartDate>=ganttTaskObjectStartTime && barStartDate<=ganttTaskObjectEndTime))?barStartDate:((barStartDate<ganttTaskObjectStartTime )?ganttTaskObjectStartTime:((barStartDate>ganttTaskObjectEndTime)?false:true));
    evaluatedDate.evaluatedEndDate= ((barEndDate>=ganttTaskObjectStartTime && barEndDate<=ganttTaskObjectEndTime))?barEndDate:((barEndDate>ganttTaskObjectEndTime)?ganttTaskObjectEndTime:((barEndDate<ganttTaskObjectStartTime)?false:true));

    if(evaluatedDate.evaluatedStartDate){
      evaluatedDate.evaluatedStartDate=new Date(evaluatedDate.evaluatedStartDate);
    }
    if(evaluatedDate.evaluatedEndDate){
      evaluatedDate.evaluatedEndDate=new Date(evaluatedDate.evaluatedEndDate);
    }
    return evaluatedDate;
  };
  return report;

}]);
