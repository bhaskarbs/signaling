'use strict';

angular.module('saintApp')
  .controller('ReportsLibraryController', ['$timeout','$stateParams', 'ReportFactory', 'PreferencesFactory', '$scope', 'ConstantService', '$state', 'DateService', 'UrlService', 'loaderService', 'ReportStatusFactory', 'ReportRunFactory', 'LanguageService', 'alertService', 'UserService',
    function ($timeout,$stateParams, ReportFactory, PreferencesFactory, $scope, ConstantService, $state, DateService, UrlService, loaderService, ReportStatusFactory, ReportRunFactory, LanguageService, alertService, UserService) {
      $scope.reportServiceData = ReportFactory.data;
      $scope.reportPanelDetails = {
        reportDetails: null
      };
      $scope.isFromUpdate=false;
      $scope.isFromModeUpdate=false;
      $scope.fnInit = function () {
        loaderService.start();
        $scope.milestoneEnable=false;
        $scope.finaltoInprogressComments = '';
        $scope.currentStatusMenu = null;
        $scope.showFilterPanel = true;
        $scope.showTilePanel = true;
        $scope.showReportPanel = false;
        $scope.extendReportPanel = false;
        $scope.showReportLeftIcons = false;
        $scope.topNavHeadingIcon = 0;
        $scope.buttonSecTop = false;
        $scope.buttonSecBottom = false;
        $scope.currentTab = $state.current.name;
        $scope.showGanttPanel = true;
        $scope.showDateSubmitted = false;
        $scope.statusFilterPanel=true;
        $scope.isCollapseEnable=true;

        //fn-init for report-panel
        $scope.isStatusChangedOn = false;
        $scope.tempReportId = null;
        $scope.extendedSummary = false;
        $scope.isCompletedToInProgress = false;
        $scope.inProgressToIsCompleted = false;
        $scope.milestoneStatusSave=[];
        $scope.finaltoInprogressComments = '';
        if($state.current.name===ConstantService.STATE.REPORT_EXPANDED_VIEW)
        {
          $scope.previousState=ConstantService.EMPTY_STRING;
          $scope.currentTab=ConstantService.STATE.REPORT_LIBRARY_LIST;
        }
        else
        {
          $scope.previousState=$state.current.name;
        }
      };
      $scope.$watchCollection(function(){
        return $state.params;
      }, function(){
        if ($state.current.name === ConstantService.STATE.REPORT_EXPANDED_VIEW) {
          if($scope.previousState) {
            $scope.currentTab = $scope.previousState;
          }else{
            $scope.currentTab = ConstantService.STATE.REPORT_LIBRARY_LIST;

          }
        }
            if($state.params.id)
        {
          $scope.fnExtendReportPanel();
          $scope.fnRefreshReportDetails($state.params.id);
          $scope.isCollapseEnable=false;
        }
      });
      $scope.navigateToReportById= function(reportKey, previousState){
        $scope.statusFilterPanel=$scope.showFilterPanel;
        $scope.currentTab = previousState;
        $scope.previousState = previousState;
        $scope.isCollapseEnable= false;
        $state.go(ConstantService.STATE.REPORT_EXPANDED_VIEW ,{id:reportKey});
        $scope.fnExtendReportPanel();
        $scope.showFilterPanel=true;
        $scope.fnRefreshReportDetails(reportKey);
      };
      $scope.fnToggleFilterPanel = function () {
        $scope.showFilterPanel = !$scope.showFilterPanel;
        $scope.statusFilterPanel=$scope.showFilterPanel;
      };
      $scope.fnToggleReportPanel = function () {
        $scope.showReportPanel = !$scope.showReportPanel;
      };
      $scope.fnShowReportPanel = function () {
        $scope.showReportLeftIcons = true;
        $scope.showReportPanel = true;
      };
      $scope.fnShowReportPanelBack = function () {
        $scope.showTilePanel = true;
        $scope.showFilterPanel=$scope.statusFilterPanel;
        $scope.fnShowReportPanel();
        $scope.buttonSecBottom = true;
      };
      $scope.fnExtendReportPanel = function () {
        $scope.buttonSecTop = true;
        $scope.buttonSecBottom = false;
        $scope.showReportLeftIcons = false;
        $scope.topNavHeadingIcon = 1;
        $scope.showFilterPanel = false;
        $scope.showReportPanel = true;
        $scope.showReportLeftIcons = false;
        $scope.showTilePanel = false;
      };
      $scope.fnHideReportPanel = function (callType) {
        $scope.buttonSecTop = false;
        $scope.buttonSecBottom = true;
        $scope.showTilePanel = true;
        $scope.showReportPanel = false;
        if (callType !== 'auto') {
          $scope.fnPersistReportPanelState(ConstantService.HIDDEN);
        }
      };
      $scope.fnCallEditReport = function (selectedReport) {
        $scope.$broadcast('callEditReportEvent', selectedReport);
      };
      function fnPostProcessingPersistedDataReceived() {
        ReportFactory.syncSharedObjectWithPersistedData();

        //Trigger all the initialization functions manually
        $scope.fnSetPageComponentState();
        ReportFactory.data.watchInitialization=true;
      }

      $scope.fnSetPageComponentState = function () {
        $scope.fnSetReportPanelState();
      };

      $scope.fngetPersistedUserData = function () {

        if (ReportFactory.data.persistedData.length > 0) { // Persisted Data Already Fetched
          fnPostProcessingPersistedDataReceived();
        } else {
          PreferencesFactory.getUserPreferencedData(ConstantService.MANAGE_REPORTS_SCREEN, function (data) {
            ReportFactory.data.persistedData = data;
          }).then(
            function (result) {
              if (!result.error) {
                fnPostProcessingPersistedDataReceived();
              }
            }
          );
        }
      };
      $('#reportsLibrary').on('click',function () {
        $('.dsui-milestone-popover-summary').hide();
        $('.dsui-milestone-popover').hide();});
      $( window ).scroll(function() {
        $('.dsui-milestone-popover-summary').hide();
        $('.dsui-milestone-popover').hide();
      });
      $scope.$on(ConstantService.MANAGE_REPORTS_SCREEN + '_' + ConstantService.GET_USER_PREFERENCE, function () {
        ReportFactory.bPersist = (parseInt($state.params.persist) !== ConstantService.FALSE_INTEGER);
        if (ReportFactory.bPersist) {
          $scope.fngetPersistedUserData();
        } else {
          var filters = ReportFactory.extractFilterObject($state.params);
          ReportFactory.data.selectedFilters = angular.copy(filters);
          ReportFactory.data.reportSort = {
            'sortedBy': ConstantService.REPORT_LIBRARY_DEFAULT_SORT_KEY,
            'sortedByName': ConstantService.REPORT_LIBRARY_DEFAULT_SORT_NAME,
            'sortOrder': ConstantService.ASCENDING,
            'secondarySort': ConstantService.DB_KEY_REPORT_TYPE + ',' + ConstantService.DB_KEY_DUE_DAYS

          };
          $scope.fnCallRefreshReportTiles();
          ReportFactory.data.watchInitialization=true;
          $scope.$broadcast(ConstantService.MANAGE_REPORTS_SCREEN + '_INIT_WATCHERS');
        }
      });
      $scope.fnCallRefreshReportTiles = function () {
        $scope.$broadcast('MANAGE_REPORT_TILES_INIT');
      };
      $scope.fnChangeTab = function (statename) {
        if($state.current.name === ConstantService.STATE.REPORT_EXPANDED_VIEW){
          $scope.showFilterPanel=true;
        }
        $scope.previousState=statename;
        $scope.currentTab = statename;
        $scope.isCollapseEnable = true;
        $state.go(statename,null, {reload: false});
      };

      $scope.fnSetReportPanelState = function () {
        if (ReportFactory.data.reportPanelState === ConstantService.EXPANDED && ReportFactory.data.selectedTileId) {
          $scope.fnShowReportPanel();
          $scope.fnExtendReportPanel();
        }
      };


      //Reports Tiles Controller Content Starts Here

      $scope.fnCallRefreshGanttRows=function(){
        $scope.$broadcast('RefreshGanttRows');
      };
      $scope.fnToggleReportPanel = function (value) {
        var elmnt = document.getElementById('spied-panel');
        elmnt.scrollTop = 0;
        if (value) {
          $scope.statusFilterPanel=$scope.showFilterPanel;
          $scope.fnExtendReportPanel();ReportFactory.data.reportPanelState = ConstantService.EXPANDED;
          $scope.fnPersistReportPanelState(ConstantService.EXPANDED);
        } else {
          $scope.fnShowReportPanelBack();
          $scope.fnPersistReportPanelState(ConstantService.HIDDEN);
        }
      };

      $scope.fnExpandReportPanelFromModal=function(reportKey){
          $scope.navigateToReportById(reportKey,$scope.previousState);
      };
      /**
       * Persist the HIDDEN state of report panel
       */
      $scope.fnPersistReportPanelState = function (state) {
        ReportFactory.data.reportPanelState = state;
        ReportFactory.persistPreference('REPORT_PANEL_STATE', state, null, ConstantService.SESSION_BASED);
        ReportFactory.persistPreference('CURR_REPORT_ID', ReportFactory.data.selectedTileId, null, ConstantService.SESSION_BASED);
      };

      $scope.fnGetDateForPanel = function (dateInMilli) {
        return DateService.getFormattedDateStringFromDateObject(dateInMilli);
      };

      $scope.fnRemoveFilters=function(filters){
        $scope.$broadcast('ClearFilters',filters);
      };
      $scope.fnRefreshReportDetails = function (reportId) {
        if (reportId !== null) {
          var elmnt = document.getElementById('spied-panel');
          if(elmnt) {
            elmnt.scrollTop = 0;
          }
          $scope.isStatusChangedOn = false;
          $scope.reportId = reportId;
          $scope.fnGetReportStatus();
          $scope.fnGetReportDetails(reportId);
        }
      };
      $scope.fnCallRefreshReportDetails=function(){
        $scope.fnRefreshReportDetails($scope.reportServiceData.selectedTileId);
      };
      $scope.$watch('reportServiceData.selectedTileId', function (value) {
        if(value!==null) {
          $scope.fnRefreshReportDetails(value);
        }
      });
      $scope.fnGetBlindedList = function () {
        $scope.blindedList = [{'id': ConstantService.BLINDED_KEY, 'value': ConstantService.REPORT_BLINDED}, {
          'id': ConstantService.UNBLINDED_KEY,
          'value': ConstantService.REPORT_UNBLINDED
        }];
        $scope.isStatus = false;
      };
      $scope.fnGetReportStatus = function () {
        ReportStatusFactory.getReportStatus().then(function (reportStatusObj) {
          if (reportStatusObj.data) {
            var statusList  = _.without(reportStatusObj.data.status, _.findWhere(reportStatusObj.data.status, {id: 1}));//,[$scope.indicator]];
            $scope.statusList = _.map(statusList, function(element) {
              if(element.value === ConstantService.OPEN){
                return _.extend({}, element, {colorIndicator: 'dsui-open'});
              } else if(element.value === ConstantService.REPORT_STATUS_IN_PROGRESS){
                return _.extend({}, element, {colorIndicator: 'dsui-inprogress'});
              } else if(element.value === ConstantService.COMPLETED){
                return _.extend({}, element, {colorIndicator: 'dsui-completed'});
              }
            });
            $scope.isStatus = true;
          } else {
            alertService.error(LanguageService.MESSAGES.FAILED_TO_GET_STATUS_LIST);
          }
        });
      };

      $scope.fnMarkMilestoneComplete=function(){
        var url = UrlService.getService('REPORT_MILESTONE_SAVE');
        ReportFactory.fnmilestoneUpdate($scope.milestoneStatusSave,url).then(function () {
          alertService.success(LanguageService.MESSAGES.MILESTONE_SAVED_SUCCESS);
          $scope.fnGetReportDetails(ReportFactory.data.selectedTileId);
        }).catch(function () {
          alertService.warn(LanguageService.MESSAGES.FAILED_TO_SAVE_MILESTONE_STATUS);
        });
      };
      $scope.fnCancelMilestone=function(){
      $scope.tempMilestoneStatus[$scope.selectedMilestoneIndex]=false;
      $scope.reportPanelDetails.reportDetails.reportMilestones[$scope.selectedMilestoneIndex].milestoneCompletionDate=null;
      };
      $scope.fnMilestoneChange = function (reportKey, milestones, milestoneStatus,index) {
        var validation=false;
        var completionDate;
        milestoneStatus=milestoneStatus===true?1:0;
        if (milestoneStatus === 1 && milestones.milestoneStatus === 0) {
          if (!milestones.milestoneCompletionDate) {
            completionDate=new Date();
          }
          else
          {
            completionDate = new Date(milestones.milestoneCompletionDate);
          }
          validation=true;
          $scope.milestoneStatusSave =
            [{
              'MILESTONE_KEY': milestones.milestoneKey,
              'MILESTONE_NAME': milestones.milestoneName,
              'MILESTONE_DAYS': milestones.reportMilestoneDays,
              'MILESTONE_DATE': null,
              'MILESTONE_STATUS': milestoneStatus,
              'FK_RPT_KEY': milestones.milestoneForeignKey,
              'Audit.CreatedBy': milestones.milestoneCreatedBy,
              'Audit.CreatedDt': null,
              'Audit.UpdatedBy': milestones.milestoneUpdatedBy,
              'Audit.UpdatedDt': null,
              'MS_COMPLETION_DATE': DateService.getMillisecondsInUTCTimeZone(completionDate)
            }];
        }
        if(validation){
          $scope.selectedMilestoneIndex=index;
          angular.element('#milestone-modal').modal({backdrop: 'static', keyboard: false});
        }
        else {
          alertService.warn(LanguageService.MESSAGES.FAILED_TO_SAVE_MILESTONE_DETAILS_GANTT_CHART);
        }
      };
      //Disable the checkbox if the login user is not an assigned user for milestone
      $scope.fnMilestoneUserCheck = function (Milestones) {
        var userId = parseInt(UserService.data.oUser.userId);
        var groupId=UserService.data.oUser.groupKey;
        var enableCheckbox = false;
        for (var i = 0; i < Milestones.assignedUsers.length; i++) {
          if (userId === Milestones.assignedUsers[i].userKey) {
            enableCheckbox = true;
            break;
          }
        }
        for(var j=0;j<Milestones.assignedUserGroups.length;j++)
        {
          if(groupId.indexOf(JSON.stringify(Milestones.assignedUserGroups[j].roleId))>-1)
          {
            enableCheckbox=true;
            break;
          }
        }
        $scope.milestoneEnable=enableCheckbox;
      };
      $scope.fnDatepicker = function (index) {
        $('#datepicker' + index).datepicker({dateFormat: 'mm/dd/yy'});//Enabling the date picker
      };
      $scope.fnChangeReportProductsLength=function(){
        $scope.reportProductsLength =  !$scope.reportProductsLength;
      };
      $scope.fnChangeReportLicenseLength=function(){
        $scope.reportLicenseLength=!$scope.reportLicenseLength;
      };
      $scope.fnChangeReportDescriptionLength=function(){
        $scope.reportDescriptionLength=!$scope.reportDescriptionLength;
      };
      $scope.fnChangeReportIngredientLength=function(){
        $scope.reportIngredientLength=!$scope.reportIngredientLength;
      };
      $scope.fnChangeReportUserLength=function(){
        $scope.reportUserLength=!$scope.reportUserLength;
      };
      $scope.fnChangeReportUserGroupLength=function(){
        $scope.reportUserGroupLength=!$scope.reportUserGroupLength;
      };
      $scope.fnChangeAdditionalReportLength=function(){
        $scope.additionalReportLength=!$scope.additionalReportLength;
      };
      $scope.fnChangeReportMilestonesLength=function(){
        $scope.reportMilestonesLength=!$scope.reportMilestonesLength;
      };
      $scope.fnChangeReportCaseListDescriptionLength=function(){
        $scope.reportCaseListDescriptionLength=!$scope.reportCaseListDescriptionLength;
      };
      $scope.fnGetReportDetails = function (reportId) {
        var url = UrlService.getService('REPORT_PANEL_LIST');
        url += reportId;
        $scope.reportPanelDetails.reportDetails = null;
        $scope.additionalReorts = [];
        loaderService.start();
        ReportFactory.getReportInformation(url).then(function (result) {
          loaderService.stop();
          if (!result.error) {
            $scope.tempMilestoneStatus = [];
            $scope.reportDescriptionLength = false;
            $scope.reportIngredientLength = false;
            $scope.reportLicenseLength = false;
            $scope.reportUserGroupLength = false;
            $scope.additionalReportLength = false;
            $scope.reportUserLength = false;
            $scope.reportMilestonesLength = false;
            $scope.reportProductsLength = false;
            $scope.reportCaseListDescriptionLength=false;
            $scope.reportPanelDetails.reportDetails = result.data[0];
            $scope.reportPanelDetails.reportDetails.caseListDesc=$scope.reportPanelDetails.reportDetails.caseListDesc.trim();
            for (var i = 0; i < $scope.reportPanelDetails.reportDetails.reportMilestones.length; i++) {
              $scope.tempMilestoneStatus.push($scope.reportPanelDetails.reportDetails.reportMilestones[i].milestoneStatus === 1 ? true : false);
            }
            $scope.currentStatusMenu = {'id': 1, 'value': $scope.reportPanelDetails.reportDetails.reportStatus};
            $scope.currentStatus = $scope.reportPanelDetails.reportDetails.reportStatus;
            $scope.currentMode = $scope.reportPanelDetails.reportDetails.reportMode;
            var currentStatusKey = _.where($scope.statusList, {'value': $scope.currentStatus});
            $scope.statusKey = currentStatusKey[0].id;
            $scope.getStatusColorIndicator($scope.currentStatus);
            $scope.isBlinded = $scope.reportPanelDetails.reportDetails.isBlinded;
            $scope.reportType=$scope.reportPanelDetails.reportDetails.reportTypeName;
            if($scope.currentStatus===ConstantService.COMPLETED && $scope.currentMode===ConstantService.FINAL){
              $('#draftId').attr('disabled', true);
            }
            else{
              $('#draftId').attr('disabled', false);
            }

            if ($scope.reportId === $scope.tempReportId) {
              $scope.isStatusChangedOn = true;
            }
          }
          loaderService.stop();
          if($scope.isFromUpdate){
            alertService.success(LanguageService.MESSAGES.SUCCESS_UPDATE_STATUS);
            $scope.isFromUpdate=false;
          }
          if($scope.isFromModeUpdate){
            alertService.success(LanguageService.MESSAGES.SUCCESS_UPDATE_MODE);
            $scope.isFromModeUpdate=false;
          }
          if($scope.reportPanelDetails.reportDetails.additionalReports.subReports.length > 0){
           var tempObj = [];
             _.map($scope.reportPanelDetails.reportDetails.additionalReports.subReports, function (object) {
              if (object.isMainReport === 0){
                  tempObj = {
                  SRT_NAME: object.subReportName,
                    INSTANCE_ID :object.instanceId
                };
                $scope.additionalReorts.push(tempObj);
              }
              });
            $scope.additionalReorts=_.sortBy($scope.additionalReorts, function(object) { return object.INSTANCE_ID; });
          }
        });
      };
      $scope.updateStatus = function (value) {
        $scope.currentStatusMenu = null;
        $scope.changeStatus = value;
        $scope.isCompletedToInProgress = false;
        var statusValidationInd = $scope.statusValidation($scope.currentStatus, value,$scope.currentMode);
        var updateIndicator = 0;
        var statusKey = 0;
        var blindStatusKey = 0;
        _.each($scope.statusList, function (val) {
          if (val.value === value) {
            updateIndicator = 1;
            statusKey = val.id;
          }
        });
        _.each($scope.blindedList, function (val) {
          if (val.id === value) {
            updateIndicator = 0;
            blindStatusKey = val.id;
          }
        });
        $scope.changedStatusKey = statusKey;
        $scope.changedBlindedKey = blindStatusKey;
        $scope.updateIndicator = updateIndicator;

        if (statusValidationInd) {
          var reportKey = $scope.reportPanelDetails.reportDetails.reportKey;
          var statusPayload = ReportFactory.fnGeneratePayloadForStatusUpdate(reportKey);
          var payloadData = {};
          if (updateIndicator === 0) {
            payloadData =
            {
              'IS_BLINDED': value,
              'FK_STATUS_KEY': $scope.statusKey
            };
          } else if (updateIndicator === 1) {
            payloadData =
            {
              'FK_STATUS_KEY': statusKey,
              'IS_BLINDED': $scope.isBlinded
            };
          }
          statusPayload = angular.extend(statusPayload, payloadData);
          $scope.fnCallStatusChangeService(statusPayload, reportKey, $scope.changeStatus);
          $scope.currentStatus = value;
        } else if (($scope.isCompletedToInProgress === false)) {
          $scope.getStatusColorIndicator($scope.currentStatus);
          $scope.currentStatusMenu = {'id': 1, 'value': $scope.currentStatus};
        }
      };
      //function to save the comment for status change from final to inprogress
      $scope.fnCallAddReportCommentsService = function (statusPayload, reportKey) {
        loaderService.start();
        ReportFactory.addFinaltoInprogressComments(statusPayload, reportKey).then(function (updateReportStatusObj) {

          if (updateReportStatusObj.data === '') {
            $scope.finaltoInprogressComments = '';
          } else {
            $scope.finaltoInprogressComments = '';
            alertService.error(LanguageService.MESSAGES.FAILED_UPDATE_STATUS);
          }
        });
      };
      //function to update the status
      $scope.fnCallStatusChangeService = function (statusPayload, reportKey, changeStatus) {
        loaderService.start();
        var url = '';
        if (changeStatus === ConstantService.COMPLETED) {
          url = '/UpdateSubmittedDate';
        } else {
          url = '/ReportDetails';
        }
        ReportFactory.updateReportStatus(statusPayload, reportKey, url).then(function (updateReportStatusObj) {
          $scope.isFromUpdate=true;
          if (updateReportStatusObj) {
            $scope.fnRefreshReportDetails(reportKey);
          } else {
            loaderService.stop();
            alertService.error(LanguageService.MESSAGES.FAILED_UPDATE_STATUS);
          }
        });
      };
      $scope.getStatusColorIndicator = function (currentStatus) {
        $scope.statusColorIndicator = 'fa fa-circle';
        if (currentStatus === ConstantService.OPEN) {
          $scope.statusColorIndicator = $scope.statusColorIndicator + ' dsui-open';
        } else if (currentStatus === ConstantService.COMPLETED) {
          $scope.statusColorIndicator = $scope.statusColorIndicator + ' dsui-completed';
        }else if (currentStatus === ConstantService.REPORT_STATUS_IN_PROGRESS) {
          $scope.statusColorIndicator = $scope.statusColorIndicator + ' dsui-inprogress';
        }
      };

      $scope.fnOpenMilestonePopover = function ($index, milestone,e) {
        if ($('#milestonePopoverSummary' + milestone.milestoneKey).css('display') === 'none') {
          $scope.fnMilestoneUserCheck(milestone);
          var w=$(window);
          var left = e.pageX;
          var top = e.pageY;
          $('.dropdown-menu').css('left', (left-330) + 'px');
          $('.dropdown-menu').css('top', (top -25- w.scrollTop()) + 'px');
          $('.dsui-milestone-popover-summary').hide();
          $('#milestonePopoverSummary' + milestone.milestoneKey).show();
        }
        e.stopPropagation();
        e.preventDefault();
      };

      $scope.fnStatusChangeConfirmation = function (finaltoInprogressComments) {
        if (($scope.isCompletedToInProgress)) {
          var reportKey = $scope.reportPanelDetails.reportDetails.reportKey;
          var statusPayload = ReportFactory.fnGeneratePayloadForStatusUpdate(reportKey,finaltoInprogressComments);
          var payloadData = {};
          if ($scope.updateIndicator === 0) {
            payloadData =
            {
              'IS_BLINDED': $scope.changedBlindedKey,
              'FK_STATUS_KEY': $scope.statusKey
            };
          } else if ($scope.updateIndicator === 1) {
            payloadData =
            {
              'FK_STATUS_KEY': $scope.changedStatusKey,
              'IS_BLINDED': $scope.isBlinded
            };
          }
          statusPayload = angular.extend(statusPayload, payloadData);
          $scope.currentStatus = $scope.changeStatus;
          $scope.currentStatusMenu = {'id': 1, 'value': $scope.currentStatus};
          $scope.fnCallAddReportCommentsService(statusPayload, reportKey);
          $scope.fnCallStatusChangeService(statusPayload, reportKey);

        }
      };
      //Function to enter date submitted on changing from in-progress to completed
      $scope.fnStatusToCompleteConfirmation=function(){
        var reportKey = $scope.reportPanelDetails.reportDetails.reportKey;
        var dateSubmitted=null;
        if($scope.reportPanelDetails.reportDetails.submittedDate){
          var d1 = new Date($scope.reportPanelDetails.reportDetails.submittedDate);
          if (!isNaN(d1)) {
            dateSubmitted = DateService.getMillisecondsInUTCTimeZone(d1);
          }
        }else{
          var d = new Date();
          dateSubmitted = DateService.getMillisecondsInUTCTimeZone(d);
        }
        var statusPayload = ReportFactory.fnGeneratePayloadForStatusUpdate(reportKey,'',dateSubmitted );
        var payloadData = {};
        payloadData= {'FK_STATUS_KEY': $scope.changedStatusKey};
        statusPayload = angular.extend(statusPayload, payloadData);
        $scope.fnCallStatusChangeService(statusPayload, reportKey,$scope.changeStatus);
        $scope.currentStatus = $scope.changeStatus;
        $scope.fnCancel();
      };
      $scope.statusValidation = function (currentStatus, changeStatus,currentMode) {
        if ((changeStatus === ConstantService.OPEN) && (currentStatus === ConstantService.REPORT_STATUS_IN_PROGRESS)) {
          alertService.error(LanguageService.MESSAGES.STATUS_FROM_INPROGRESS_TO_OPEN);
          return false;
        }
        else if((currentStatus === ConstantService.OPEN)&&(changeStatus === ConstantService.COMPLETED)){
          alertService.error(LanguageService.MESSAGES.STATUS_FROM_OPEN_TO_COMPLETE);
          return false;
        }
        else if ((currentStatus === ConstantService.COMPLETED) && (changeStatus === ConstantService.REPORT_STATUS_IN_PROGRESS)) {
          angular.element('#finalToInprogress').modal({backdrop: 'static', keyboard: false});
          $scope.isCompletedToInProgress = true;
          $scope.tempReportId = $scope.reportId;
          return false;
        }
        else if ((currentStatus === ConstantService.COMPLETED) && (changeStatus === ConstantService.OPEN)) {
          alertService.error(LanguageService.MESSAGES.STATUS_FROM_COMPLETED_TO_OPEN);
          return false;}
        else if((currentStatus === ConstantService.REPORT_STATUS_IN_PROGRESS)&&(changeStatus === ConstantService.COMPLETED) &&(currentMode === ConstantService.DRAFT)){
          alertService.error(LanguageService.MESSAGES.STATUS_TO_COMPLETE_IN_DRAFT_MODE);
          return false;
        }
        else if((currentStatus === ConstantService.REPORT_STATUS_IN_PROGRESS)&&(changeStatus === ConstantService.COMPLETED) &&(currentMode === ConstantService.FINAL)){
          $scope.showDateSubmitted = true;
          $scope.inProgressToIsCompleted=true;
          $scope.getTodayDate();
          return false;
        }
        return true;
      };

      //Function to close the expanded report summary page and refresh the reports library
      $scope.fnCloseExpandedSummaryView = function () {
        $scope.fnPersistReportPanelState(ConstantService.HIDDEN);
        $scope.reportDescriptionLength = false;
        $scope.reportIngredientLength = false;
        $scope.reportLicenseLength = false;
        $scope.reportUserGroupLength = false;
        $scope.additionalReportLength = false;
        $scope.reportUserLength = false;
        $scope.reportMilestonesLength = false;
        $scope.reportProductsLength = false;
        $scope.reportCaseListDescriptionLength=false;
        $scope.currentTab = $state.current.name;
        if ($state.current.name === ConstantService.STATE.REPORT_EXPANDED_VIEW) {
          $scope.showReportPanel=false;
          $scope.showFilterPanel=$scope.statusFilterPanel;
          if($scope.previousState){
            $scope.showTilePanel=true;
            $scope.currentTab=$scope.previousState;
            $scope.fnNavigate($scope.previousState);
          }else{
            $scope.fnNavigate(ConstantService.STATE.REPORT_LIBRARY_LIST);
            $scope.currentTab=ConstantService.STATE.REPORT_LIBRARY_LIST;
          }
        }
        else
        {
           $scope.showReportPanel=false;
           $scope.showTilePanel=true;
          $scope.fnCallRefreshReportTiles();
          $scope.showFilterPanel = $scope.statusFilterPanel;
        }
        $scope.isCollapseEnable = true;
      };
      $scope.fnManageCaseList = function () {
        if($scope.currentStatus===ConstantService.OPEN){
          $scope.updateStatus(ConstantService.REPORT_STATUS_IN_PROGRESS);
        }
        $state.go(ConstantService.STATE.CASE_LIST_VISUALS_STATE, {
          id: $scope.reportPanelDetails.reportDetails.baseCaseListKey,
          page: ConstantService.PAGE_NAVIGATION_REPORT,
          pageMode: ConstantService.EDIT_MODE
        });
      };
      $scope.fnInit();
       $scope.$on('$destroy', function(){
       $('body').css('overflow','auto');
       });
      //Function to make service call for mode update
      $scope.updateMode = function(value){
        $scope.changeMode = value;
          var reportKey = $scope.reportPanelDetails.reportDetails.reportKey;
          var modePayload = ReportFactory.fnGeneratePayloadForModeUpdate(reportKey, value);
          $scope.fnCallModeUpdateService(modePayload, reportKey);
      };
      //Function to change mode from draft to final and vice versa
      $scope.fnCallModeUpdateService=function(payload,reportKey){
        loaderService.start();
        ReportFactory.updateReportMode(payload,reportKey).then(function (updateReportModeObj) {
          $scope.isFromModeUpdate=true;
          if (updateReportModeObj) {
            $scope.fnRefreshReportDetails(reportKey);
          } else {
            loaderService.stop();
            alertService.error(LanguageService.MESSAGES.FAILED_UPDATE_MODE);
          }
        });
      };
      $scope.fnOpenDatePicker=function(id){
        angular.element(id).datepicker('show');
      };
      //Function to close date submitted popover
      $scope.fnCancel=function(){
        $scope.showDateSubmitted=false;
      };
      /*Function to handle closing of notification popup*/
      $scope.fnCloseNotification=function(){
        $scope.isStatusChangedOn=false;
        $scope.tempReportId='';
      };
      /* Function to display default date in submitted date datepicker */
      $scope.getTodayDate=function(){
        var temp = $scope.reportPanelDetails.reportDetails;
        if(temp.submittedDate)
        {
          var d1 = new Date(temp.submittedDate);
          if (d1)
          {
            temp.submittedDate= DateService.getFormattedDateStringFromDateObject(d1);
          }
        }
        else{
          var d = new Date();
          temp.submittedDate=DateService.getFormattedDateStringFromDateObject(d);
        }
      };
    }]);
