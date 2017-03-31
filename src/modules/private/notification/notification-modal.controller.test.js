'use strict';
describe('NotificationControllerModal Controller',function() {
  var ctrl, scope, $q, NotificationFactory, ConstantService, UrlService, $state, DateService, LanguageService, loaderService;
  beforeEach(function () {
    module('saintApp');
    inject(function ($injector, $controller, $rootScope) {
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
        $state: $state
      });
    });
  });

  it('should exists', function () {
    expect(ctrl).toBeDefined();
  });
  it('Should have configs defined in it',function(){
    expect(scope.topValue).toBeDefined();
    expect(scope.skipValue).toBeDefined();
    expect(scope.notificationList).toBeDefined();
    expect(scope.isFromLazyLoad).toBeDefined();
    expect(scope.notificationCreatedDate).toBeDefined();
  });
  it('Should have Methods defined in it',function() {
    expect(scope.fnNotificationList).toBeDefined();
    expect(scope.fnGetNotificationMessage).toBeDefined();
    expect(scope.fnNavigateFromNotification).toBeDefined();
    expect(scope.fnLoadMoreNotifications).toBeDefined();
    expect(scope.fnCalculateCreatedDate).toBeDefined();
  });

  it('Should call fnNotificationList()', function() {
    scope.fnNotificationList();
  });
  it('Should call fnNavigateFromNotification()', function() {
    scope.fnNavigate = function(){};
    scope.fnNavigateFromNotification({objectTypeKey:1});
    scope.fnNavigateFromNotification({objectTypeKey:2});
    scope.fnNavigateFromNotification({objectTypeKey:3});
    scope.fnNavigateFromNotification({objectTypeKey:4});
  });
  it('Should call fnLoadMoreNotifications()', function() {
    scope.fnNotificationList(false,'',10,0);
    scope.fnLoadMoreNotifications();
  });
 
  it('Should call fnCalculateCreatedDate()', function() {
    scope.fnCalculateCreatedDate('Date(1468566679000)');
  });
});
