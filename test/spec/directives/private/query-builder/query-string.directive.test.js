'use strict';
describe('Directive:queryString', function () {
  beforeEach(module('saintApp'));
  var scope, value;
  beforeEach(inject(function ($rootScope) {
    scope = $rootScope;
    scope.operators = 'true';
    value = true;
  }));
});
