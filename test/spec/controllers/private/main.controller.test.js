'use strict';
describe('MainController Controller', function () {
  var $state, UrlService,scope, ctrl, AuthorizeService, Environment,ConstantService;
  var params='#';
  beforeEach(function () {
    module('saintApp');
    module('saint-authorize');
    inject(function ($injector,$controller, $rootScope) {
      scope = $rootScope.$new();
      ConstantService = $injector.get('ConstantService');
      $state = $injector.get('$state');
      UrlService = $injector.get('UrlService');
      AuthorizeService = $injector.get('AuthorizeService');
      spyOn($state, 'go');
      ctrl = $controller('MainController', {
        $scope: scope,
        $rootScope : $rootScope,
        ConstantService : ConstantService,
        UrlService : UrlService,
        AuthorizeService : AuthorizeService,
        Environment : Environment,
        $state : $state
      });
    });
  });

  it('should exists', function () {
    expect(ctrl).toBeDefined();
  });
  it('Should have configs defined in it', function() {
      expect(scope.CONSTANTS).toBeDefined();
      expect(scope.PRIVILEGES).toBeDefined();
      expect(scope.decorator).toBeDefined();
      expect(scope.VIEWS).toBeDefined();
  });
  it('Should have Methods defined in it', function() {
      expect(scope.fnNavigate).toBeDefined();
  });
  it('fnNavigate() should move the state based on the parameter passed', function() {
      scope.fnNavigate('params');
      expect($state.go).toHaveBeenCalledWith('params',null,{'reload': false});
  });
  it('fnNavigate() should move the state based on the parameter passed', function() {
      scope.fnNavigate('params','#');
      expect($state.go).toHaveBeenCalledWith('params',params,{'reload': false});
  });
});
