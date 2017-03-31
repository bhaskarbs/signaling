'use strict';
describe('Directive:userGroupSelect', function () {
  beforeEach(module('saintApp'));
  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope;
  }));

  afterEach(function () {
    element.remove();
    element = scope = undefined;
  });

  it('should have an element with user-group-select-dropdown as an attribute exist', inject(function ($compile) {
    var elem = '<div user-group-select-dropdown ></div>';
    element = angular.element(elem);
    element = $compile(element)(scope);
    expect(element).not.toBeNull();
  }));
});

