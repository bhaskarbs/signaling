'use strict';

/**
 * This directive is used to create a dropdown which populates users/groups and also gives user to select
 * 'All Users'. Below is the description of the input parameters:
 * userSelectId: This uniquely identifies all the instances of the directive
 * isSelectAllShown: This tells directive whether the 'select all' will be shown or not
 * getSelectedUserGroup: Get all the user/group already selected in the directive and auto populates it
 * setSelectedUserGroup: Keeps track of all the user/groups selected by the directive
 * updateSelectAllUser: If 'Select All' will be shown, then this carries the boolean value
 * filterUserGroup: This filter the user/group shown in the dropdown
 * milestoneReportOwnerCase: This is special case where report owner should also be
 *                           shown in the dropdown for milestone selection

 */
angular.module('saintApp')
  .directive('userGroupSelectDropdown', ['UserService', 'UserGroupEntity', 'alertService', '$http', 'UrlService', 'LanguageService', '$timeout', 'loaderService', 'ConstantService', function (UserService, UserGroupEntity, alertService, $http, UrlService, LanguageService, $timeout, loaderService, ConstantService) {

    function formatUserGroupToEntity(usersGroupList) {
      var formattedUserGroupList = [];
      for (var i = 0; i < usersGroupList.length; i++) {
        var tempObject = angular.copy(UserGroupEntity);
        tempObject.userKey = parseInt(usersGroupList[i].USER_KEY);
        tempObject.userGroupKey = parseInt(usersGroupList[i].USER_GRP_KEY);
        tempObject.name = usersGroupList[i].NAME;
        tempObject.count = parseInt(usersGroupList[i].COUNT_CAL);
        tempObject.type = parseInt(usersGroupList[i].TYPE);
        tempObject.consolidatedGroup = usersGroupList[i].consolidatedGroup;
        formattedUserGroupList.push(tempObject);
      }
      return formattedUserGroupList;
    }

    function formatPreSelectedUserGroupToEntity(usersGroupList) {
      var formattedUserGroupList = [];
      for (var i = 0; i < usersGroupList.length; i++) {
        var tempObject = {};
        if(usersGroupList[i].IS_SHARED_RPT){
          tempObject.isSharedRpt = parseInt(usersGroupList[i].IS_SHARED_RPT);
        }
        tempObject.userKey = parseInt(usersGroupList[i].USER_ID);
        tempObject.userGroupKey = parseInt(usersGroupList[i].GROUP_ID);
        tempObject.name = usersGroupList[i].NAME;
        tempObject.type = parseInt(usersGroupList[i].OBJ_TYPE);
        formattedUserGroupList.push(tempObject);
      }
      return formattedUserGroupList;
    }

    return {
      scope: {
        'userSelectId': '=',
        'isSelectAllShown': '@',
        'getSelectedUserGroup': '=',
        'setSelectedUserGroup': '=',
        'updateSelectAllUser': '=',
        'filterUserGroup': '=',
        'milestoneReportOwnerCase': '=',
        'assigneeDisplayText': '='

      },
      // Restrict it to be an attribute in this case
      restrict: 'E',
      templateUrl: 'views/private/user/user-group-select.html',
      compile: function () {
        return function (scope) { //This is a link function

          scope.selectedUsersGroup = [];
          scope.milestoneUsers = [];
          scope.doCleanMilestoneUser = false;
          /**
           * Event handler for dropdown select
           */
          scope.selectChanged = function () {
            scope.doCleanMilestoneUser = true;
            scope.fnProcessStyling();
          };
          scope.defaultPlaceholderText = LanguageService.MESSAGES.ENTER_USER_GROUP_NAME;

          scope.$watch('includeAllUser', function (state) {
            // Do the processing only if select-all is passed
            if (scope.isSelectAllShown) {
              if (state) {
                scope.clearAll();
                scope.updateSelectAllUser = state;
              }
            }
          });

          /**
           * Clean all the selected user and group
           */
          scope.clearAll = function () {
            scope.selectedUsersGroup = [];
            scope.milestoneUsers = [];
            scope.fnProcessStyling();
          };

          /**
           * Group tab is expanded when clicked
           * @param optionId
           */
          scope.fnExpandGroupTag = function (optionId) {
            var groupSpecificUser = [];
            var userGroupId = scope.usersGroup[optionId].userGroupKey;
            for (var i = 0; i < scope.usersGroup.length; i++) {
              if (scope.usersGroup[i].consolidatedGroup.indexOf(userGroupId) !== -1) {
                groupSpecificUser.push(scope.usersGroup[i]);
              }
            }
            scope.selectedUsersGroup = scope.selectedUsersGroup.concat(groupSpecificUser);
            scope.selectedUsersGroup = _.without(scope.selectedUsersGroup, _.findWhere(scope.selectedUsersGroup,
              {'userGroupKey': userGroupId, 'type': ConstantService.GROUP_ENTITY}));
            scope.$digest(); //Solving slow rerendering issue in IE
          };

          /**
           * Select control maintain the uniqeness of entried by 'id' field
           * @param id
           * @returns {*}
           */
          scope.getUserGroupTypeFromDynamicId = function (id) {
            if (id) {
              return scope.usersGroup[id].type;
            } else {
              return -1;
            }
          };

          /**
           * Modify the skin of the tag according to the mockup requirement
           */
          scope.fnStyleUserGroupTag = function () {
            var selectUIdata = {};
            var selectChoice = $('#' + scope.userSelectId).find('.select2-choices');
            //Moving cross button to the right
            selectChoice.find('li').addClass('dsui-user-group-selected-list');
            selectChoice.find('a').removeClass('select2-search-choice-close');
            selectChoice.find('div').addClass('dsui-user-group-selected-list-text');
            selectChoice.addClass('dsui-user-group-selected-box'); // Set the height for 5 rows

            //Adding the group icon and event handler
            selectChoice.find('li').each(function () {
              selectUIdata = $(this).data('select2-data');
              if(selectUIdata) {
                if (scope.usersGroup[selectUIdata.id].isSharedRpt !== 1) {
                  $(this).find('a').addClass('dsui-user-group-selected-list-close icon-times-circle'); //adding the remove btn for non-report-assignees
                }
              }
              if (scope.getUserGroupTypeFromDynamicId(selectUIdata && selectUIdata.id) === ConstantService.GROUP_ENTITY) {
                if ($(this).find('.icon-group').length === 0) {
                  $(this).prepend('<span class="icon-group dsui-user-group-selected-list-group-icon"></span>');
                }
                $(this).find('div').text(scope.usersGroup[selectUIdata.id].name); // By default, removing count from display
                $(this).click({
                    selectUIdata: selectUIdata
                  },
                  function (event) {
                    scope.fnExpandGroupTag(event.data.selectUIdata.id);
                    $timeout(function () {
                      scope.fnProcessStyling(); //Works even in 1 millisecond
                    }, 50, false);
                  }
                );
              } // To avoid extra styling by the select control itself
              else if (scope.getUserGroupTypeFromDynamicId(selectUIdata && selectUIdata.id) === ConstantService.USER_ENTITY) {
                $(this).click(
                  function (event) {
                    event.stopImmediatePropagation();
                  }
                );
              }
            });
          };

          /**
           * Adding default placeholder for showing the text
           */
          scope.fnAddMoreUserText = function () {
            var text = (scope.selectedUsersGroup.length > 0) ?
            LanguageService.MESSAGES.ADD_MORE_USER + '...' : '';

            var base = $('#' + scope.userSelectId);
            var selectChoicesList = base.find('.select2-choices');
            var lastSelectedItem = selectChoicesList.find('li:last');
            var firstInput = lastSelectedItem.find('input:first');
            firstInput.prop('placeholder', text);
            if (scope.selectedUsersGroup.length > 0) {
              firstInput.addClass('dsui-add-more-user-placeholder');
              firstInput.removeClass('dsui-enter-user-group-name-placeholder');
            } else {
              firstInput.addClass('dsui-enter-user-group-name-placeholder');
              firstInput.removeClass('dsui-add-more-user-placeholder');
            }
          };

          /**
           * Apply the styling as per the mockup
           * @param timeInMillisecond
           */
          scope.fnProcessStyling = function (timeInMillisecond) {
            //Append Add More Users
            $timeout(function () {
              /**
               * FIXME This adding of placeholder will work in chrome
               */
              try {
                if (/chrome/.test(navigator.userAgent.toLowerCase())) {
                  scope.fnAddMoreUserText();
                }
              } catch (e) {
              }
              scope.fnStyleUserGroupTag();
            }, timeInMillisecond || 0, false);
          };


          scope.$watch('selectedUsersGroup', function (value) {
            scope.setSelectedUserGroup = value;
            if(scope.doCleanMilestoneUser) {
              //To keep a copy to repopulate the milestone user/group field when more users are selected from the report assignees user/group field
              scope.milestoneUsers = angular.copy(value);
              scope.doCleanMilestoneUser = false;
            }
          });

          scope.$watch('filterUserGroup', function (value) {
            if (value) {
              var userGroupInfo = UserService.data.userGroupInfo;
              if (userGroupInfo) {
                scope.prepareUserGroupSet(userGroupInfo.data);
              }
            }
          });
          scope.$watch('milestoneReportOwnerCase', function (value) {
            if (value) {
              var userGroupInfo = UserService.data.userGroupInfo;
              if (userGroupInfo) {
                scope.prepareUserGroupSet(userGroupInfo.data);
              }
            }
          });

          /**
           * Auto populate the UI control based on the value received from backend
           * @param userGroupDetail
           */
          scope.fnPrePopulateSelectedUser = function (userGroupDetail) {
            scope.selectedUsersGroup = [];

            for (var i = 0; i < userGroupDetail.length; i++) {
              for (var j = 0; j < scope.usersGroup.length; j++) {
                if (userGroupDetail[i].type === ConstantService.USER_ENTITY && userGroupDetail[i].userKey === scope.usersGroup[j].userKey) {
                  scope.usersGroup[j].isSharedRpt = userGroupDetail[i].isSharedRpt;
                  scope.selectedUsersGroup.push(scope.usersGroup[j]);
                  break;
                }
                else if (userGroupDetail[i].type === ConstantService.GROUP_ENTITY && userGroupDetail[i].userGroupKey === scope.usersGroup[j].userGroupKey) {
                  scope.usersGroup[j].isSharedRpt = userGroupDetail[i].isSharedRpt;
                  scope.selectedUsersGroup.push(scope.usersGroup[j]);
                  break;
                }
              }
            }
          };

          /**
           * restore the control state based on the persisted value
           * @param result
           */
          scope.fnRestoreSelectedUserState = function (allSelectedUser) {
            if (allSelectedUser && allSelectedUser.length) {
              scope.fnPrePopulateSelectedUser(allSelectedUser);
            }
            $timeout(function () { // Create Report rendering was too slow
              scope.fnProcessStyling();
            }, 50, false);
          };

          /**
           * get user and group related information
           */
          scope.getUserGroupInfo = function () {
            var userGroupInfo = UserService.data.userGroupInfo;
            if (userGroupInfo) {
              scope.prepareUserGroupSet(userGroupInfo.data);
            } else {
              loaderService.start();
              UserService.getUserGroupInfo().then(function (response) {
                loaderService.stop();
                if (!response.error) {
                  scope.prepareUserGroupSet(response.data);
                }
              });
            }
          };

          scope.prepareUserGroupSet = function (userGroupInfo) {
            var userGroups = userGroupInfo;
            var triggerMilestonePrepopulation = false;
            var userGroupIndex, milestoneUserGroupIndex;
            scope.temp = [];

            userGroups = formatUserGroupToEntity(userGroups);
            if (scope.filterUserGroup || scope.milestoneReportOwnerCase) { // User passed this parameter to directive
              userGroups = scope.applyUserGroupFilter(userGroups);
              triggerMilestonePrepopulation = true;
            }
            scope.usersGroup = userGroups;

            if (scope.isSelectAllShown === 'true') {
              scope.includeAllUser = scope.updateSelectAllUser; // Check Uncheck select all user
            }
            var allSelectedUser = scope.getAllSelectedUserGroup();
            //This check is specifically for Create/Edit Report check to decide and prepopulate the field based on the mode
            if (scope.getSelectedUserGroup) { //This check is specifically for Create/Edit Report check to decide and prepopulate the field based on the mode
              scope.fnRestoreSelectedUserState(allSelectedUser);
            }
            else {
              if(triggerMilestonePrepopulation === true){
                for(userGroupIndex = 0; userGroupIndex < scope.usersGroup.length; userGroupIndex++){
                  for(milestoneUserGroupIndex = 0; milestoneUserGroupIndex < scope.milestoneUsers.length; milestoneUserGroupIndex++){
                    if(scope.milestoneUsers[milestoneUserGroupIndex].userKey === scope.usersGroup[userGroupIndex].userKey && scope.milestoneUsers[milestoneUserGroupIndex].userGroupKey === scope.usersGroup[userGroupIndex].userGroupKey){
                      scope.temp.push(angular.copy(scope.milestoneUsers[milestoneUserGroupIndex]));
                    }
                  }
                  triggerMilestonePrepopulation = false;
                }
                scope.fnRestoreSelectedUserState(scope.temp);
              }
            }
          };

          scope.getAllSelectedUserGroup = function () {
            var preSelectedUserGroup = [];
            if (scope.getSelectedUserGroup) {
              preSelectedUserGroup = formatPreSelectedUserGroupToEntity(scope.getSelectedUserGroup);
            }
            return angular.copy(preSelectedUserGroup);
          };

          scope.getFilteredUserGroupData = function(userGroupInfo) {
            var userGroupFilteredData = [];
            var expandedUserGroupData = [];
            var userMatchFound = false;
            var filterInc, userGroupIndex, matchCheckIndex;
            for (filterInc = 0; filterInc < scope.filterUserGroup.length; filterInc++) {
              userMatchFound = false;
              //to check the existence of a user entity in the userGroupFilteredData
              if (scope.filterUserGroup[filterInc].type === ConstantService.USER_ENTITY) {
                for(matchCheckIndex = 0; matchCheckIndex < userGroupFilteredData.length; matchCheckIndex++ ){
                  if(userGroupFilteredData[matchCheckIndex].userKey === scope.filterUserGroup[filterInc].userKey){
                    userMatchFound = true;
                    break;
                  }
                }
                if(userMatchFound === false) {
                  for (userGroupIndex = 0; userGroupIndex < userGroupInfo.length; userGroupIndex++) {
                    if (userGroupInfo[userGroupIndex].userKey === scope.filterUserGroup[filterInc].userKey &&
                      userGroupInfo[userGroupIndex].userGroupKey === scope.filterUserGroup[filterInc].userGroupKey) {
                      userGroupFilteredData.push(userGroupInfo[userGroupIndex]);
                    }
                  }
                }
              }
              //to check the existence of a group entity in the userGroupFilteredData
              else if(scope.filterUserGroup[filterInc].type === ConstantService.GROUP_ENTITY){
                for(matchCheckIndex = 0; matchCheckIndex < userGroupInfo.length; matchCheckIndex++ ){
                  if(userGroupInfo[matchCheckIndex].userGroupKey === scope.filterUserGroup[filterInc].userGroupKey){
                    expandedUserGroupData.push(userGroupInfo[matchCheckIndex]);
                    break;
                  }
                }
                //to push the user entities which are part of that group
                for (userGroupIndex = 0; userGroupIndex < userGroupInfo.length; userGroupIndex++) {
                  if (userGroupInfo[userGroupIndex].type === ConstantService.USER_ENTITY) {
                    if (userGroupInfo[userGroupIndex].consolidatedGroup.indexOf(scope.filterUserGroup[filterInc].userGroupKey) !== -1) {
                      expandedUserGroupData.push(userGroupInfo[userGroupIndex]);
                    }
                  }
                }
              }
            }
            return {userGroupFilteredData: userGroupFilteredData, expandedUserGroupData: expandedUserGroupData};
          };

          scope.applyUserGroupFilter = function (userGroupInfo) {
            var flag = false;
            var userGroupIndex, matchCheckIndex, expandedUserGroupIndex;
            var userGroupData = scope.getFilteredUserGroupData(userGroupInfo);
            var userGroupFilteredData = userGroupData.userGroupFilteredData;
            var expandedUserGroupData = userGroupData.expandedUserGroupData;

            //to check the existence of a user entity in the userGroupFilteredData from the expandedUserGroupData
            for (expandedUserGroupIndex = 0; expandedUserGroupIndex < expandedUserGroupData.length; expandedUserGroupIndex++) {
              flag = false;
              for (userGroupIndex = 0; userGroupIndex < userGroupInfo.length; userGroupIndex++) {
                if (userGroupInfo[userGroupIndex].userKey === expandedUserGroupData[expandedUserGroupIndex].userKey &&
                  userGroupInfo[userGroupIndex].userGroupKey === expandedUserGroupData[expandedUserGroupIndex].userGroupKey) {
                  if(userGroupFilteredData.length > 0){
                    for (matchCheckIndex = 0; matchCheckIndex < userGroupFilteredData.length; matchCheckIndex++) {
                      if (userGroupFilteredData[matchCheckIndex].userKey === expandedUserGroupData[expandedUserGroupIndex].userKey && userGroupFilteredData[matchCheckIndex].userGroupKey === expandedUserGroupData[expandedUserGroupIndex].userGroupKey) {
                        flag = true;
                      }
                    }
                    if(flag !== true){
                      userGroupFilteredData.push(userGroupInfo[userGroupIndex]);
                    }
                  }
                  else {
                    userGroupFilteredData.push(userGroupInfo[userGroupIndex]);
                  }
                }
              }
            }

            if (scope.milestoneReportOwnerCase) {//Only when owner milestone passed to the directive
              var userExistenceCheck = _.filter(userGroupFilteredData, {
                'userKey': parseInt(scope.milestoneReportOwnerCase.userId)
              });
              if (userExistenceCheck.length === 0) {
                for (userGroupIndex = 0; userGroupIndex < userGroupInfo.length; userGroupIndex++) {
                  if (userGroupInfo[userGroupIndex].userKey === parseInt(scope.milestoneReportOwnerCase.userId)) {
                    userGroupFilteredData.push(userGroupInfo[userGroupIndex]);
                    break;//User can be present in more than one group
                  }
                }
              }
            }

            return userGroupFilteredData;
          };
          scope.getUserGroupInfo();
        };
      }
    };
  }]);
