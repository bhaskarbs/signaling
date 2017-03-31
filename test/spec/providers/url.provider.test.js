'use strict';
describe('UrlService Service', function () {
    var UrlService;
    var urlKey = 'ADHOC_ANALYSIS';
    var queryParams = '#';
    var _options = {
        'useFixture': true
    };
    beforeEach(function () {
        module('saintApp');
        inject(function ($injector) {
            UrlService = $injector.get('UrlService');
        });
    });
    it('Should exists', function () {
        expect(UrlService).toBeDefined();
    });


    it('should have these functions', function () {
        expect(UrlService.getService).toBeDefined();
        expect(UrlService.getBOEService).toBeDefined();
        expect(UrlService.getView).toBeDefined();
        expect(UrlService.getFixture).toBeDefined();
    });

    it('Should call getService function()', function () {
        if (_options) {
            _options.useFixture = true;
        }
        else {
            _options.useFixture = true;
        }
        spyOn(UrlService, 'getService').and.callThrough();
        expect(UrlService.getService.calls.any()).toEqual(false);
        UrlService.getService(urlKey, queryParams);
        expect(UrlService.getService.calls.any()).toEqual(true);
        if (_options) {
            _options.useFixture = true;
        }
        else {
            _options.useFixture = true;
        }
        UrlService.getService(urlKey, queryParams);
        expect(UrlService.getService.calls.any()).toEqual(true);


    });

    it('Should call getBOEService function()', function () {
        if (_options) {
            _options.useFixture = true;
        }
        else {
            _options.useFixture = true;
        }
        spyOn(UrlService, 'getBOEService').and.callThrough();
        expect(UrlService.getBOEService.calls.any()).toEqual(false);

        UrlService.getBOEService(urlKey, queryParams);
        spyOn(UrlService, 'getService').and.callThrough();
        expect(UrlService.getBOEService.calls.any()).toEqual(true);
    });

    it('Should call getView function()', function () {
        var partialkey = 'LOGOUT';
        spyOn(UrlService, 'getView').and.callThrough();
        expect(UrlService.getView.calls.any()).toEqual(false);
        UrlService.getView(partialkey);
        expect(UrlService.getView.calls.any()).toEqual(true);

    });

    it('Should call getFixture function()', function () {
        var fixtureKey = 'COUNTRY_CODES';
        spyOn(UrlService, 'getFixture').and.callThrough();
        expect(UrlService.getFixture.calls.any()).toEqual(false);
        UrlService.getFixture(fixtureKey);
        expect(UrlService.getFixture.calls.any()).toEqual(true);
    });
});
