'use strict';
describe('ProductEntity Entity', function () {
  var ProductEntity;
  beforeEach(function () {
    module('saintApp');
    inject(function ($injector) {
      ProductEntity = $injector.get('ProductEntity');
    });
  });
  it('should exists', function () {
    expect(ProductEntity).toBeDefined();
  });
  it('should have these keys', function () {
    expect(ProductEntity.hasOwnProperty('productId')).toBeTruthy();
    expect(ProductEntity.hasOwnProperty('productName')).toBeTruthy();
  });
  it('should have these many keys', function () {
    expect(Object.keys(ProductEntity).length).toEqual(2);
  });
});

