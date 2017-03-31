'use strict';

describe('MapService Service', function () {

  var MapService, CaseListFactory, ConstantService;

  beforeEach(function () {
    module('saint-config');
    module('saint-authorize');
    module('saintApp', ['UrlServiceProvider', 'Environment', function (UrlServiceProvider, Environment) {
      UrlServiceProvider.setOptions({'useFixture': false, 'Environment': Environment});
    }]);
    inject(function ($injector) {
      MapService = $injector.get('MapService');
      CaseListFactory = $injector.get('CaseListFactory');
      ConstantService = $injector.get('ConstantService');
    });
  });

  it('MapService should exists', function () {
    expect(MapService).toBeDefined();
  });

  it('MapService should have dependencies', function () {
    expect(CaseListFactory).toBeDefined();
    expect(ConstantService).toBeDefined();
  });

  it('MapService should have functions', function () {
    expect(MapService.fnGetCountryChartForSpecificSection).toBeDefined();
  });

  it('MapService should render based on the morph data', function () {
    var id = 'countryCode',
      name = 'COUNTRY_CODE_OF_ORIGIN',
      dataArray = [{
        name: 'JAPAN',
        value: 13
      }, {
        name: 'BRAZIL',
        value: 10
      }, {
        name: 'CANADA',
        value: 5
      }, {
        name: 'CHINA',
        value: 10
      }],
      analyticalData = [];

    var elemDiv = document.createElement('div');
    elemDiv.id = id;
    document.body.appendChild(elemDiv);

    //Chart render function call
    MapService.fnGetCountryChartForSpecificSection(id, dataArray, name, analyticalData);
  });
});
