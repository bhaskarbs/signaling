'use strict';
angular.module('saintApp')
  .controller('CaseDetailsController', ['$scope', '$state', 'CaseFactory', 'LanguageService', 'alertService', 'loaderService', 'ConstantService',
    function (scope, $state, CaseFactory, LanguageService, alertService, loaderService, ConstantService) {
      scope.state = $state;
      scope.caseData = {'selectedTags':CaseFactory.data.tagSelected, 'load':false};
      scope.caseDetails = {};
      scope.caseSuspectProducts = [];
      scope.caseEvents = [];
      scope.primaryOnsetDate = null;
      scope.lConstants = LanguageService.CONSTANTS;
      scope.result = null;
      scope.pageInfo = '';
      scope.annotationText='';

      //This function is defined to get the all dates checked for the format
      scope.fnGetCaseListDatesCheck = function () {
        CaseFactory.getCaseListDatesCheck(scope.paramsObj.baseCaseKey).then(function (datesChkObj) {
          if (datesChkObj.data) {
            scope.paramsObj.datesCheck = {
              eventRcptDate: datesChkObj.data.eventReceiptDate,
              initialRcptDate: datesChkObj.data.initialReceiptDate,
              followUpRcptDate: datesChkObj.data.followupReceiptDate
            };
          } else {
            alertService.error(LanguageService.MESSAGES.FAILED_TO_GET_CASE_LIST_DATES);
          }
        });
      };
      //This function is defined to get the selected case number or row details.
      scope.fnGetSelectedCaseDetails = function () {
        CaseFactory.getSelectedCaseDetails(scope.paramsObj).then(function (caseDetailsObj) {
          if (caseDetailsObj.data) {
            scope.caseDetails = caseDetailsObj.data;
          } else {
            alertService.error(LanguageService.MESSAGES.FAILED_TO_GET_SELECTED_CASE_LISTS);
          }
          loaderService.stop();
        });
      };

      //This function is defined to get the suspected products for the selected case number.
      scope.fnGetCaseSuspectProducts = function () {
        CaseFactory.getCaseSuspectProducts(scope.paramsObj).then(function (caseDetailsObj) {
          if (caseDetailsObj.data) {
            scope.caseSuspectProducts = caseDetailsObj.data.suspectProducts;
          } else {
            alertService.error(LanguageService.MESSAGES.FAILED_TO_GET_CASE_LISTS);
          }
        });
      };
      //This function is defined to get the events for the selected case number.
      scope.fnGetCaseEvents = function () {
        CaseFactory.getCaseEvents(scope.paramsObj).then(function (caseDetailsObj) {
          if (caseDetailsObj.data) {
            scope.caseEvents = caseDetailsObj.data.events;
          } else {
            alertService.error(LanguageService.MESSAGES.FAILED_TO_GET_CASE_EVENTS);
          }
        });
      };
      //This function is defined to get the ICSR submission history for the selected case number.
      scope.fnGetICSRSubmissions = function () {
        CaseFactory.getICSRSubmissions(scope.paramsObj).then(function (caseDetailsObj) {
          if (caseDetailsObj.data) {
            scope.icsrSubmissionsData = caseDetailsObj.data.icsrSubmissions;
          } else {
            alertService.error(LanguageService.MESSAGES.FAILED_TO_GET_ICSR_SUBMISSIONS);
          }
        });
      };

      //This function is defined to get the periodic submission history for the selected case number.
      scope.fnGetSubmissionHistoryPeriodic = function () {
        CaseFactory.getCaseSubmissionHistoryPeriodic(scope.paramsObj).then(function (caseDetailsObj) {
          if (caseDetailsObj.data) {
            scope.submissionHistoryPeriodic = caseDetailsObj.data.submissionHistoryPeriodic;
          } else {
            alertService.error(LanguageService.MESSAGES.FAILED_TO_GET_PERIODIC_SUBMISSIONS);
          }
        });
      };

      //This function is defined to get the case Narrative for the selected case number.
      scope.fnCaseNarrative = function () {
        CaseFactory.getCaseNarrative(scope.paramsObj).then(function (caseDetailsObj) {
          if (caseDetailsObj.data) {
            scope.caseNarrative = caseDetailsObj.data.CaseNarratives;
          } else {
            alertService.error(LanguageService.MESSAGES.FAILED_TO_GET_CASE_NARRATIVE);
          }
        });
      };

      //This function is defined to save the annotation in the case details page.
      scope.fnSaveAnnotation = function (annotationText) {
      if (( annotationText.length > 0 ) || ( scope.caseData.selectedTags.length > 0)){
      loaderService.start();
        CaseFactory.fnAnnotationSave(scope.paramsObj,annotationText,scope.caseDetails.caseId).then(
          function (result) {
            if(result.data){
              scope.result = result;
              alertService.success(LanguageService.MESSAGES.UPDATED_ANNOTATION);
            }
            loaderService.stop();
          }
        );
       } else {
          alertService.error(LanguageService.MESSAGES.ANNOTATION_TEXT_VALIDATION);
       }
      };

      //This function is defined to get the selected case annotation and case tags.
            scope.fnGetSelectedCaseAnnotationDetails = function () {
              CaseFactory.getCaseAnnotationDetails(scope.paramsObj).then(function (caseDetailsObj) {
                if (caseDetailsObj.data) {
                  if(caseDetailsObj.data.length > 0){
                    scope.annotationText = caseDetailsObj.data[0].ANNOTATION;
                  }
                } else {
                  alertService.error(LanguageService.MESSAGES.FAILED_GET_ANNOTATION);
                }
                scope.caseData.load=true;
                loaderService.stop();
              });
            };

      //On load functions are initiated
      scope.fnInit = function () {
        scope.caseDetails = {};
        scope.pageInfo = $state.params.page;
        scope.paramsObj = {caseKey: scope.state.params.caseKey, baseCaseKey: scope.state.params.id};
        scope.caseListTableNavigationData = {id:scope.paramsObj.baseCaseKey, page:$state.params.page, pageMode: ConstantService.EDIT_MODE };
        loaderService.start();
        if(scope.paramsObj.caseKey){
        scope.fnGetCaseListDatesCheck();
        scope.fnGetSelectedCaseDetails();
        scope.fnGetCaseSuspectProducts();
        scope.fnGetCaseEvents();
        scope.fnGetICSRSubmissions();
        scope.fnGetSubmissionHistoryPeriodic();
        scope.fnCaseNarrative();
        scope.fnGetSelectedCaseAnnotationDetails();
        }
      };
      scope.fnInit();
    }]);
