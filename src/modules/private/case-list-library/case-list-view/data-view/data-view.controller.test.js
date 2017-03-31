'use strict';
describe('DataViewController Controller', function () {
  var scope, $rootScope, controller, DataViewFactory;
  beforeEach(function () {
    module('saintApp');
    inject(function ($injector) {
      $rootScope = $injector.get('$rootScope');
      DataViewFactory = $injector.get('DataViewFactory');
      scope = $rootScope.$new();
      controller = $injector.get('$controller')('DataViewController',{
        $scope: scope,
        DataViewFactory: DataViewFactory
      });
    });
  });
  it('should exists', function () {
    expect(controller).toBeDefined();
  });
  it('should have these dependencies', function () {
  });
  it('should have these scope objects', function () {
  });
  it('should have these functions', function () {
  });
});
