'use strict';
describe('CookieService Service', function () {
    var CookieService;
    var cookieName = 'some';
    var cookieValue = 2;
    beforeEach(function () {
        module('saintApp');
        inject(function ($injector) {
            CookieService = $injector.get('CookieService');
        });
    });
    it('should exists', function () {
        expect(CookieService).toBeDefined();
    });

    it('should have these functions', function () {
        expect(CookieService.put).toBeDefined();
        expect(CookieService.store).toBeDefined();
        expect(CookieService.get).toBeDefined();
        expect(CookieService.remove).toBeDefined();
        expect(CookieService.getAll).toBeDefined();
    });

    it('should call cookie.put method', function () {
        spyOn(CookieService, 'put').and.callThrough();
        expect(CookieService.put.calls.any()).toEqual(false);
        CookieService.put(cookieName, cookieValue);
        expect(CookieService.put.calls.any()).toEqual(true);
        expect(CookieService.put).toHaveBeenCalledWith(cookieName, cookieValue);
    });

    it('should call cookie.store method', function () {
        spyOn(CookieService, 'store').and.callThrough();
        expect(CookieService.store.calls.any()).toEqual(false);
        CookieService.store(cookieName, cookieValue);
        expect(CookieService.store.calls.any()).toEqual(true);
        expect(CookieService.store).toHaveBeenCalledWith(cookieName, cookieValue);
    });

    it('should call cookie.get method', function () {
        spyOn(CookieService, 'get').and.callThrough();
        expect(CookieService.get.calls.any()).toEqual(false);
        CookieService.get(cookieName);
        expect(CookieService.get.calls.any()).toEqual(true);
    });

    it('should call cookie.remove method', function () {
        spyOn(CookieService, 'remove').and.callThrough();
        expect(CookieService.remove.calls.any()).toEqual(false);
        CookieService.remove(cookieName);
        expect(CookieService.remove.calls.any()).toEqual(true);
        expect(CookieService.remove).toHaveBeenCalledWith(cookieName);
    });

    it('should call cookie.getAll method', function () {
        spyOn(CookieService, 'getAll').and.callThrough();
        expect(CookieService.getAll.calls.any()).toEqual(false);
        CookieService.getAll();
        expect(CookieService.getAll.calls.any()).toEqual(true);
        expect(CookieService.getAll).toHaveBeenCalledWith();
    });

});
