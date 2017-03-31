'use strict';

/**
 * @ngdoc function
 * @name saintApp.controller.auth:caselist:BuildReportPackageController
 * @description
 * # BuildReportPackageController
 * Controller of the saintApp
 */
angular.module('saintApp')
  .controller('BuildReportPackageController', ['$scope','$state','$stateParams', 'UrlService', 'UserService','filterFilter','$window','ConstantService','SaveReportPackageEntity','ReportFactory','$modal','ReportOutputFactory','loaderService', function (scope,$state,stateParams,UrlService,UserService,filterFilter,$window,ConstantService,SaveReportPackageEntity,ReportFactory,$modal,ReportOutputFactory,loaderService) {
    /**
    *This function is executed when user types in search text box.
    */
    scope.openReportFolder=function(){
      angular.forEach(scope.templateData,function(value,key){
        var temp=false;
        angular.forEach(value.children,function(reports,index){
        if(filterFilter(reports.children,scope.searchReports).length>0 && scope.searchReports.length>0){
          scope.templateData[key].children[index].expand=true;
          scope.templateData[key].expand=true;
          temp=true;
        }
        else
        {
          scope.templateData[key].children[index].expand=false;
          if(!temp){scope.templateData[key].expand=false;}
        }
      });
      });
    };

    scope.fnNavigatePrevious = function () {
      if(scope.prevStateData){
       var view = scope.prevStateData.view;
        if(view===1){
          $state.go(ConstantService.STATE.CASE_LIST_VISUALS_STATE,{id:scope.prevStateData.bclkey, page: scope.prevStateData.page});
        }else if(view===3){
          $state.go(ConstantService.STATE.CASE_LIST_TABLE_STATE,{id:scope.prevStateData.bclkey, page: scope.prevStateData.page});
        }else if(view===2) {
          $state.go(ConstantService.STATE.CASE_LIST_QUERY_STATE, {id:scope.prevStateData.bclkey, page: scope.prevStateData.page});
        }else{
          $state.go(ConstantService.STATE.CASE_LIST_LIBRARY);
        }}

    };
    /**
     * This function is called when oontroller invokes to get the template data in hierarchical format
     */
    scope.fnGetDataFromFactory = function(){
      scope.defaultTemplates=[];
      scope.additionalReportTree=[];
      ReportOutputFactory.getReportTemplateData(scope.selectedCaseListKey,scope.selectedCaseListName).then(
        function (result) {
          scope.templateData = scope.fnSortTree(result.data);
          return result;
        }
      ).then(function(){
        if(scope.reportDetails.additionalReports.subReports.length>0){
          scope.isSelectAll = scope.reportDetails.additionalReports.subReports[0].selectAllFlag?true:false;
          scope.packageId=scope.reportDetails.additionalReports.subReports[0].packageId;
          scope.isBlindedOrUnblinded=scope.reportDetails.additionalReports.subReports[0].isBlinded?ConstantService.REPORT_BLINDED:ConstantService.REPORT_UNBLINDED;
          scope.isDraftOrFinal=scope.reportDetails.additionalReports.subReports[0].isFinal?ConstantService.FINAL_STRING:ConstantService.DRAFT_STRING;
        }else{
          scope.fnLoadLockedTemplates();
        }
        angular.forEach(scope.reportDetails.additionalReports.subReports, function (subreport) {
          if(subreport.isMainReport){
            scope.defaultTemplates.push(subreport);
          }else{
            scope.additionalReportTree.push(subreport);
          }
        });
        scope.additionalReportTree = _.sortBy(scope.additionalReportTree, function(object) { return object.instanceId; });
        scope.loadDefaultTemplates = true;
        scope.initialPayload=angular.copy(scope.fnGetPayload());
      });
    };
    scope.fnSortTree =function(treeData){
      angular.forEach(treeData, function (firstLevelTemplate) {
        angular.forEach(firstLevelTemplate.children, function (secondLevelTemplate) {
          var temp=[];
          temp =_.sortBy(secondLevelTemplate.children, function(object) { return object.subReportName; });
          secondLevelTemplate.children=temp;
        });
        var tempSecondlevel = [];
        tempSecondlevel =_.sortBy(firstLevelTemplate.children, function(object) { return object.templateName; });
        firstLevelTemplate.children = tempSecondlevel;
      });
      treeData = _.sortBy(treeData, function(object) { return object.templateName; });
      return treeData;
    };
    scope.fnLoadDataFromBackend = function(){
      loaderService.start();
      var url = UrlService.getService('REPORT_PANEL_LIST');
      url += scope.stateParams.key;
      ReportFactory.getReportInformation(url).then(function (result) {
        if(!result.error) {
          scope.reportDetails = ReportFactory.data.reportPanelDetails[0];
          scope.headerReportOutput = scope.reportDetails.reportCustomName;
          scope.reportKey = scope.reportDetails.reportKey;
          scope.selectedRptTypeKey = scope.reportDetails.reportType;
          scope.selectedCaseListKey = scope.reportDetails.bclKey;
          scope.selectedCaseListName = scope.reportDetails.bclDisplayName;
          scope.defaultTemplateName = scope.reportDetails.reportTypeName;
          scope.fnGetDataFromFactory();
        }
      });
    };
    scope.fnGetCaselistMetadata =function(){
      ReportOutputFactory.getReportTemplateData(scope.selectedCaseListKey,scope.selectedCaseListName).then(
        function (result) {
          scope.templateData = result.data;
        }
      );
    };

    /**
     *This function is executed whenever a subreport is selected or unselected
     *
       */
    scope.fnSelectTemplate = function () {
      var subreportSelect = _.pluck(scope.defaultTemplates, 'isSelectedInPackage');
      subreportSelect.push.apply(subreportSelect,_.pluck(scope.additionalReportTree, 'isSelectedInPackage'));
      if(subreportSelect.indexOf(false)!==-1){
        scope.isSelectAll = false;
      }else{
        scope.isSelectAll = true;
      }
      scope.fnSpyOnChange();
    };
    /*
     * Function to be implemented once the generate button is clicked
    */
    scope.fnGeneratePackage = function () {
      $modal.open({
        templateUrl: 'save-report-output-modal.html'
      });
    };

    /*
    * Function to get the payload backend is expecting
    */
    scope.fnGetPayload = function(){
      var payload=angular.copy(SaveReportPackageEntity);
      payload.RPT_PKG_KEY = scope.packageId;
      payload.IS_REPORT_FLOW = scope.selectedRptTypeKey?1:0;
      payload.RPT_KEY = scope.reportKey;
      payload.SELECT_ALL = scope.isSelectAll?1:0;
      payload.IS_BLINDED = scope.isBlindedOrUnblinded===scope.constants.REPORT_BLINDED?1:0;
      payload.IS_FINAL = scope.isDraftOrFinal===scope.constants.FINAL_STRING?1:0;
      angular.forEach(scope.defaultTemplates, function (defaultTemplate) {
        var data={};
        data.RPT_INSTANCE_ID=1;
        data.FK_SRT_KEY=defaultTemplate.srtKey;
        data.FK_BCL_KEY=defaultTemplate.bclKey;
        data.IS_MAIN_REPORT=1;
        data.IS_SELECTED=defaultTemplate.isSelectedInPackage?1:0;
        data.DOCUMENT_TYPE=defaultTemplate.documentType?defaultTemplate.documentType:0;
        payload.data.push(data);
      });
      var additionalReportInstance=1;
      angular.forEach(scope.additionalReportTree, function (additionalTemplate) {
        var dataAdditionalReport={};
        dataAdditionalReport.RPT_INSTANCE_ID=++additionalReportInstance;
        dataAdditionalReport.FK_SRT_KEY=additionalTemplate.srtKey;
        dataAdditionalReport.FK_BCL_KEY=additionalTemplate.bclKey;
        dataAdditionalReport.IS_MAIN_REPORT=0;
        dataAdditionalReport.IS_SELECTED=additionalTemplate.isSelectedInPackage?1:0;
        dataAdditionalReport.DOCUMENT_TYPE=additionalTemplate.documentType?additionalTemplate.documentType:0;
        payload.data.push(dataAdditionalReport);
      });
      return payload;
    };
    /*
    *This function enables save button if there is any change made by user on the page.
    */
    scope.fnSpyOnChange= function(){

      var newPayload=scope.fnGetPayload();
      var mainObjKeys=Object.keys(scope.initialPayload);
      var test=false;
      var i=0;
      for(i;i<mainObjKeys.length;i++){
        if(typeof(scope.initialPayload[mainObjKeys[i]])!=='object'){
          if(scope.initialPayload[mainObjKeys[i]]!==newPayload[mainObjKeys[i]]){
            scope.isSaveEnable=true;
            test=true;
            break;
          }else{
            scope.isSaveEnable=false;
          }
        }
      }
      if(scope.initialPayload.data){
        if(scope.initialPayload.data[0]){
      var mainDataObjKeys=Object.keys(scope.initialPayload.data[0]);
      var j=0;
      var previousValuesArray=[];
      var newValuesArray=[];
      previousValuesArray.push(previousValuesArray.length);
      newValuesArray.push(newValuesArray.length);
      for(j;j<mainDataObjKeys.length;j++){
          previousValuesArray.push.apply(previousValuesArray,_.pluck(scope.initialPayload.data, mainDataObjKeys[j]));
          newValuesArray.push.apply(newValuesArray,_.pluck(newPayload.data, mainDataObjKeys[j]));
      }
      if (!(_.isEqual(previousValuesArray, newValuesArray))) {
        scope.isSaveEnable=true;
      }else if(test){
         scope.isSaveEnable=true;
      }else{
        scope.isSaveEnable=false;
      }
    }else if(scope.additionalReportTree.length>0){
        scope.isSaveEnable=true;
      }
    }
    };
    /*
    * To expand collapse the folder
    */
    scope.showList= function(node){
        node.expand=!node.expand;
      };
        scope.treeOptions = {
          /* jshint ignore:start */
          dropped: function(event) {
            scope.fnSpyOnChange();
          }
          /* jshint ignore:end */
        };

    /*
    * To load the primary sub report types which can't be removed
    */
    scope.fnLoadLockedTemplates=function(){
      scope.isSelectAll = true;
      scope.defaultTemplates=[];
      var defaultReportTypeKey=Number(scope.selectedRptTypeKey);
      var templateData=angular.copy(scope.templateData);
      angular.forEach(templateData,function(value){
          angular.forEach(value.children,function(subReport){
            angular.forEach(subReport.children,function(subReportsTypes){
             if(subReportsTypes.reportTypeKey===defaultReportTypeKey){
                subReportsTypes.isSelectedInPackage=true;
                scope.defaultTemplates.push(subReportsTypes);
             }
             });

          });
      });
      scope.loadDefaultTemplates = true;
      scope.initialPayload=angular.copy(scope.fnGetPayload());
    };
    /*
    * To select the document type, pdf/excel, by default pad is 0 and excel is 1
    */
    scope.fnSelectDocumentormat= function(node,type){
      node.documentType=type;
      scope.fnSpyOnChange();
    };
    /*
    * Function when select all is checked or unchecked.
    */
    scope.fnselectAll = function(selectAll){
      angular.forEach(scope.defaultTemplates,function(value){
        value.isSelectedInPackage = selectAll;

      });
      angular.forEach(scope.additionalReportTree,function(value){
        value.isSelectedInPackage = selectAll;

      });
      scope.fnSpyOnChange();
    };

    /*
    * Watching a change on different variables to enable save button.
    */
    scope.$watchGroup(['additionalReportTree.length','isDraftOrFinal','isBlindedOrUnblinded'],function() {
         if(scope.additionalReportTree.length>0){
          scope.showDropArea=false;
        }else{
          scope.showDropArea=true;
        }
        scope.fnSpyOnChange();
      });
    scope.fnDiscardChanges = function(){
      scope.isDiscard = true;
      scope.isSaveEnable = false;
      scope.modalInstance.dismiss('cancel');
    };
  scope.fnSavePackage =function (){
    if(scope.modalInstance){
      scope.modalInstance.opened.then(function() {
        scope.isDiscard = true;
        scope.isSaveEnable = false;
      });
    }
    var payload=scope.fnGetPayload();
    ReportOutputFactory.saveReportOutputMetadata(payload).then(
    function (result) {
      if(!result.error){
        scope.isSaveEnable = false;
        scope.initialPayload=scope.fnGetPayload();
        scope.modalInstance.dismiss('cancel');
      }else{
        scope.isSaveEnable = true;
        scope.isDiscard = false;
        scope.modalInstance.dismiss('cancel');
      }
    }
  );
};
    scope.$on('$stateChangeStart', function(event, next, current) {

      if (scope.isSaveEnable) {
        event.preventDefault();
        scope.nextState=next.name;
        scope.nextStateParams=current;
        scope.modalInstance=$modal.open({
          templateUrl: UrlService.getView('SAVE_REPORT_OUTPUT_MODAL'),
          scope: scope
        });
        scope.modalInstance.result.then(function () {
          $modal.close();
        }, function () {
          if(scope.isDiscard){
            scope.isDiscard = false;
            scope.fnNavigate(scope.nextState,scope.nextStateParams);
          }
        });
      }
    });
    scope.fnToggleLeftPanel = function(){
      scope.showLeftPanel = !scope.showLeftPanel;
    };

    scope.fnToggleToDefault=function(){
      scope.defaultView=true;
    };
    scope.fnOpenUpdateCaseListModal = function (subreport) {
      ReportOutputFactory.data.selectedFilters=[];
      angular.element('#caselistModal').modal('show');
      scope.subreportNode = subreport;

      scope.fnToggleToDefault();
    };
    scope.$on('OPEN_FILTER_VIEW',function(){
      scope.defaultView=false;
    });
    scope.$on('HIDE_UPDATE_CASELIST_MODAL',function(){
      if(ReportOutputFactory.data.isReadyToAttach){
        ReportOutputFactory.data.isReadyToAttach = false;
        scope.subreportNode.bclDisplayName=ReportOutputFactory.data.attachCaseListData.bclDisplayName;
        scope.subreportNode.bclKey=ReportOutputFactory.data.attachCaseListData.bclKey;
        scope.fnSpyOnChange();
      }
      angular.element('#caselistModal').modal('hide');
    });
    scope.fnInit = function () {
      //Get Case List Key
      scope.stateParams={};
      scope.stateParams.reports=parseInt(stateParams.reports);
      scope.stateParams.collapse=parseInt(stateParams.collapse);
      scope.stateParams.key=parseInt(stateParams.key);
      scope.defaultTemplates=[];
      scope.additionalReportTree=[];
      scope.searchReports='';
      scope.constants=ConstantService;
      scope.isDraftOrFinal=ConstantService.DRAFT_STRING;
      scope.isBlindedOrUnblinded=ConstantService.REPORT_UNBLINDED;
      scope.initialPayload={};
      scope.isSaveEnable=false;
      scope.isSelectAll =false;
      scope.showDropArea=false;
      scope.showLeftPanel = true;
      scope.isFromCaselist = false;
      scope.packageId= -1;
      scope.defaultView=true;
      scope.headerReportOutput=null;
      scope.subreportNode={};
      scope.isDiscard = false;
      if(scope.stateParams.reports){
      scope.reportDetails=ReportFactory.data.reportPanelDetails[0];
        scope.showLeftPanel = scope.stateParams.collapse?false:true;
      scope.loadDefaultTemplates=false;
        if(scope.reportDetails) {
          if(scope.reportDetails.additionalReports.reportKey === scope.stateParams.key) {
            scope.headerReportOutput = scope.reportDetails.reportCustomName;
            scope.reportKey = scope.reportDetails.reportKey;
            scope.selectedRptTypeKey = scope.reportDetails.reportType;
            scope.selectedCaseListKey = scope.reportDetails.bclKey;
            scope.selectedCaseListName = scope.reportDetails.bclDisplayName;
            scope.defaultTemplateName = scope.reportDetails.reportTypeName;
            scope.fnGetDataFromFactory();
            }else{
            scope.fnLoadDataFromBackend();
          }
        }else if(scope.stateParams.key){
          scope.fnLoadDataFromBackend();
        }
    }
    if(stateParams.isFromCaselist){
      scope.showLeftPanel = false;
      scope.selectedCaseListKey = stateParams.caseListKey;
      scope.prevStateData=stateParams.prevStateData;
      scope.selectedCaseListName = '';
      scope.loadDefaultTemplates=false;
      scope.isFromCaselist = true;
      scope.fnGetCaselistMetadata();
      scope.initialPayload=angular.copy(scope.fnGetPayload());
    }
    };
    scope.$on('$destroy', function(){
      $('body').css('overflow','auto');
    });
    scope.fnInit();
  }]);
