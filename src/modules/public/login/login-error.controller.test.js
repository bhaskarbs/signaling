'use strict';
describe('LoginErrorController Controller', function() {
    var scope, Environment, ctrl, CookieService;

    Environment = {
        'loginUrl': '#'
    };

    beforeEach(function() {
        module('saintApp');
        inject(function($injector, $controller, $rootScope) {
            CookieService = $injector.get('CookieService');
            scope = $rootScope.$new();
            ctrl = $controller('LoginErrorController', {
                $scope: scope,
                Environment: Environment
            });
        });
        CookieService.put('loginError', 'TEST');
    });
    it('Should exists', function() {
        expect(ctrl).toBeDefined();
    });
});
