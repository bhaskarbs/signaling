'use strict';
describe('NotificationController Controller',function(){
  var ctrl,scope,$q,NotificationFactory,ConstantService,UrlService,$state,DateService,LanguageService,loaderService;
  beforeEach(function(){
    module('saintApp');
    inject(function($injector,$controller,$rootScope) {
      scope = $rootScope.$new();
      $q = $injector.get('$q');
      NotificationFactory = $injector.get('NotificationFactory');
      ConstantService = $injector.get('ConstantService');
      UrlService = $injector.get('UrlService');
      $state = $injector.get('$state');
      DateService = $injector.get('DateService');
      LanguageService = $injector.get('LanguageService');
      loaderService = $injector.get('loaderService');
      ctrl = $controller('NotificationController', {
        $scope: scope,
        NotificationFactory: NotificationFactory,
        ConstantService: ConstantService,
        UrlService: UrlService,
        $state : $state
      });
    });
  });

  it('should exists',function(){
    expect(ctrl).toBeDefined();
  });

  it('Should have configs defined in it',function(){
    expect(scope.select).toBeDefined();
    expect(scope.topValue).toBeDefined();
    expect(scope.skipValue).toBeDefined();
    expect(scope.filterParam).toBeDefined();
    expect(scope.notificationFactoryData).toBeDefined();
    expect(scope.showFilterPanel).toBeDefined();
    expect(scope.notificationList).toBeDefined();
    expect(scope.isFromLazyLoad).toBeDefined();
  });

  it('Should have Methods defined in it',function(){
    expect(scope.fnNotificationList).toBeDefined();
    expect(scope.fnToggleFilterPanel).toBeDefined();
    expect(scope.fnUpdateSelectAll).toBeDefined();
    expect(scope.fnOnSelectAll).toBeDefined();
    expect(scope.fnGetNotificationMessage).toBeDefined();
    expect(scope.fnNavigateFromNotification).toBeDefined();
    expect(scope.fngetFilterConfig).toBeDefined();
    expect(scope.fnGenerateOdataParameters).toBeDefined();
    expect(scope.fnClickfilterCategory).toBeDefined();
    expect(scope.fnLoadMoreNotifications).toBeDefined();
    expect(scope.fnCalculateCreatedDate).toBeDefined();
  });

  it('Should call fngetFilterConfig()', function(){
    scope.getFilterConfig = [{filterCategory: 'Milestone Assignment'},{filterCategory: 'Milestone Completion'},{filterCategory: 'Milestone Overdue'},{filterCategory: 'Report Assignment'},{filterCategory: 'Report Overdue'},{filterCategory: 'Sharing'}];
    scope.fngetFilterConfig();
  });
  it('Should call fnNotificationList()', function(){
    scope.filterParam = 'abc';
    scope.fnNotificationList(false,'',10,0);
  });
  it('Should call fnToggleFilterPanel()', function(){
    scope.showFilterPanel = false;
    scope.fnToggleFilterPanel();
  });
  it('Should call fnUpdateSelectAll()', function() {
    scope.fnUpdateSelectAll(true);
  });
  it('Should call fnOnSelectAll()', function(){
    scope.fnUpdateSelectAll(true);
    scope.fnOnSelectAll();
  });
  it('Should call fnGenerateOdataParameters()', function(){
    scope.notificationFactoryData.selectedFilters.length = 2;
    scope.fnGenerateOdataParameters();
  });
  it('Should call fnClickfilterCategory()', function(){
    var notification  = [{filterCategory: 'Milestone Completion', selected: true}];
    scope.select.selectAll=false;
    notification.selected=false;
    scope.fnClickfilterCategory(notification);
    scope.select.selectAll=true;
    notification.selected=false;
    scope.fnClickfilterCategory(notification);
    var filter = [{filterCategory: 'Milestone Assignment',selected: false}];
    filter.selected = false;
    scope.fnClickfilterCategory(notification);
    notification.selected=false;
    scope.notificationFactoryData.selectedFilters = [{filterCategory: 'Milestone Assignment'},{filterCategory: 'Milestone Completion'},{filterCategory: 'Report Assignment'},{filterCategory: 'Report Overdue'},{filterCategory: 'Sharing'}];
    scope.getFilterConfig=[{filterCategory: 'Milestone Assignment'},{filterCategory: 'Milestone Completion'},{filterCategory: 'Milestone Overdue'},{filterCategory: 'Report Assignment'},{filterCategory: 'Report Overdue'},{filterCategory: 'Sharing'}];
    scope.select.selectAll=true;
    scope.fnClickfilterCategory(notification);
    notification.selected=false;
    scope.notificationFactoryData.selectedFilters = [{filterCategory: 'Milestone Assignment'},{filterCategory: 'Milestone Completion'},{filterCategory: 'Report Assignment'},{filterCategory: 'Report Overdue'},{filterCategory: 'Sharing'}];
    scope.getFilterConfig=[{filterCategory: 'Milestone Completion'},{filterCategory: 'Milestone Completion'},{filterCategory: 'Milestone Overdue'},{filterCategory: 'Report Assignment'},{filterCategory: 'Report Overdue'},{filterCategory: 'Sharing'}];
    scope.select.selectAll=false;
    scope.fnClickfilterCategory(notification);
    notification.selected=true;
    scope.notificationFactoryData.selectedFilters = [{filterCategory: 'Milestone Assignment'},{filterCategory: 'Milestone Completion'},{filterCategory: 'Report Assignment'},{filterCategory: 'Report Overdue'},{filterCategory: 'Sharing'}];
    scope.getFilterConfig=[{filterCategory: 'Milestone Completion'},{filterCategory: 'Milestone Completion'},{filterCategory: 'Milestone Overdue'},{filterCategory: 'Report Assignment'},{filterCategory: 'Report Overdue'},{filterCategory: 'Sharing'}];
    scope.select.selectAll=false;
    scope.fnClickfilterCategory(notification);
    notification.selected=true;
    scope.fnClickfilterCategory(notification);
  });
  it('Should call fnLoadMoreNotifications()', function() {
    scope.fnNotificationList(false,'',10,0);
    scope.fnLoadMoreNotifications();
  });
  it('Should call fnNavigateFromNotification()', function() {
    scope.fnNavigate = function(){};
    scope.fnNavigateFromNotification({objectTypeKey:1});
    scope.fnNavigateFromNotification({objectTypeKey:2});
    scope.fnNavigateFromNotification({objectTypeKey:3});
    scope.fnNavigateFromNotification({objectTypeKey:4});
  });
  it('Should call fnCalculateCreatedDate()', function() {
    scope.fnCalculateCreatedDate('Date(1468566679000)');
  });
});


