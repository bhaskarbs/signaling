'use strict';
describe('HeaderController Controller', function () {
  var scope, $q, ctrl, rootScope, UserService, UrlService, alertService, LanguageService, loaderService, AuthorizeService;
    var data = 1;
    var result = {
        'data': [{
            'uuid': 'test',
            'name': 'some'
        }],
        'error': [{
            'uuid': 'test',
            'name': 'some'
        }]
    };
    beforeEach(function () {
        module('saintApp');
      module('saint-authorize');
        inject(function ($injector, $controller, $rootScope) {
            scope = $rootScope.$new();
            rootScope = $injector.get('$rootScope');
            $q = $injector.get('$q');
            UserService = $injector.get('UserService');
            UrlService = $injector.get('UrlService');
            alertService = $injector.get('alertService');
          AuthorizeService = $injector.get('AuthorizeService');
            LanguageService = $injector.get('LanguageService');
            loaderService = $injector.get('loaderService');
            spyOn(UserService, 'doLogout').and.callFake(function () {
                return $q.when(result);
            });

            spyOn(UrlService, 'getView').and.callFake(function () {
                return '#';
            });
            ctrl = $controller('HeaderController', {
                $scope: scope,
                $rootScope: rootScope,
                UserService: UserService,
                UrlService: UrlService,
                alertService: alertService,
                LanguageService: LanguageService,
                loaderService: loaderService,
              AuthorizeService: AuthorizeService,
                $q: $q
            });
        });
    });
    it('Should exists', function () {
        expect(ctrl).toBeDefined();
    });
    it('Should call $watch', function () {
        scope.$digest();
    });
    it('Should call $on', function () {
        rootScope.$emit('logoutSuccessCast', data, {
        });
    });
    it('Should call $on', function () {
        data = 2;
        rootScope.$emit('logoutSuccessCast', data, {
        });
    });
    // TODO I will remove it after verifying builds - Sai
    xit('Should call fnDoLogout when condition true', function () {
        spyOn(UserService, 'doSessionCleanup').and.callFake(function () {
            return $q.when();
        });
        spyOn(UserService, 'getLogoutToken').and.callFake(function () {
            return $q.when(result);
        });
        scope.fnDoLogout();
        scope.$digest();
    });
    // TODO I will remove it after verifying builds - Sai
    xit('Should call fnDoLogout when condition false', function () {
        result = {
            'data': [{
                'uuid': 'test',
                'name': 'some'
            }],
            'error': ''
        };

        spyOn(UserService, 'doSessionCleanup').and.callFake(function () {
            return $q.when();
        });
        spyOn(UserService, 'getLogoutToken').and.callFake(function () {
            return $q.when(result);
        });
        scope.fnDoLogout();
        scope.$digest();
        expect(scope.header.token).toBe(result.data);

    });

});
