'use strict';

/**
 * @ngdoc function
 * @name saintApp.controller.auth:caselist:CaseListHeaderController
 * @description
 * # CaseListHeaderController
 * Controller of the saintApp
 */
angular.module('saintApp')
  .controller('CaseListHeaderController', ['$scope','$state', '$rootScope', 'CaseListFactory', 'alertService', 'LanguageService','CaseFactory','CaseListQueryService','ConstantService','CaseListEntity','$stateParams','$filter', 'ReportFactory', 'SaintService', function (scope,$state,$rootScope,CaseListFactory,alertService,LanguageService,CaseFactory,CaseListQueryService,ConstantService,CaseListEntity,stateParams,$filter,ReportFactory,SaintService) {
    scope.caseListName = null;
    scope.caseListDisplayName = null;
    scope.caseListData = CaseListFactory.data;
    scope.caseListCount = {
      lastRunCount: ConstantService.NO_VALUE,
      lastSavedCount: ConstantService.NO_VALUE,
      listedCount: 0,
      addedCount: 0,
      removedCount: 0,
      annotatedCount: 0
    };
    scope.caseList = {
      asOfDate: '',
      disableSave: true,
      disableSaveAs: false,
      disableToggleButtons: false,
      disableShareCaselist: false
    };
    scope.counter = 0;

    //To trigger share case list modal
    scope.fnShareCaseList = function () {
      angular.element('#dsui-share-caselist').modal({backdrop: 'static', keyboard: false});
      $rootScope.$emit(ConstantService.MANAGE_CASE_LIST_SHARE + '_' + ConstantService.SHARE_CASE_LIST);
    };

    /**
     * Clean up the report expanded state before moving to the dashboard
     * @param state
     */
    scope.fnWrapperNavigate = function(location){
      if( ReportFactory.data.reportPanelState === ConstantService.EXPANDED) {
        scope.fnPersistReportPanelState(ConstantService.HIDDEN);
      }
      if(SaintService.fnProvideAlertForDirtyFlags()){
        scope.fnNavigate(location);
      }
    };

    scope.fnNavigateFromCases = function(location){
      if(SaintService.fnProvideAlertForDirtyFlags()){
        scope.fnNavigate(location);
      }
    };

    /**
     * Persisting the state of the report summaary panel
     * @param state
     */
    scope.fnPersistReportPanelState = function (state) {
      ReportFactory.data.reportPanelState = state;
      ReportFactory.persistPreference('REPORT_PANEL_STATE', state, null, ConstantService.SESSION_BASED);
      ReportFactory.persistPreference('CURR_REPORT_ID', ReportFactory.data.selectedTileId, null, ConstantService.SESSION_BASED);
    };
    scope.fnOnDateChange = function(){
      var thisDate = angular.element('#dsuiCaseListAsOfDate').val();
      var regExp = /^(\d{1,2})(\/|-)([a-zA-Z]{3})(\/|-)(\d{4})$/.exec(thisDate);
      // Added console statements to debug IE issue
      if(thisDate && !regExp){
        console.log('return:');
        return;
      }
      if (scope.caseList.asOfDate) {
        console.log('if:');
        if (scope.caseListData.caseListObject && scope.caseListName) {
          scope.caseListData.caseListObject.asOfDate = scope.caseList.asOfDate;
          scope.caseListData.caseListObject.saveFlag = 1;
          scope.fnSave();
        }
      } else {
        // Added console statements to debug IE issue
        console.log('thisDate:else:',thisDate);
        if (!thisDate && CaseListFactory.data.checkServiceCount !== 0 && scope.caseListName) {
          console.log('else:',CaseListFactory.data.checkServiceCount, scope.caseListName);
          alertService.error(LanguageService.MESSAGES.MANDATORY_AS_OF_DATE);
        }
      }
    };
    scope.fnSave = function(){
      CaseListQueryService.fnRunQuery(scope.caseListData.caseListObject);
      angular.element('#dsui-saveAsCaseListModal').modal('hide');
    };
    //To generate the caseName, description
    scope.fnGenerateNameAndCount = function (caseListSelectedDetails) {
      var caseName = angular.copy(caseListSelectedDetails.caseListName) || '('+ConstantService.CASE_LIST_NOT_SAVED+')';
      var description = angular.copy(caseListSelectedDetails.description) || null;
      scope.caseList.asOfDate = caseListSelectedDetails.asOfDate || new Date();
      if (!description) {
        scope.caseListName = caseName;
        scope.caseListDisplayName = angular.copy(scope.caseListName);
      } else {
        var descriptionSubString = description.substring(0, 30);//Get first 15 characters from Description
        var stringIndex = caseName.lastIndexOf(descriptionSubString);//Get description index
        scope.caseListName = stringIndex > 0 ? caseName.substring(0, stringIndex - 1) : caseName;
        scope.caseListDisplayName = scope.caseListName + '_' + descriptionSubString;
      }
      scope.caseListData.caseListObject.caseListName = scope.caseListName;
      scope.caseListData.caseListObject.description = description;
    };
    /*To generate the counts for all the cases (TrackAll and last run, last saved cases)*/
    scope.fnTrackAllCaseListCount = function(){
      CaseListFactory.getAllCasesCount($state.params.id)
        .then(function(result){
          if(result && result.data){
            scope.caseListCount.listedCount = result.data.listed;
            scope.caseListCount.removedCount = result.data.removed;
            scope.caseListCount.addedCount = result.data.added;
            scope.caseListCount.annotatedCount = result.data.annotated;
            scope.caseListCount.lastRunCount = result.data.lastRun || ConstantService.NO_VALUE;
            scope.caseListCount.lastSavedCount = result.data.lastSaved || ConstantService.NO_VALUE;

            if(!scope.caseListData.caseListObject.sourceQueryUI && !scope.caseListData.caseListObject.visualQueryFilterUI){
              scope.fnSetFlagsForEmptyQuery();
            }
            scope.caseListData.updateQueryString = true;
          }else{
            alertService.error(LanguageService.MESSAGES.FAILED_TO_GET_CASE_LIST_COUNT);
          }
        });
    };
    /* Update count when any cases are included or excluded */
    scope.$watch('caseListData.excludeInclude',function(value){
      if(value){
        scope.caseListData.excludeInclude = false;
        scope.fnTrackAllCaseListCount();
      }
    },true);
    /**
    * Click on the track will call this function
    * @param value
    */
    scope.fnTrackCases = function (value) {
      CaseFactory.data.trackViewType = value;

    };
    scope.fnSaveCaseList = function(){
      if(scope.caseListName && scope.caseListName === '('+ConstantService.CASE_LIST_NOT_SAVED+')'){
        scope.caseListData.cloneCaseList = false;
        angular.element('#dsui-saveAsCaseListModal').modal('show');
        return;
      }
      scope.caseListData.caseListObject.asOfDate = scope.caseList.asOfDate;
      scope.caseListData.caseListObject.saveFlag = 0;
      scope.fnSave();
    };
    scope.fnSaveAsCaseList = function(){
      scope.caseListData.cloneCaseList = true;
      angular.element('#dsui-saveAsCaseListModal').modal('show');
    };
    scope.fnResetQuery = function(){
      scope.caseListData.cloneCaseList = false;
      CaseListFactory.data.selectedChartsList.length = 0;
      CaseListFactory.data.selectedChartsList.updateDB = true;
    };
    scope.fnBuildReportPackage = function(){
      if(SaintService.fnProvideAlertForDirtyFlags()){
        $state.go(ConstantService.REPORT_PACKAGE_STATE, {'caseListKey': stateParams.id, 'reportKey': stateParams.page,'page' : stateParams.page});
      }
    };
    /***
       * The below two functions hides the data view popover
     */
    scope.fnCloseModal=function(){
      scope.showDataViewPage=false;
    };
    scope.$on('closeDataViews',function(){
      scope.showDataViewPage=false;
    });

    /* Update count when any cases are included or excluded */
    scope.$watch('caseListData.operatorsList',function(value){
      if(value && value.length > 0){
        if(CaseListFactory.data.checkServiceCount === 0) {
          CaseListFactory.data.checkServiceCount++;
          scope.fnGetSelectedCaseListAllDetails();
        }
      }
    });
    /* Get Case List Details */
    scope.fnGetSelectedCaseListAllDetails = function(){
      CaseListFactory.getSelectedCaseListAllDetails($state.params.id).then(function (response) {
        if (response.data) {
          scope.fnGenerateNameAndCount(response.data);
        } else {
          alertService.warn(LanguageService.MESSAGES.FAILED_TO_GET_CASE_LISTS);
        }
      });
    };
    scope.fnDownloadExcel = function () {
      var caseList = angular.copy(CaseListEntity);
      caseList.baseCaseListKey = stateParams.id;
      if (caseList.baseCaseListKey) {
      CaseListFactory.createCaseListCSV(caseList.baseCaseListKey);
      }
    };
    scope.fnToggleDataView=function(){
      if(!scope.showDataViewPage){
        scope.showDataViewPage=true;
      }
    };
    /* Update Name of Case List when there is change in the case list object */
    scope.$watch('caseListData.caseListObject.caseListName',function(value){
      if(value){
        scope.fnGenerateNameAndCount(scope.caseListData.caseListObject);
      }
    }, true);
    /*scope.$watch('caseListData.enableSave',function(value){
      if(value){
        if(scope.caseList.disableSave && scope.caseListData.caseListObject.caseListMode === 0){
          scope.caseListData.enableSave = false;
          scope.caseList.disableSave = false;
        }
      }
    },true);*/
    scope.$watch('caseListData.caseListObject.queryBuilderObject.setEntities',function(value){
      if(value && value.length > 0){
        if(scope.caseListData.caseListObject.queryBuilderObject.expressionEntity.length <= 0) {
          CaseListQueryService.setExpressionEntity();
        }
      }
    },true);
    scope.$watch('caseListData.caseListObject.caseListMode',function(value){
      if(value === 1) {
        scope.caseList.disableSave = false;
        scope.caseList.disableShareCaselist = true;
      }else{
        scope.caseList.disableSave = true;
        scope.caseList.disableShareCaselist = false;
      }
      // Disable Save if its Shared Case List
      if(scope.caseListData.caseListObject.isShared === 1){
        scope.caseList.disableShareCaselist = true;
        scope.caseList.disableSave = true;
      }
      scope.caseList.disableSaveAs = false;
      scope.caseList.disableToggleButtons = false;
      if(value !==null && !scope.caseListData.caseListObject.sourceQueryUI && !scope.caseListData.caseListObject.visualQueryFilterUI){
        scope.fnSetFlagsForEmptyQuery();
        $state.go(ConstantService.STATE.CASE_LIST_QUERY_STATE,{id:$state.params.id, page:$state.params.page});
      }
      if(!scope.caseListData.caseListObject.caseListDisplayName){
        scope.caseList.disableSaveAs = true;
      }
      if(value !== null) {
        scope.fnTrackAllCaseListCount();
      }
    }, true);
    scope.fnSetFlagsForEmptyQuery = function(){
      scope.caseListCount.lastRunCount = ConstantService.NO_VALUE;
      scope.caseListCount.lastSavedCount = ConstantService.NO_VALUE;
      scope.caseList.disableSave = true;
      scope.caseList.disableSaveAs = true;
      scope.caseList.disableToggleButtons = true;
    };
    scope.fnInit = function(){
      scope.showDataViewPage=false;
      scope.caseListData.cloneCaseList = false;
    };
    scope.fnEnableDatepicker=function(id)
    {
      angular.element(id).datepicker('show');
    };
    scope.fnInit();
  }]);

