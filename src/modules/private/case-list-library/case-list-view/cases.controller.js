'use strict';

/**
 * @ngdoc function
 * @name saintApp.controller.auth:caselist:CaseListController
 * @description
 * # CaseListController
 * Controller of the saintApp
 */
angular.module('saintApp')
  .controller('CasesController', ['$scope','$state','CaseListFactory','$rootScope','$location','ConstantService','CaseListEntity', 'SaintService', function (scope,$state,CaseListFactory,$rootScope,$location,ConstantService, CaseListEntity, SaintService) {
    scope.caseListData = CaseListFactory.data;
    scope.currentTab = null;
    scope.casesList={
      currentView:0
    };
    /*
    This Function is called from child controller when the apply button is pressed from data view popup. It will refresh the visual page
     */
    scope.fnBroadcastDataViews=function(){
      scope.$broadcast('applyDataViews');
    };
    /**
     * This Function is called from child controller when the apply button is pressed from data view popup after saving the date to backend. It will
     * close the data view popover
     */
    scope.closeDataViews=function(){
      scope.$broadcast('closeDataViews');
    };

    scope.setPageMode = function(pageMode) {
      CaseListFactory.data.pageMode = pageMode;
    };

    scope.getPageMode = function() {
      return CaseListFactory.data.pageMode;
    };
    scope.fnToggleView=function(view){
      scope.reportPackageData.view = view;
      if(view!==2){
        if(SaintService.fnProvideAlertForDirtyFlags()){
          if(view===1){
            $state.go(ConstantService.STATE.CASE_LIST_VISUALS_STATE,{id:$state.params.id, page: $state.params.page});
          }else if(view===3){
            $state.go(ConstantService.STATE.CASE_LIST_TABLE_STATE,{id:$state.params.id, page:$state.params.page});
          }
          scope.casesList.currentView=view;
        }
      }
      else {
        $state.go(ConstantService.STATE.CASE_LIST_QUERY_STATE,{id:$state.params.id, page:$state.params.page});
        scope.casesList.currentView=view;
      }
    };
    scope.fnIdentityRoute=function(){
      if($state.current.name===ConstantService.STATE.CASE_LIST_TABLE_STATE){
        scope.casesList.currentView=3;
      }else if($state.current.name===ConstantService.STATE.CASE_LIST_QUERY_STATE){
        scope.casesList.currentView=2;
      }else{
        scope.casesList.currentView=1;
      }
      scope.currentTab = $state.current.name;
    };
    $rootScope.$watch(function() {
        return $location.path();
      },
      function(newValue, oldValue) {
        if (newValue !== oldValue) {
          scope.fnIdentityRoute();
        }
      },
      true);
    /* This function is to get Dimensions and Operators Info */
    scope.fnGetOperatorDimensionInfo = function(){
      CaseListFactory.getDimensionInfo().then( function(response){
        scope.caseListData.dimensionsList = [];
        if(response) {
          angular.forEach(response.data, function (dimensionInput) {
            scope.caseListData.dimensionsList.push(dimensionInput);
          });
          CaseListFactory.getOperatorInfo().then(function (response1) {
            scope.caseListData.operatorsList = [];
            if (response1) {
              angular.forEach(response1.data, function (operatorInput) {
                scope.caseListData.operatorsList.push(operatorInput);
              });
            }
          });
        }
      });
    };
    scope.fnInit = function(){
      scope.reportPackageData = {};
      scope.reportPackageData.bclkey = $state.params.id;
      scope.reportPackageData.view = 2;
      scope.reportPackageData.page = $state.params.page;
      scope.page = $state.params.page;
      scope.setPageMode($state.params.pageMode);
      scope.caseListData.updateQuerySet = [];
      scope.fnGetOperatorDimensionInfo();
      scope.fnIdentityRoute();
    };
    scope.fnInit();
    scope.$on('$destroy', function() {
      CaseListFactory.data.checkServiceCount = 0;
      CaseListFactory.data.dimensionsList = [];
      CaseListFactory.data.operatorsList = [];
      CaseListFactory.data.caseListObject = angular.copy(CaseListEntity);
    });
  }]);

