'use strict';
describe('IngredientEntity Entity', function () {
  var IngredientEntity;
  beforeEach(function () {
    module('saintApp');
    inject(function ($injector) {
      IngredientEntity = $injector.get('IngredientEntity');
    });
  });
  it('should exists', function () {
    expect(IngredientEntity).toBeDefined();
  });
  it('should have these keys', function () {
    expect(IngredientEntity.hasOwnProperty('ingredientName')).toBeTruthy();
    expect(IngredientEntity.hasOwnProperty('ingredientId')).toBeTruthy();
    expect(IngredientEntity.hasOwnProperty('products')).toBeTruthy();
    expect(IngredientEntity.hasOwnProperty('licenses')).toBeTruthy();
  });
  it('should have these many keys', function () {
    expect(Object.keys(IngredientEntity).length).toEqual(4);
  });
});

