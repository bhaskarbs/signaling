'use strict';
describe('DataFactory Factory', function () {
  var DataViewFactory;
  beforeEach(function () {
    module('saint-config');
    module('saintApp', ['UrlServiceProvider', 'Environment', function (UrlServiceProvider, Environment) {
      UrlServiceProvider.setOptions({'useFixture': false, 'Environment': Environment});
    }]);
    inject(function ($injector) {
      DataViewFactory = $injector.get('DataViewFactory');
      jasmine.getJSONFixtures().fixturesPath = 'base/test/spec/fixtures';
    });
  });
  it('should exists', function () {
    expect(DataViewFactory).toBeDefined();
  });
  it('should have these dependencies', function () {
  });
  it('should have these objects', function () {
  });
  it('should have these functions', function () {
  });
});
