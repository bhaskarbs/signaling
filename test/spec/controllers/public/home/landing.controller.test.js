'use strict';
describe('LandingController Controller', function() {
    var scope, ctrl;
    beforeEach(function() {
        module('saintApp');
        inject(function($injector, $controller, $rootScope) {
            scope = $rootScope.$new();
            ctrl = $controller('LandingController', {
                $scope: scope
            });
        });
    });
    it('Should exists', function() {
        expect(ctrl).toBeDefined();
    });
});
