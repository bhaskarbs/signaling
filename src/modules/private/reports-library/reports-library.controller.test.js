'use strict';
describe('ReportsLibraryController Controller',function(){
  var ctrl,$q,timeout, $stateParams, ReportFactory, PreferencesFactory, scope, ConstantService, $state, DateService, UrlService, loaderService, ReportStatusFactory, ReportRunFactory, LanguageService, alertService, UserService;
  var result = {'status':[{'id':1,'value':'Overdue'},{'id':2,'value':'Open'},{'id':3,'value':'In Progress'},{'id':4,'value':'Completed'}]};
  var statusPayload = {'RPT_KEY':93,'RPT_NAME':'','DESCRIPTION':'','IS_BLINDED':1,'SUBMITTED_DATE':'/Date(1454288218000)/','FK_RPT_TYPE_KEY':null,'FK_STATUS_KEY':3,'FK_BCL_KEY':0,'FK_SCL_KEY':null,'COMMENTS':'Comments','Audit.CreatedBy':'','Audit.CreatedDt':'/Date(1453887956000)/','Audit.UpdatedBy':'','Audit.UpdatedDt':'/Date(1454288218000)/'};
  var reportKey = 46;
  var value='In Progress';

  beforeEach(function(){
    module('saintApp');
    inject(function($injector,$controller,$rootScope){
      timeout = $injector.get('$timeout');
      $q = $injector.get('$q');
      $stateParams=$injector.get('$stateParams');
      ReportFactory=$injector.get('ReportFactory');
      PreferencesFactory=$injector.get('PreferencesFactory');
      scope = $rootScope.$new();
      ConstantService = $injector.get('ConstantService');
      $state = $injector.get('$state');
      DateService = $injector.get('DateService');
      UrlService = $injector.get('UrlService');
      loaderService = $injector.get('loaderService');
      ReportStatusFactory = $injector.get('ReportStatusFactory');
      ReportRunFactory = $injector.get('ReportRunFactory');
      LanguageService = $injector.get('LanguageService');
      alertService = $injector.get('alertService');
      UserService = $injector.get('UserService');
      ctrl = $controller('ReportsLibraryController',{
        $scope: scope,
        $timeout: timeout,
        ReportFactory:ReportFactory,
        PreferencesFactory:PreferencesFactory,
        ConstantService:ConstantService,
        DateService:DateService,
        UrlService:UrlService,
        loaderService:loaderService,
        ReportStatusFactory:ReportStatusFactory,
        ReportRunFactory:ReportRunFactory,
        LanguageService:LanguageService,
        alertService:alertService,
        UserService:UserService
      });
      scope.reportPanelDetails.reportDetails = {'reportKey':46,'submittedDate':'/Date(1454288218000)/'};
    });
  });

  it('should exists',function(){
    expect(ctrl).toBeDefined();
  });

  it('Should have configs defined in it',function(){
    expect(scope.reportServiceData).toBeDefined();
    expect(scope.reportPanelDetails).toBeDefined();
    expect(scope.isFromUpdate).toBeDefined();
    expect(scope.isFromModeUpdate).toBeDefined();
    expect(scope.milestoneEnable).toBeDefined();
    expect(scope.finaltoInprogressComments).toBeDefined();
    expect(scope.currentStatusMenu).toBeDefined();
    expect(scope.showFilterPanel).toBeDefined();
    expect(scope.showTilePanel).toBeDefined();
    expect(scope.showReportPanel).toBeDefined();
    expect(scope.extendReportPanel).toBeDefined();
    expect(scope.showReportLeftIcons).toBeDefined();
    expect(scope.topNavHeadingIcon).toBeDefined();
    expect(scope.buttonSecTop).toBeDefined();
    expect(scope.buttonSecBottom).toBeDefined();
    expect(scope.currentTab).toBeDefined();
    expect(scope.showGanttPanel).toBeDefined();
    expect(scope.showDateSubmitted).toBeDefined();
    expect(scope.statusFilterPanel).toBeDefined();
    expect(scope.isCollapseEnable).toBeDefined();
    expect(scope.isStatusChangedOn).toBeDefined();
    expect(scope.tempReportId).toBeDefined();
    expect(scope.extendedSummary).toBeDefined();
    expect(scope.isCompletedToInProgress).toBeDefined();
    expect(scope.inProgressToIsCompleted).toBeDefined();
    expect(scope.milestoneStatusSave).toBeDefined();
    expect(scope.finaltoInprogressComments).toBeDefined();
    expect(scope.previousState).toBeDefined();
  });

  it('Should have Methods defined in it',function(){
    expect(scope.navigateToReportById).toBeDefined();
    expect(scope.fnToggleFilterPanel).toBeDefined();
    expect(scope.fnToggleReportPanel).toBeDefined();
    expect(scope.fnShowReportPanel).toBeDefined();
    expect(scope.fnShowReportPanelBack).toBeDefined();
    expect(scope.fnExtendReportPanel).toBeDefined();
    expect(scope.fnHideReportPanel).toBeDefined();
    expect(scope.fnCallEditReport).toBeDefined();
    expect(scope.fnSetPageComponentState).toBeDefined();
    expect(scope.fngetPersistedUserData).toBeDefined();
    expect(scope.fnCallRefreshReportTiles).toBeDefined();
    expect(scope.fnChangeTab).toBeDefined();
    expect(scope.fnSetReportPanelState).toBeDefined();
    expect(scope.fnCallRefreshGanttRows).toBeDefined();
    expect(scope.fnExpandReportPanelFromModal).toBeDefined();
    expect(scope.fnPersistReportPanelState).toBeDefined();
    expect(scope.fnGetDateForPanel).toBeDefined();
    expect(scope.fnRemoveFilters).toBeDefined();
    expect(scope.fnRefreshReportDetails).toBeDefined();
    expect(scope.fnCallRefreshReportDetails).toBeDefined();
    expect(scope.fnGetBlindedList).toBeDefined();
    expect(scope.fnGetReportStatus).toBeDefined();
    expect(scope.fnMarkMilestoneComplete).toBeDefined();
    expect(scope.fnCancelMilestone).toBeDefined();
    expect(scope.fnMilestoneChange).toBeDefined();
    expect(scope.fnMilestoneUserCheck).toBeDefined();
    expect(scope.fnDatepicker).toBeDefined();
    expect(scope.fnChangeReportProductsLength).toBeDefined();
    expect(scope.fnChangeReportLicenseLength).toBeDefined();
    expect(scope.fnChangeReportDescriptionLength).toBeDefined();
    expect(scope.fnChangeReportIngredientLength).toBeDefined();
    expect(scope.fnChangeReportUserLength).toBeDefined();
    expect(scope.fnChangeReportUserGroupLength).toBeDefined();
    expect(scope.fnChangeAdditionalReportLength).toBeDefined();
    expect(scope.fnChangeReportMilestonesLength).toBeDefined();
    expect(scope.fnChangeReportCaseListDescriptionLength).toBeDefined();
    expect(scope.fnGetReportDetails).toBeDefined();
    expect(scope.updateStatus).toBeDefined();
    expect(scope.fnCallAddReportCommentsService).toBeDefined();
    expect(scope.fnCallStatusChangeService).toBeDefined();
    expect(scope.getStatusColorIndicator).toBeDefined();
    expect(scope.fnOpenMilestonePopover).toBeDefined();
    expect(scope.fnStatusChangeConfirmation).toBeDefined();
    expect(scope.fnStatusToCompleteConfirmation).toBeDefined();
    expect(scope.statusValidation).toBeDefined();
    expect(scope.fnCloseExpandedSummaryView).toBeDefined();
    expect(scope.fnManageCaseList).toBeDefined();
    expect(scope.updateMode).toBeDefined();
    expect(scope.fnCallModeUpdateService).toBeDefined();
    expect(scope.fnOpenDatePicker).toBeDefined();
    expect(scope.fnCancel).toBeDefined();
    expect(scope.fnCloseNotification).toBeDefined();
    expect(scope.getTodayDate).toBeDefined();
  });

  it('Should call fnToggleFilterPanel()', function(){
    scope.fnToggleFilterPanel();
  });
  it('Should call fnShowReportPanel()', function(){
    scope.fnShowReportPanel();
  });
  it('Should call fnShowReportPanelBack()', function(){
    scope.fnShowReportPanelBack();
  });
  it('Should call fnExtendReportPanel()', function(){
    scope.fnExtendReportPanel();
  });
  it('Should call fnHideReportPanel()', function(){
    scope.fnHideReportPanel();
  });
  it('Should call fnCallEditReport()', function(){
    scope.fnCallEditReport();
  });
  it('Should call fnSetPageComponentState()', function(){
    scope.fnSetPageComponentState();
  });
  it('Should call fngetPersistedUserData()', function(){
    scope.fngetPersistedUserData();
  });
  it('Should call fnCallRefreshReportTiles()', function(){
    scope.fnCallRefreshReportTiles();
  });
  it('Should call fnSetReportPanelState()', function(){
    ReportFactory.data.reportPanelState = 'EXPANDED';
    ReportFactory.data.selectedTileId = 227;
    scope.fnSetReportPanelState();
  });
  it('Should call fnCallRefreshGanttRows()', function(){
    scope.fnCallRefreshGanttRows();
  });

  it('Should call fnPersistReportPanelState()', function(){
    scope.fnPersistReportPanelState();
  });
  it('Should call fnGetDateForPanel()', function(){
    scope.fnGetDateForPanel('/Date(1468734955000)/');
  });
  it('Should call fnRemoveFilters()', function(){
    scope.fnRemoveFilters();
  });
  it('Should call fnRefreshReportDetails()', function(){
    scope.fnRefreshReportDetails(232);
  });
  it('Should call fnCallRefreshReportDetails()', function(){
    scope.fnCallRefreshReportDetails();
  });
  it('Should call fnGetBlindedList()', function(){
    scope.fnGetBlindedList();
  });

  it('Should call updateStatus()', function(){
    scope.blindedList = [{'id': 1, 'value': 'Blinded'}, {'id': 2,'value': 'Unblinded'}];
    scope.statusList = [{'id':2,'value':'Open','colorIndicator':'dsui-open'},{'id':3,'value':'In Progress','colorIndicator':'dsui-inprogress'},{'id':4,'value':'Completed','colorIndicator':'dsui-completed'}];
    scope.updateStatus(value);
    var value2=1;
    scope.updateStatus(value2);
  });

  it('Should call fnGetReportStatus()', function(){
    spyOn(ReportStatusFactory,'getReportStatus').and.callFake(function(){
      return $q.when(result);
    });
    scope.fnGetReportStatus();
    scope.$digest();
    var open = [{id:3,value: 'Open'}];
    scope.fnGetReportStatus(open.value);
    var inProgress = [{id:3,value: 'In Progress'}];
    scope.fnGetReportStatus(inProgress.value);
    var completed = [{id:3,value: 'Completed'}];
    scope.fnGetReportStatus(completed.value);
  });
  it('Should call fnMarkMilestoneComplete()', function(){
    spyOn(ReportFactory,'fnmilestoneUpdate').and.callFake(function(){
      return $q.when(result);
    });
    scope.fnMarkMilestoneComplete();
  });
  it('Should call fnMilestoneChange()', function(){
    var milestones = [{milestoneStatus:1}];
    scope.fnMilestoneChange(232,1,milestones.milestoneStatus,1);
    var milestones1 = [{milestoneStatus:0}];
    scope.fnMilestoneChange(232,0,milestones1.milestoneStatus,1);
  });
  it('Should call fnChangeReportProductsLength()', function(){
    scope.reportProductsLength = 3;
    scope.reportProductsLength = 4;
    scope.fnChangeReportProductsLength();
  });
  it('Should call fnChangeReportLicenseLength()', function(){
    scope.reportLicenseLength = 3;
    scope.reportLicenseLength = 5;
    scope.fnChangeReportLicenseLength();
  });
  it('Should call fnChangeReportDescriptionLength()', function(){
    scope.fnChangeReportDescriptionLength();
  });
  it('Should call fnChangeReportIngredientLength()', function(){
    scope.fnChangeReportIngredientLength();
  });
  it('Should call fnChangeReportUserLength()', function(){
    scope.fnChangeReportUserLength();
  });
  it('Should call fnChangeReportUserGroupLength()', function(){
    scope.fnChangeReportUserGroupLength();
  });
  it('Should call fnChangeAdditionalReportLength()', function(){
    scope.fnChangeAdditionalReportLength();
  });
  it('Should call fnChangeReportMilestonesLength()', function(){
    scope.fnChangeReportMilestonesLength();
  });
  it('Should call fnChangeReportCaseListDescriptionLength()', function(){
    scope.fnChangeReportCaseListDescriptionLength();
  });
  it('Should call fnGetReportDetails()', function(){
    spyOn(ReportFactory,'getReportInformation').and.callFake(function(){
      return $q.when(result);
    });
    scope.fnGetReportDetails(232);
  });
  it('Should call updateStatus()', function(){
    scope.updateStatus('Completed');
  });
  it('Should call fnCallAddReportCommentsService()', function(){
    spyOn(ReportFactory,'addFinaltoInprogressComments').and.callFake(function(){
      return $q.when(result);
    });
    scope.fnCallAddReportCommentsService(statusPayload,reportKey);
    scope.$digest();
  });

  it('Should call fnCallStatusChangeService()', function(){
    scope.fnCallStatusChangeService();
  });

  it('Should call getStatusColorIndicator()', function(){
    var value1='Open';
    scope.getStatusColorIndicator(value1);
    var value2='In Progress';
    scope.getStatusColorIndicator(value2);
    var value3='Completed';
    scope.getStatusColorIndicator(value3);
  });
  it('Should call fnStatusChangeConfirmation()', function(){
    var comments = 'Comments';
    scope.isCompletedToInProgress=true;
    scope.updateIndicator=0;
    scope.fnStatusChangeConfirmation(comments);
    scope.updateIndicator=1;
    scope.fnStatusChangeConfirmation(comments);
  });

  it('Should call fnStatusToCompleteConfirmation()', function(){
    scope.fnStatusToCompleteConfirmation();
    scope.reportPanelDetails.reportDetails.submittedDate='';
    scope.fnStatusToCompleteConfirmation();
  });

  it('Should call statusValidation()', function(){
    var currentStatus ='In Progress';
    var changeStatus = 'Open';
    var currentMode = 0;
    scope.statusValidation(currentStatus,changeStatus,currentMode);
    var currentStatus2 ='Open';
    var changeStatus2 = 'Completed';
    scope.statusValidation(currentStatus2,changeStatus2,currentMode);
    var currentStatus3 ='Completed';
    var changeStatus3 = 'In Progress';
    scope.statusValidation(currentStatus3,changeStatus3,currentMode);
    var currentStatus4 ='Completed';
    var changeStatus4 = 'Open';
    scope.statusValidation(currentStatus4,changeStatus4,currentMode);
    var currentStatus5 ='In Progress';
    var changeStatus5 = 'Completed';
    scope.statusValidation(currentStatus5,changeStatus5,currentMode);
    var currentMode2 = 1;
    scope.statusValidation(currentStatus5,changeStatus5,currentMode2);
    scope.statusValidation(currentStatus2,currentStatus,currentMode2);
  });
  it('Should call fnCloseExpandedSummaryView()', function(){
    scope.fnCloseExpandedSummaryView();
  });
  it('Should call updateMode()', function(){
    scope.updateMode(value);
  });

  it('Should call fnCallModeUpdateService()', function(){
    scope.fnCallModeUpdateService();
  });
  it('Should call fnCancel()', function(){
    scope.fnCancel();
  });
  it('Should call fnCloseNotification()', function(){
    scope.fnCloseNotification();
  });
  it('Should call getTodayDate()', function(){
    scope.getTodayDate();
  });
});
