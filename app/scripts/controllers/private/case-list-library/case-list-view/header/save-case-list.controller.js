'use strict';

/**
 * @ngdoc function
 * @name saintApp.controller.auth:caselist:SaveCaseListController
 * @description
 * # SaveCaseListController
 * Controller of the saintApp
 */
angular.module('saintApp')
  .controller('SaveCaseListController', ['$scope','$state', 'CaseListFactory', 'alertService', 'LanguageService','CaseFactory','CaseListQueryService','ConstantService','CaseListEntity','$stateParams','$filter', 'ReportFactory','UrlService', function (scope,$state,CaseListFactory,alertService,LanguageService,CaseFactory,CaseListQueryService,ConstantService,CaseListEntity,stateParams,$filter,ReportFactory, UrlService) {
    scope.caseListName = null;
    scope.caseListData = CaseListFactory.data;
    scope.saveCaseList = {
      cloneCaseList: false,
      caseListModalName:null,
      caseListModalTempName: null,
      caseListModalDescription: null,
      saveCaseListModalTempName: null
    };

    //To generate the caseName, description
    scope.fnGenerateNameAndCount = function (caseListSelectedDetails) {
      var caseName = angular.copy(caseListSelectedDetails.caseListName) || ConstantService.CASE_LIST_NOT_SAVED;
      var description = angular.copy(caseListSelectedDetails.description) || null;
      var casesCount = angular.copy(caseListSelectedDetails.casesCount);
      scope.saveCaseList.caseListModalDescription=description;
      if (!description) {
        if(caseName === '('+ConstantService.CASE_LIST_NOT_SAVED+')'){
          caseName = caseName.concat(' '+$filter('date')(new Date(), 'dd-MMM-yyyy'));
        }
        scope.saveCaseList.caseListModalName=caseName;
        scope.saveCaseList.saveCaseListModalTempName=scope.saveCaseList.caseListModalName;
        scope.caseListName = scope.saveCaseList.caseListModalName;
      } else {
        var descriptionSubString = description.substring(0, 30);//Get first 30 characters from Description
        var stringIndex = caseName.lastIndexOf(descriptionSubString);//Get description index
        scope.caseListName = stringIndex > 0 ? caseName.substring(0, stringIndex - 1) : caseName;
        scope.saveCaseList.caseListModalTempName=scope.caseListName;
        scope.saveCaseList.saveCaseListModalTempName=scope.caseListName;
        scope.saveCaseList.caseListModalName=scope.caseListName.concat('_'+scope.saveCaseList.caseListModalDescription.substring(0,30));
      }
      scope.saveCaseList.previousDesc = description;
      scope.saveCaseList.casesCount = casesCount;
    };
    scope.fnSaveUpdateCaseList = function(){
      if(!scope.saveCaseList.caseListModalName){
        alertService.error(LanguageService.MESSAGES.INVALID_CASE_LIST_NAME);
        return false;
      }
      scope.caseListData.caseListObject.caseListName = scope.saveCaseList.caseListModalName;
      scope.caseListData.caseListObject.description = scope.saveCaseList.caseListModalDescription;
      scope.caseListData.caseListObject.caseListDisplayName = scope.caseListName;
      scope.caseListData.caseListObject.saveFlag = 0;
      if(scope.caseListData.cloneCaseList){
        CaseListFactory.doCreateCaseList(UrlService.getService('CREATE_CASE_LIST'), CaseListQueryService.computePayload(scope.caseListData.caseListObject)).then(function (response) {
          if(!response.error) {
            angular.element('#dsui-saveAsCaseListModal').modal('hide');
            scope.caseListData.cloneCaseList = false;
          }
        });
      }else {
        CaseListFactory.fnUpdateCaseList(CaseListQueryService.computePayload(scope.caseListData.caseListObject)).then(function (response) {
          if (!response.error) {
            angular.element('#dsui-saveAsCaseListModal').modal('hide');
          }
        });
      }
    };
    /*Update saveCaseList.caseListModalName whenever user types in description.*/
    scope.fnOnModalChange=function(){
      var description = scope.saveCaseList.caseListModalDescription;
      if (!scope.saveCaseList.previousDesc) {
        if(description){
          scope.saveCaseList.caseListModalName=scope.saveCaseList.saveCaseListModalTempName.concat('_'+description.substring(0,30));
        }else {
          scope.saveCaseList.caseListModalName = scope.saveCaseList.caseListModalName.substring(0, scope.saveCaseList.caseListModalName.length - 1);
        }
      } else {
        var descriptionSubString = scope.saveCaseList.previousDesc?scope.saveCaseList.previousDesc.substring(0, 30):'';//Get first 30 characters from Description
        var stringIndex = descriptionSubString?scope.saveCaseList.caseListModalName.lastIndexOf(descriptionSubString):-1;//Get description index
        scope.caseListName = stringIndex > 0 ? scope.saveCaseList.caseListModalName.substring(0, stringIndex - 1) : scope.saveCaseList.caseListModalName;
        scope.saveCaseList.caseListModalTempName=scope.caseListName;
        scope.saveCaseList.caseListModalName=scope.caseListName.concat('_'+description.substring(0,30));
        if (!description) {
          scope.saveCaseList.caseListModalName=scope.saveCaseList.caseListModalName.substring(0,scope.saveCaseList.caseListModalName.length-1);
        }
      }
      scope.saveCaseList.previousDesc = description;
    };
    scope.fnOnCaseListNameChange = function(){
      scope.saveCaseList.saveCaseListModalTempName = angular.copy(scope.saveCaseList.caseListModalName);
      var description = scope.saveCaseList.caseListModalDescription;
      if(description){
        var descriptionSubString = description.substring(0, 30);//Get first 30 characters from Description
        var stringIndex = scope.saveCaseList.saveCaseListModalTempName.lastIndexOf(descriptionSubString);//Get description index
        scope.caseListName = stringIndex > 0 ? scope.saveCaseList.saveCaseListModalTempName.substring(0, stringIndex - 1) : scope.saveCaseList.saveCaseListModalTempName;
      }else{
        scope.caseListName = angular.copy(scope.saveCaseList.caseListModalName);
      }
    };
    scope.$watch('caseListData.caseListObject.caseListMode',function(value){
      if(value !== null){
        scope.fnGenerateNameAndCount(scope.caseListData.caseListObject);
      }
    });
  }]);

