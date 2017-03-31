'use strict';
describe('IngredientFactory Service', function () {
  var IngredientFactory, $httpBackend, IngredientFactoryData, IngredientEntity, ProductEntity, $http, $q, UrlService, alertService, LanguageService, ingredientMorphedData;
  beforeEach(function () {
    module('saint-config');
    module('saintApp', ['UrlServiceProvider', 'Environment', function (UrlServiceProvider, Environment) {
      UrlServiceProvider.setOptions({'useFixture': false, 'Environment': Environment});
    }]);
    inject(function ($injector) {
      IngredientFactory = $injector.get('IngredientFactory');
      IngredientFactoryData = IngredientFactory.data;
      ProductEntity = $injector.get('ProductEntity');
      IngredientEntity = $injector.get('IngredientEntity');
      $q = $injector.get('$q');
      $httpBackend = $injector.get('$httpBackend');
      $http = $injector.get('$http');
      UrlService = $injector.get('UrlService');
      alertService = $injector.get('alertService');
      LanguageService = $injector.get('LanguageService');
    });
    jasmine.getJSONFixtures().fixturesPath = 'base/test/spec/fixtures';
    $httpBackend.whenGET('i18n/resources-locale_en-US.js').respond({});
    $httpBackend.whenGET('i18n/resources-locale_en-us.js').respond({});
    $httpBackend.whenGET('i18n/resources-locale_en-IN.js').respond({});
  });
  var isAngularPromise = function (value) {
    if (typeof value.then !== 'function') {
      return false;
    }
    var promiseThenSrc = String($q.defer().promise.then);
    var valueThenSrc = String(value.then);
    return promiseThenSrc === valueThenSrc;
  };

  it('should exists', function () {
    expect(IngredientFactory).toBeDefined();
  });

  it('should have dependencies', function () {
    expect(IngredientEntity).toBeDefined();
    expect(ProductEntity).toBeDefined();
    expect($http).toBeDefined();
    expect($q).toBeDefined();
    expect(UrlService).toBeDefined();
    expect(alertService).toBeDefined();
    expect(LanguageService).toBeDefined();
  });

  it('should have objects', function () {
    expect(IngredientFactoryData).toBeDefined();
    expect(IngredientFactoryData.list).toBeDefined();
    expect(Object.keys(IngredientFactoryData).length).toEqual(1);
  });

  it('should have these functions', function () {
    expect(IngredientFactory.getIngredientMorphedData).toBeDefined();
    expect(IngredientFactory.getIngredients).toBeDefined();
    expect(Object.keys(IngredientFactory).length).toEqual(3);
  });

  it('getIngredientMorphedData should return response', function () {
    var ingredientData = getJSONFixture('ingredient-factory.get-ingredients.test.json');
    expect(ingredientData.hasOwnProperty('d')).toBeTruthy();
    expect(ingredientData.d.hasOwnProperty('results')).toBeTruthy();
    ingredientMorphedData = IngredientFactory.getIngredientMorphedData(ingredientData.d.results);
    expect(typeof(ingredientMorphedData)).toBe('object');
    expect(typeof(IngredientFactoryData.list)).toBe('object');
  });

  it('getIngredients() should return promise which executes BACKEND API calls and return successful response objects', function (done) {
    var testCaseUrl = UrlService.getService('GET_INGREDIENTS');
    $httpBackend.whenGET(function (actualUrl) {
      return actualUrl.indexOf(testCaseUrl) > -1;
    }).respond(getJSONFixture('ingredient-factory.get-ingredients.test.json'));
    var promiseObject = IngredientFactory.getIngredients().then(function (result) {
      expect(result.data).toBeDefined();
      expect(result.message).toBeDefined();
      done();
    });
    $httpBackend.flush();
    expect(promiseObject).toBeDefined();
    expect(isAngularPromise(promiseObject)).toBeTruthy();
  });

  it('getIngredients() should return promise which executes BACKEND API calls and return failed response objects', function (done) {
    var testCaseUrl = UrlService.getService('GET_INGREDIENTS');
    $httpBackend.whenGET(function (actualUrl) {
      return actualUrl.indexOf(testCaseUrl) > -1;
    }).respond(null);
    var promiseObject = IngredientFactory.getIngredients().then(function (result) {
      expect(result.error).toBeDefined();
      expect(result.message).toBeDefined();
      done();
    });
    $httpBackend.flush();
    expect(promiseObject).toBeDefined();
    expect(isAngularPromise(promiseObject)).toBeTruthy();
  });
});
