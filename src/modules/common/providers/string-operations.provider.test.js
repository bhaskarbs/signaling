'use strict';
describe('StringOperationsService Service', function () {
    var StringOperationsService;
    var ingredients = 'para';
    var reportStartDate = '27/04/2016';
    var reportEndDate = '30/04/2016';
    var reportType = 'major';
    beforeEach(function () {
        module('saintApp');
        inject(function ($injector) {
            StringOperationsService = $injector.get('StringOperationsService');
        });
    });

    it('Should exists', function () {
        expect(StringOperationsService).toBeDefined();
    });

    it('should have these functions', function () {
        expect(StringOperationsService.getFormattedCaseListName).toBeDefined();
        expect(StringOperationsService.getFormattedReportName).toBeDefined();
    });

    it('Should call stringOperationService.getFormattedCaseListName method', function () {
        spyOn(StringOperationsService, 'getFormattedCaseListName').and.callThrough();
        expect(StringOperationsService.getFormattedCaseListName.calls.any()).toEqual(false);
        StringOperationsService.getFormattedCaseListName(ingredients, reportStartDate, reportEndDate);
        expect(StringOperationsService.getFormattedCaseListName.calls.any()).toEqual(true);
    });

    it('Should call stringOperationService.getFormattedReportName method', function () {
        spyOn(StringOperationsService, 'getFormattedReportName').and.callThrough();
        expect(StringOperationsService.getFormattedReportName.calls.any()).toEqual(false);
        StringOperationsService.getFormattedReportName(ingredients, reportType);
        expect(StringOperationsService.getFormattedReportName.calls.any()).toEqual(true);
    });

});