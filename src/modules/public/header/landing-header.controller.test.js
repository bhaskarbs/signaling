'use strict';
describe('LandingHeaderController Controller', function() {
    var scope, $state, Environment, ctrl, rootScope;

    Environment = {
        'loginUrl': '#'
    };

    beforeEach(function() {
        module('saintApp');
        inject(function($injector, $controller, $rootScope) {
            $state = $injector.get('$state');
            rootScope = $injector.get('$rootScope');
            scope = $rootScope.$new();
            ctrl = $controller('LandingHeaderController', {
                $scope: scope,
                Environment: Environment,
                $state: $state,
                $rootScope: rootScope
            });
        });
    });

    it('Should exists', function() {
        expect(ctrl).toBeDefined();
    });

    it('Should have Methods defined in it', function() {
        expect(scope.fnInit).toBeDefined();
        expect(scope.fnLoadDashboard).toBeDefined();
        expect(scope.fnHideSigninInLoginOnLoad).toBeDefined();
    });

    it('fnLoadDashboard() should change the Url', function() {
        scope.fnLoadDashboard();
    });

    it('fnHideSigninInLoginOnLoad() if condition true', function() {
        scope.fnHideSigninInLoginOnLoad();
        rootScope.$emit('$stateChangeStart', {
            'name': 'login'
        });
        expect(scope.header.signInButtonVisibility).toBe(false);
    });

    it('fnHideSigninInLoginOnLoad() if condition false', function() {
        scope.fnHideSigninInLoginOnLoad();
        rootScope.$emit('$stateChangeStart', {
            toState: {
                'name': 'login'
            }
        });
        expect(scope.header.signInButtonVisibility).toBe(true);
    });

    it('fnHideSigninInLoginOnLoad() if $state true', function() {
        if ($state.current) {
            $state.current.name = 'login';
        } else {
            $state.current = {
                name: 'login'
            };
        }
        scope.fnHideSigninInLoginOnLoad();
        expect(scope.header.signInButtonVisibility).toBe(false);
    });
});
