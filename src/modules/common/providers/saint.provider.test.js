'use strict';
describe('SaintService Service', function () {
  var SaintService, rootScope, UserService, logService;
  var position='right';
  beforeEach(function () {
    module('saint-config');
    module('saint-authorize');
    module('saintApp', ['UrlServiceProvider', 'Environment', function (UrlServiceProvider, Environment) {
      UrlServiceProvider.setOptions({'useFixture': false, 'Environment': Environment});
    }]);
    inject(function ($injector) {
      SaintService = $injector.get('SaintService');
      rootScope = $injector.get('$rootScope');
      UserService = $injector.get('UserService');
      logService = $injector.get('logService');
    });
  });

  it('Should exists', function () {

    expect(SaintService).toBeDefined();
  });

  it('Should have these dependencies', function () {
    expect(rootScope).toBeDefined();
    expect(UserService).toBeDefined();
    expect(logService).toBeDefined();
  });

  it('Should have these functions', function () {
    expect(SaintService.scrollWindow).toBeDefined();
    expect(SaintService.handleAuthorization).toBeDefined();
    expect(SaintService.listenForSessionClosed).toBeDefined();
    expect(SaintService.prepareSessionExists).toBeDefined();
    expect(SaintService.handleDefaulters).toBeDefined();
    expect(SaintService.clearHandleDefaulters).toBeDefined();
    expect(SaintService.initiateApplication).toBeDefined();
    expect(SaintService.fnProvideAlertForDirtyFlags).toBeDefined();
    expect(SaintService.fnCheckAllDirtyFlags).toBeDefined();
    expect(Object.keys(SaintService).length).toEqual(10);
  });

  it('Should call saint.scrollWindow method',function(){
    spyOn(SaintService, 'scrollWindow').and.callThrough();
    expect(SaintService.scrollWindow.calls.any()).toEqual(false);
    SaintService.scrollWindow(position);
    expect(SaintService.scrollWindow.calls.any()).toEqual(true);
  });

  it('Should call saint.handleAuthorization method',function(){
    spyOn(SaintService, 'handleAuthorization').and.callThrough();
    expect(SaintService.handleAuthorization.calls.any()).toEqual(false);
    SaintService.handleAuthorization();
    expect(SaintService.handleAuthorization.calls.any()).toEqual(true);
    rootScope.$emit('$stateChangeStart', {});
  });

  it('Should call saint.listenForSessionClosed method',function(){
    rootScope.$emit('sessionClosed', {

        });
    spyOn(SaintService, 'listenForSessionClosed').and.callThrough();
    expect(SaintService.listenForSessionClosed.calls.any()).toEqual(false);
    SaintService.listenForSessionClosed();
    expect(SaintService.listenForSessionClosed.calls.any()).toEqual(true);
  });
});
