'use strict';
angular.module('saintApp').service('ReportMileStoneEntity',[ function () {
  return {
    'milestoneName': '',
    'reportDateStamp': null,
    'offsetToReportDate': 0,
    'assignedUserGroups': [],
    'assignedUsers': [],
    'availableUsers': [],
    'reportMilestoneDate': null,
    'milesoneStatusDropDown': null,
    'milestoneStatus': null,
    'milestoneKey': null,
    'milestoneForeignKey': null,
    'reportMilestoneDays': null,
    'milestoneCreatedBy': null,
    'milestoneCreatedDate': null,
    'milestoneUpdatedDate': null,
    'milestoneUpdatedBy': null,
    'milestoneCompletionDate': null,
    'preAssignedUsersGroups': null
  };
}]);
