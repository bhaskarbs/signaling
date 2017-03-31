'use strict';
describe('ReportMileStoneEntity Entity', function () {
  var ReportMileStoneEntity;
  beforeEach(function () {
    module('saintApp');
    inject(function ($injector) {
      ReportMileStoneEntity = $injector.get('ReportMileStoneEntity');
    });
  });
  it('should exists', function () {
    expect(ReportMileStoneEntity).toBeDefined();
  });
  it('should have these keys', function () {
    expect(ReportMileStoneEntity.hasOwnProperty('milestoneName')).toBeTruthy();
    expect(ReportMileStoneEntity.hasOwnProperty('reportDateStamp')).toBeTruthy();
    expect(ReportMileStoneEntity.hasOwnProperty('offsetToReportDate')).toBeTruthy();
    expect(ReportMileStoneEntity.hasOwnProperty('assignedUserGroups')).toBeTruthy();
    expect(ReportMileStoneEntity.hasOwnProperty('assignedUsers')).toBeTruthy();
    expect(ReportMileStoneEntity.hasOwnProperty('availableUsers')).toBeTruthy();
    expect(ReportMileStoneEntity.hasOwnProperty('reportMilestoneDate')).toBeTruthy();
    expect(ReportMileStoneEntity.hasOwnProperty('milesoneStatusDropDown')).toBeTruthy();
    expect(ReportMileStoneEntity.hasOwnProperty('milestoneStatus')).toBeTruthy();
    expect(ReportMileStoneEntity.hasOwnProperty('milestoneKey')).toBeTruthy();
    expect(ReportMileStoneEntity.hasOwnProperty('milestoneForeignKey')).toBeTruthy();
    expect(ReportMileStoneEntity.hasOwnProperty('reportMilestoneDays')).toBeTruthy();
    expect(ReportMileStoneEntity.hasOwnProperty('milestoneCreatedBy')).toBeTruthy();
    expect(ReportMileStoneEntity.hasOwnProperty('milestoneCreatedDate')).toBeTruthy();
    expect(ReportMileStoneEntity.hasOwnProperty('milestoneUpdatedDate')).toBeTruthy();
    expect(ReportMileStoneEntity.hasOwnProperty('milestoneUpdatedBy')).toBeTruthy();
    expect(ReportMileStoneEntity.hasOwnProperty('milestoneCompletionDate')).toBeTruthy();
    expect(ReportMileStoneEntity.hasOwnProperty('preAssignedUsersGroups')).toBeTruthy();
  });
  it('should have these many keys', function () {
    expect(Object.keys(ReportMileStoneEntity).length).toEqual(18);
  });
});

