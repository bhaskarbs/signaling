'use strict';

angular.module('saintApp').factory('CaseFactory', ['$http', '$q', 'UrlService', 'alertService', 'LanguageService', 'CaseEntity', 'loaderService', 'ConstantService', 'DateService', 'CaseListFactory', 'TagEntity', function ($http, $q, UrlService, AlertService, LanguageService, CaseEntity, loaderService, ConstantService, DateService, CaseListFactory, TagEntity) {
  var caseObject = function (data) {
    angular.extend(this, data);
  };
  caseObject.data = {
    selectedCaseList: [],
    cases: [],
    casesOperationType: null,
    tagSelected: []
  };
  caseObject.buildUrl = function (casesObj) {
    var url = UrlService.getService('CASE_LIST_TABLE_VIEW') + casesObj.baseCaseKey +
      ',IN_FLAG=1)/Results?$format=json&$top=' + casesObj.top +
      '&$skip=' + casesObj.skip + '&$orderby=WORKFLOW_STATUS_DESC,CASE_NBR';
    if (casesObj.searchText) {
      url = url + '&$filter=startswith(CASE_NBR,\'' + casesObj.searchText + '\')';
    }
    return url;
  };
  //To fetch the case list table view data with unique case numbers
  caseObject.getDistinctCases = function (casesObj) {
    var deferred = $q.defer();
    var url = caseObject.buildUrl(casesObj);
    $http.get(url).success(function (response) {
      try {
        caseObject.data.cases = [];
        var caseListResponse = response.d.results;
        _.map(caseListResponse, function (object) {
          if ((object.WORKFLOW_STATUS_DESC).toUpperCase() === ConstantService.NOT_IN_WORKFLOW) {
            object.WORKFLOW_STATUS_DESC = false;
          } else if ((object.WORKFLOW_STATUS_DESC).toUpperCase() === ConstantService.IN_WORKFLOW) {
            object.WORKFLOW_STATUS_DESC = true;
          }
          var actualObject = angular.copy(CaseEntity);
          actualObject = {
            'caseId': object.CASE_NBR,
            'caseKey': object.CASE_KEY,
            'initialReceiptDate': object.INITIAL_RECEIVED_DATE,
            'followupReceiptDate': object.FOLLOWUP_RECEIVED_DATE,
            'eventReceiptDate': object.EVENT_RECEIPT_DATE,
            'reportType': object.D_CASE_SOURCE_TYPE,
            'country': object.COUNTRY_OF_INCIDENCE,
            'product': object[ConstantService.PRODUCT_COLUMN_NAME],
            'version': object.VERSION_NBR,
            'workflow': object.WORKFLOW_STATUS_DESC
          };
          caseObject.data.cases.push(actualObject);
        });
        deferred.resolve({'data': caseObject.data.cases, 'message': ''});
      } catch (e) {
        AlertService.warn(LanguageService.MESSAGES.FAILED_TO_GET_CASE_LISTS);
        deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_TO_GET_CASE_LISTS});
      }
    }).error(function () {
      AlertService.warn(LanguageService.MESSAGES.FAILED_TO_GET_CASE_LISTS);
      deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_TO_GET_CASE_LISTS});
    });
    return deferred.promise;
  };
  //This function is to fetch all case events for a case number clicked on detailed view
  caseObject.getCaseEvents = function (casesObj) {
    var deferred = $q.defer();
    var url = UrlService.getService('GET_ALL_CASES_LIST') + casesObj.baseCaseKey +
      ',IN_FLAG=1)/Results?$format=json&$filter=CASE_KEY eq ' + casesObj.caseKey + '&$expand=CaseEventSummary';
    var caseEventsList = [];
    $http.get(url).success(function (response) {
      try {
        var caseEvents = response.d.results;
        var actualObject = angular.copy(CaseEntity);
        _.each(caseEvents, function (event) {
          angular.forEach(event.CaseEventSummary.results, function (value) {
            caseEventsList.push({
              eventVerbatim: value.EVENT_DESC_AS_REPORTED,
              ptDesc: '[' + (value.PT_DESC).toUpperCase() + ']',
              eventOnSetDate: (value.EVENT_ONSET_DATE) ?
                DateService.getDateStringInDateFormatOne(value.EVENT_ONSET_DATE) : null,
              eventOutcome: value.EVENT_OUTCOME_DESC,
              seriousness: value.SERIOUSNESS,
              listedness: value.LISTEDNESS,
              timeToOnset: (value.TIME_TO_ONSET) ? DateService.getDateStringInDateFormatOne(value.TIME_TO_ONSET): null,
              companyCausality: value.DETERMINED_CAUSALITY_DESC,
              reporterCausality: value.REPORTED_CAUSALITY_DESC
            });
          });
        });
        actualObject.events = caseEventsList;
        deferred.resolve({'data': actualObject, 'message': ''});
      } catch (e) {
        AlertService.warn(LanguageService.MESSAGES.FAILED_TO_GET_CASE_LISTS);
        deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_TO_GET_CASE_LIST_EVENTS});
      }
    }).error(function () {
      AlertService.warn(LanguageService.MESSAGES.FAILED_TO_GET_CASE_LISTS);
      deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_TO_GET_CASE_LIST_EVENTS});
    });
    return deferred.promise;
  };

  //This function is to fetch all suspect products for a case number clicked on detailed view
  caseObject.getCaseSuspectProducts = function (casesObj) {
    var deferred = $q.defer();
    var url = UrlService.getService('GET_ALL_CASES_LIST') + casesObj.baseCaseKey +
      ',IN_FLAG=1)/Results?$format=json&$filter=CASE_KEY eq ' + casesObj.caseKey + '&$expand=CaseSuspectProductSummary';
    var suspectProductsList = [];
    $http.get(url).success(function (response) {
      try {
        var suspectProducts = response.d.results;
        var actualObject = angular.copy(CaseEntity);
        _.each(suspectProducts, function (product) {
          angular.forEach(product.CaseSuspectProductSummary.results, function (product) {
            suspectProductsList.push({
              productName: product.CPE_PRODUCT_TRADE_NAME,
              formulation: ' / ' + product.FORMULATION_DESC,
              ingredient: product.FAMILY_DESC,
              route: product.ADMIN_ROUTE_DESC,
              dailyDose: product.DAILY_DOSE,
              datesOfTreatment: product.DATES_OF_TREATMENT,
              indication: product.REPORTED_INDICATION
            });
          });
        });
        actualObject.suspectProducts = suspectProductsList;
        deferred.resolve({'data': angular.copy(actualObject), 'message': ''});
      } catch (e) {
        AlertService.warn(LanguageService.MESSAGES.FAILED_TO_GET_CASE_LISTS);
        deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_TO_GET_CASE_LIST_SUSPECT_PRODUCTS});
      }
    }).error(function () {
      AlertService.warn(LanguageService.MESSAGES.FAILED_TO_GET_CASE_LISTS);
      deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_TO_GET_CASE_LIST_SUSPECT_PRODUCTS});
    });
    return deferred.promise;
  };

  //This function is to fetch all icsrSubmission history  for a case number clicked on detailed view
  caseObject.getICSRSubmissions = function (casesObj) {
    var deferred = $q.defer();
    var url = UrlService.getService('GET_ALL_CASES_LIST') + casesObj.baseCaseKey +
      ',IN_FLAG=1)/Results?$format=json&$filter=CASE_KEY eq ' + casesObj.caseKey + '&$expand=CaseIcsrSubmissions';
    var icsrSubmissionsList = [];
    $http.get(url).success(function (response) {
      try {
        var icsrSubmissions = response.d.results;
        var actualObject = angular.copy(CaseEntity);
        _.each(icsrSubmissions, function (subIcsrSubmissions) {
          angular.forEach(subIcsrSubmissions.CaseIcsrSubmissions.results, function (icsrSubmission) {
            icsrSubmissionsList.push({
              destination: icsrSubmission.REPORT_AGENCY_DESC,
              reportForm: icsrSubmission.REPORT_FORM_DESC,
              timeframe: icsrSubmission.REPORT_TIMEFRAME,
              initialFU: icsrSubmission.D_INTIAL_FOLLOWUP_TEXT,
              submissionDate: icsrSubmission.SUBMISSION_DATE
            });
          });
        });
        actualObject.icsrSubmissions = icsrSubmissionsList;
        deferred.resolve({'data': angular.copy(actualObject), 'message': ''});
      } catch (e) {
        AlertService.warn(LanguageService.MESSAGES.FAILED_TO_GET_CASE_LISTS);
        deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_TO_GET_CASE_LIST_SUSPECT_PRODUCTS});
      }
    }).error(function () {
      AlertService.warn(LanguageService.MESSAGES.FAILED_TO_GET_CASE_LISTS);
      deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_TO_GET_CASE_LIST_SUSPECT_PRODUCTS});
    });
    return deferred.promise;
  };

  //This function is to fetch all periodic submission history  for a case number clicked on detailed view
  caseObject.getCaseSubmissionHistoryPeriodic = function (casesObj) {
    var deferred = $q.defer();
     var url = UrlService.getService('GET_ALL_CASES_LIST') + casesObj.baseCaseKey +
     ',IN_FLAG=1)/Results?$format=json&$filter=CASE_KEY eq ' + casesObj.caseKey + '&$expand=CasePeriodics';
    var periodicSubmissionHistoryList = [];
    $http.get(url).success(function (response) {
      try {
        var submissionHistoryPeriodic = response.d.results;
        var actualObject = angular.copy(CaseEntity);
        _.each(submissionHistoryPeriodic, function (subHistoryPeriodic) {
          angular.forEach(subHistoryPeriodic.CasePeriodics.results, function (periodic) {
            periodicSubmissionHistoryList.push({
              reportName: periodic.RPT_NAME,
              submissionDate: periodic.SUBMISSION_DATE
            });
          });
        });
        actualObject.submissionHistoryPeriodic = periodicSubmissionHistoryList;
        deferred.resolve({'data': angular.copy(actualObject), 'message': ''});
      } catch (e) {
        AlertService.warn(LanguageService.MESSAGES.FAILED_TO_GET_CASE_LISTS);
        deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_TO_GET_CASE_LIST_SUSPECT_PRODUCTS});
      }
    }).error(function () {
      AlertService.warn(LanguageService.MESSAGES.FAILED_TO_GET_CASE_LISTS);
      deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_TO_GET_CASE_LIST_SUSPECT_PRODUCTS});
    });
    return deferred.promise;
  };

  //This function is to fetch case narrative for a case number clicked on detailed view
  caseObject.getCaseNarrative = function (casesObj) {
    var deferred = $q.defer();
    var url = UrlService.getService('GET_ALL_CASES_LIST') + casesObj.baseCaseKey +
      ',IN_FLAG=1)/Results?$format=json&$filter=CASE_KEY eq ' + casesObj.caseKey + '&$expand=CaseNarratives';
    $http.get(url).success(function (response) {
      try {
        var caseNarrativeDesc = response.d.results;
        var actualObject = angular.copy(CaseEntity);
        _.map(caseNarrativeDesc, function (narrativeText) {
          actualObject.CaseNarratives = narrativeText.CaseNarratives.NARRATIVE_TEXT;
        });
        deferred.resolve({'data': angular.copy(actualObject), 'message': ''});
      } catch (e) {
        AlertService.warn(LanguageService.MESSAGES.FAILED_TO_GET_CASE_LISTS);
        deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_TO_GET_CASE_LIST_SUSPECT_PRODUCTS});
      }
    }).error(function () {
      AlertService.warn(LanguageService.MESSAGES.FAILED_TO_GET_CASE_LISTS);
      deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_TO_GET_CASE_LIST_SUSPECT_PRODUCTS});
    });
    return deferred.promise;
  };
//This function is to fetch case details summary for the selected case number
  caseObject.getSelectedCaseDetails = function (casesObj) {
    var deferred = $q.defer();
    var url = UrlService.getService('GET_ALL_CASES_LIST') + casesObj.baseCaseKey +
      ',IN_FLAG=1)/Results?$format=json&$filter=CASE_KEY eq ' + casesObj.caseKey;
    $http.get(url).success(function (response) {
      try {
        var caseListResponse = response.d.results;
        var actualObject = angular.copy(CaseEntity);
        _.map(caseListResponse, function (object) {
          actualObject.caseId = object.CASE_NBR;
          actualObject.mfrControlNumber = object.CASE_NBR;
          actualObject.reportType = object.D_CASE_SOURCE_TYPE;
          actualObject.initialReceiptDate = DateService.getDateStringInDateFormatOne(object.INITIAL_RECEIVED_DATE);
          actualObject.eventReceiptDate = DateService.getDateStringInDateFormatOne(object.EVENT_RECEIPT_DATE);
          actualObject.followupReceiptDate = DateService.getDateStringInDateFormatOne(object.FOLLOWUP_RECEIVED_DATE);
          actualObject.countryOfOccurrence = object.COUNTRY_OF_INCIDENCE;
          actualObject.studyId = object.STUDY_NUMBER;
          actualObject.patientId = object.PATIENT_ID_CALC;
          actualObject.patientInitials = object.PATIENT_INITIAL;
          actualObject.patientSex = object.PATIENT_GENDER_DESC;
          actualObject.patientDOB = object.PATIENT_DATE_OF_BIRTH;
          actualObject.patientAge = object.PATIENT_AGE_DESC;
          actualObject.caseSerious = object.D_CASE_SERIOUSNESS_DESC;
          actualObject.caseListedness = object.D_CASE_LABELED_DESC;
          actualObject.caseCasuality = object.D_CASE_CAUSALITY_DESC;
          actualObject.caseOutcome = object.CASE_ASSESS_OUTCOME_DESC;
          actualObject.annotation = object.ANNOTATION;
        });
        deferred.resolve({'data': actualObject, 'message': ''});
      } catch (e) {
        AlertService.warn(LanguageService.MESSAGES.FAILED_TO_GET_CASE_LISTS);
        deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_TO_GET_CASE_LIST_DETAILS});
      }
    }).error(function () {
      AlertService.warn(LanguageService.MESSAGES.FAILED_TO_GET_CASE_LISTS);
      deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_TO_GET_CASE_LIST_DETAILS});
    });
    return deferred.promise;
  };
  //This function is to check the flags for receipt dates
  caseObject.getCaseListDatesCheck = function (baseCaseKey) {
    var deferred = $q.defer();
    var url = UrlService.getService('DATE_FLAG_PARAMS') + baseCaseKey + ')' + '/Results';
    $http.get(url).success(function (response) {
      try {
        var caseListResponse = response.d.results;
        var actualObject = angular.copy(CaseEntity);
        _.map(caseListResponse, function (object) {
          actualObject.eventReceiptDate = object.EVENT_RCPT_DT_FLAG;
          actualObject.initialReceiptDate = object.INITIAL_RCPT_DT_FLAG;
          actualObject.followupReceiptDate = object.FOLLOWUP_RCPT_DT_FLAG;
        });
        deferred.resolve({'data': actualObject, 'message': ''});
      } catch (e) {
        deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_TO_GET_RECEIPT_DATES});
      }
    }).error(function () {
      deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_TO_GET_RECEIPT_DATES});
    });
    return deferred.promise;
  };
  //This function is defined to upload the include/exclude cases
  caseObject.uploadCases = function (cases) {
    var deferred = $q.defer();
    var payload = cases;
    var headers = {'content-type': 'application/json'};
    $http({'method': 'POST', 'url': UrlService.getService('CASES_UPLOAD'), 'data': payload, 'header': headers})
      .success(function (response) {
        try {
          var uploadedCasesDetails = [];
          var activeCasesCount = 0;
          var inActiveCasesCount = 0;
          _.each(response.result, function (val) {
            var tempObject = angular.copy(CaseEntity);
            tempObject.caseId = val.CASE_NUMBER;
            tempObject.status = val.STATUS;
            if (val.STATUS === ConstantService.ONE) {
              activeCasesCount += 1;
            } else {
              inActiveCasesCount += 1;
            }
            tempObject.statusMessage = val.STATUS_MESSAGE;
            uploadedCasesDetails.push(tempObject);
          });
          var result = {
            'data': uploadedCasesDetails,
            'activeCount': activeCasesCount,
            'inActiveCasesCount': inActiveCasesCount
          };
          deferred.resolve({'data': result, 'message': ''});
        } catch (e) {
          AlertService.warn(LanguageService.MESSAGES.FAILED_TO_GET_UPLOADED_CASES_DETAILS);
          deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_TO_GET_UPLOADED_CASES_DETAILS});
        }
      }).error(function () {
      AlertService.warn(LanguageService.MESSAGES.FAILED_TO_GET_UPLOADED_CASES_DETAILS);
      deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_TO_GET_UPLOADED_CASES_DETAILS});
    });
    return deferred.promise;
  };
  //This function gives the case ids based on search text with at least 6 characters
  caseObject.getCaseIds = function (caseNumber) {
    var deferred = $q.defer();
    var url = UrlService.getService('INCLUDE_SELECT_CASE') + '?$filter=startswith(CASE_NBR,' + '\'' + caseNumber + '\'' + ')&$format=json';
    $http.get(url)
      .success(function (response) {
        try {
          var caseIds = angular.copy(response.d.results);
          deferred.resolve({'data': caseIds, 'message': ''});
        } catch (e) {
          AlertService.warn(LanguageService.MESSAGES.INVALID_CASE);
          deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.INVALID_CASE});
        }
      })
      .error(function () {
        AlertService.warn(LanguageService.MESSAGES.INVALID_CASE);
        deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.INVALID_CASE});
      });
    return deferred.promise;
  };
//This function gives the top 20 case ids
  caseObject.getTopCaseIds = function () {
    var deferred = $q.defer();
    var url = UrlService.getService('INCLUDE_SELECT_CASE') + '?$top=20&$format=json';
    $http.get(url)
      .success(function (response) {
        try {
          var topCaseIds = angular.copy(response.d.results);
          deferred.resolve({'data': topCaseIds, 'message': ''});
        } catch (e) {
          AlertService.warn(LanguageService.MESSAGES.INVALID_CASE);
          deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.INVALID_CASE});
        }
      })
      .error(function () {
        AlertService.warn(LanguageService.MESSAGES.INVALID_CASE);
        deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.INVALID_CASE});
      });
    return deferred.promise;
  };
  //This function is defined to save the annotation in case list details screen
  caseObject.fnAnnotationSave = function (casesObj,annotationText,caseNumber) {
    var tags = [];
    if(caseObject.data.tagSelected.length > 0){
      caseObject.data.tagSelected.forEach(function (data) {
            tags.push({ 'FK_TAG_KEY' : data.tagKey, 'FK_TAG_TYPE_KEY' : data.tagType});
          });
    }else {
        tags.push({ 'FK_TAG_KEY' : null, 'FK_TAG_TYPE_KEY' : null});
    }
    var annotationObj = [{
        'FK_BCL_KEY': casesObj.baseCaseKey,
        'FK_CASE_KEY': casesObj.caseKey,
        'FK_CASE_NBR': caseNumber,
        'ANNOTATION': annotationText,
        'TAGS': tags
      }];

      annotationObj ={
        'data':annotationObj
      };
    var deferred = $q.defer();
    var url = UrlService.getService('SAVE_ANNOTATIONS');
    $http({
      'method': 'POST',
      'url': url,
      'data': annotationObj
    })
      .success(function (response) {
        if (response) {
          deferred.resolve({'data': response, 'message': LanguageService.MESSAGES.UPDATED_ANNOTATION});
        } else {
          AlertService.warn(LanguageService.MESSAGES.UPDATED_ANNOTATION);
          deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_SAVE_ANNOTATION});
        }
      })
      .error(function () {
        AlertService.error(LanguageService.MESSAGES.FAILED_SAVE_ANNOTATION);
        deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_SAVE_ANNOTATION});
      });
    return deferred.promise;
  };
//This function is to save the include and exclude data
  caseObject.includeExcludeCases = function (caseListInfo) {
    var deferred = $q.defer();
    var payload = caseListInfo;
    var headers = {'content-type': 'application/json'};
    $http({'method': 'POST', 'url': UrlService.getService('INCLUDE_EXCLUDE_CASES'), 'data': payload, 'header': headers})
      .success(function (response) {
        if (response) {
          var ie = response.ie;
          deferred.resolve({'data': response, 'message': ''});
          CaseListFactory.data.excludeInclude = true;
          if (ie === 0) {
            AlertService.success(LanguageService.MESSAGES.SAVED_EXCLUDE_CASES);
          } else if (ie === 1) {
            AlertService.success(LanguageService.MESSAGES.SAVED_INCLUDE_CASES);
          }
        } else {
          AlertService.warn(LanguageService.MESSAGES.FAILED_TO_SAVE_INCLUDE_CASES);
          deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_TO_SAVE_INCLUDE_CASES});
        }
      }).error(function () {
      AlertService.warn(LanguageService.MESSAGES.FAILED_TO_SAVE_INCLUDE_CASES);
      deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_TO_SAVE_INCLUDE_CASES});
    });
    return deferred.promise;
  };

  caseObject.formatTrackCaseToEntity = function (caseTrackList) {
    var formattedTrackList = [];
    for (var i = 0; i < caseTrackList.length; i++) {
      var tempObject = angular.copy(CaseEntity);
      tempObject.caseId = caseTrackList[i].CASE_NBR;
      tempObject.caseKey = caseTrackList[i].CASE_KEY;
      tempObject.dateModified = caseTrackList[i].CREATED_DATE;
      tempObject.person = caseTrackList[i].CREATED_BY;
      tempObject.reason = caseTrackList[i].COMMENTS;
      tempObject.annotated = caseTrackList[i].ANNOTATION;
      formattedTrackList.push(tempObject);
    }
    return formattedTrackList;
  };

  caseObject.getTrackingCaseList = function (url, trackType) { // ADDED, REMOVED, ANNOTATED
    var deferred = $q.defer();
    var errorMessage = LanguageService.MESSAGES['FAILED_TO_GET_' + trackType + '_CASE_LIST'];
    $http.get(url).success(function (response) {
      try {
        var trackCaseList = caseObject.formatTrackCaseToEntity(response.d.results);
        deferred.resolve({'data': trackCaseList, 'count': response.d.__count, 'message': ''});
      } catch (e) {
        AlertService.warn(errorMessage);
        deferred.resolve({'error': 'ok', 'message': errorMessage});
      }
    }).error(function () {
      AlertService.warn(errorMessage);
      deferred.resolve({'error': 'ok', 'message': errorMessage});
    });
    return deferred.promise;
  };

  caseObject.getGenerateOdataQueryParameters = function (startIndex, endIndex) {
    var qRecordCount = '$inlinecount=allpages';
    var qTop = '';
    var qSkip = '';
    var masterQueryParameter = [];
    masterQueryParameter.push(qRecordCount);
    qTop = '$top=' + (endIndex - startIndex);
    qSkip = '$skip=' + startIndex;
    masterQueryParameter.push(qTop);
    masterQueryParameter.push(qSkip);

    return masterQueryParameter.join('&');
  };

  //This function is to fetch case annotation details
    caseObject.getCaseAnnotationDetails = function (casesObj) {
      var deferred = $q.defer();
     var url = UrlService.getService('GET_CASE_ANNOTATION') + casesObj.caseKey;
      $http.get(url).success(function (response) {
        try {
          var data = response.d.results;
            if(data.length > 0){
            response.d.results[0].CaseAnnotationTag.results.forEach(function(data){
              caseObject.data.tagSelected.push(data);
            });
          }
          deferred.resolve({'data': data, 'message': LanguageService.MESSAGES.SUCCESS_GET_ANNOTATION});
        } catch (e) {
          AlertService.warn(LanguageService.MESSAGES.FAILED_GET_ANNOTATION);
          deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_GET_ANNOTATION});
        }
      }).error(function () {
        AlertService.warn(LanguageService.MESSAGES.FAILED_GET_ANNOTATION);
        deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_GET_ANNOTATION});
      });
      return deferred.promise;
    };
  caseObject.getAllTags = function () {
    var deferred = $q.defer();
    var url = UrlService.getService('GET_ALL_TAGS');
    $http.get(url).success(function (response) {
      try {
        var data = response.d.results.map(function(tempData){
          var temp = angular.copy(TagEntity);
          temp.tagId = tempData.ID;
          temp.tagName = tempData.TAG_NAME;
          temp.tagKey = tempData.TAG_KEY;
          temp.tagType = tempData.TAG_TYPE;
          return temp;
        });
        deferred.resolve({'data': data, 'message': LanguageService.CONSTANTS.EMPTY_STRING});
      } catch (e) {
        AlertService.warn(LanguageService.MESSAGES.FAILED_GET_ALL_TAGS);
        deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_GET_ALL_TAGS});
      }
    }).error(function () {
      AlertService.warn(LanguageService.MESSAGES.FAILED_GET_ALL_TAGS);
      deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_GET_ALL_TAGS});
    });
    return deferred.promise;
  };
  caseObject.getSelectedCases = function (selectedTags, allTags) {
    selectedTags = angular.copy(selectedTags);
    selectedTags = selectedTags.map(function(tempSelectedTag){
      return ''+tempSelectedTag.FK_TAG_KEY+tempSelectedTag.FK_TAG_TYPE_KEY;
    });
    caseObject.data.tagSelected.length=0;
    selectedTags.forEach(function(tempSelectedTag){
      for(var i=0;i<allTags.length;i++){
        if(tempSelectedTag===''+allTags[i].tagKey+allTags[i].tagType){
          caseObject.data.tagSelected.push(allTags[i]);
        }
      }
    });
  };
  return caseObject;
}]);
