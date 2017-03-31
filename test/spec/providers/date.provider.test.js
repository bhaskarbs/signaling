'use strict';
describe('DateService Service', function () {
  var DateService, $filter;
  var date = new Date();
  var tempDate = '27-Jun-2016';
  var dateSQL = '2016-4-4';
  var dateObjectString = '/Date(14/04/2016)/';
  var milliseconds = 0.003;
  var dateString = '4-27-2016';
  var timeString = '27:04:2016';
  var millisecondTime = '12:12:12';
  beforeEach(function () {
    module('saintApp');
    inject(function ($injector) {
      DateService = $injector.get('DateService');
      $filter = $injector.get('$filter');
    });
  });
  it('should exists', function () {
    expect(DateService).toBeDefined();
  });
  it('should have these dependencies', function () {
    expect($filter).toBeDefined();
  });
  it('should have objects', function () {
    expect(DateService.dateFormat).toBeDefined();
    expect(DateService.datePickerFormat).toBeDefined();
    expect(DateService.displayDateFormat).toBeDefined();
    expect(DateService.months).toBeDefined();
  });
  it('should have these functions', function () {
    expect(DateService.getFormattedDateStringFromDateObject).toBeDefined();
    expect(DateService.getFormattedDateStringTwoFromDateObject).toBeDefined();
    expect(DateService.getFormattedDatePickerStringFromDateObject).toBeDefined();
    expect(DateService.getRequiredDateStringFormat).toBeDefined();
    expect(DateService.getRequiredDatePickerStringFormat).toBeDefined();
    expect(DateService.getDateInLocalTimeZone).toBeDefined();
    expect(DateService.getMillisecondsInUTCTimeZone).toBeDefined();
    expect(DateService.getDateObjectFromBackendDateString).toBeDefined();
    expect(DateService.getDateStringInDateFormatOne).toBeDefined();
    expect(DateService.getDateStringInDateFormatTwo).toBeDefined();
    expect(DateService.getDatePickerStringInDateFormatOne).toBeDefined();
    expect(DateService.getDateObjectFromString).toBeDefined();
    expect(DateService.getDateObjectFromDatePickerString).toBeDefined();
    expect(DateService.getNoOfDaysBetweenTwoDates).toBeDefined();
    expect(DateService.getReportFormat).toBeDefined();
    expect(DateService.isDatesInAscending).toBeDefined();
    expect(DateService.fnBackEndDateString).toBeDefined();
    expect(DateService.getDateDisplayString).toBeDefined();
    expect(DateService.getDateStringFromDate).toBeDefined();
    expect(DateService.getNoOfHoursBetweenTwoDates).toBeDefined();
    expect(DateService.returnNoOfDaysBetweenTwoDates).toBeDefined();
    expect(DateService.getNoOfMonthsBetweenTwoDates).toBeDefined();
    expect(DateService.getNoOfMinutesBetweenTwoDates).toBeDefined();
    expect(DateService.getUTCDateFromBackendDateString).toBeDefined();
    expect(DateService.getUTCDateFromDateObject).toBeDefined();
    expect(Object.keys(DateService).length).toEqual(35);
  });

  it('dateService.getFormattedDateStringFromDateObject method  should return a date in dd-MMM-yyyy format', function () {
    spyOn(DateService, 'getFormattedDateStringFromDateObject').and.callThrough();
    expect(DateService.getFormattedDateStringFromDateObject.calls.any()).toEqual(false);
    DateService.getFormattedDateStringFromDateObject(date);
    expect(DateService.getFormattedDateStringFromDateObject.calls.any()).toEqual(true);
    expect(DateService.getFormattedDateStringFromDateObject).toHaveBeenCalledWith(date);
    date = '14/04/2016';
    DateService.getFormattedDateStringFromDateObject(date);
    expect(DateService.getFormattedDateStringFromDateObject.calls.any()).toEqual(true);
    expect(DateService.getFormattedDateStringFromDateObject).toHaveBeenCalledWith(date);
    expect(DateService.getFormattedDateStringFromDateObject.calls.count()).toEqual(2);
  });

  it('getFormattedDateStringTwoFromDateObject() should return a date in yyyy-MM-dd format', function () {
    date = new Date();
    spyOn(DateService, 'getFormattedDateStringTwoFromDateObject').and.callThrough();
    expect(DateService.getFormattedDateStringTwoFromDateObject.calls.any()).toEqual(false);
    DateService.getFormattedDateStringTwoFromDateObject(date);
    expect(DateService.getFormattedDateStringTwoFromDateObject.calls.any()).toEqual(true);
    date = '';
    DateService.getFormattedDateStringTwoFromDateObject(date);
    expect(DateService.getFormattedDateStringTwoFromDateObject.calls.any()).toEqual(true);
    expect(DateService.getFormattedDateStringTwoFromDateObject.calls.count()).toEqual(2);
  });

  it('getFormattedDatePickerStringFromDateObject() should return a date in MM/dd/yyyy format', function () {
    date = new Date();
    spyOn(DateService, 'getFormattedDatePickerStringFromDateObject').and.callThrough();
    expect(DateService.getFormattedDatePickerStringFromDateObject.calls.any()).toEqual(false);
    DateService.getFormattedDatePickerStringFromDateObject(date);
    expect(DateService.getFormattedDatePickerStringFromDateObject.calls.any()).toEqual(true);
    date = '';
    DateService.getFormattedDatePickerStringFromDateObject(date);
    expect(DateService.getFormattedDatePickerStringFromDateObject.calls.any()).toEqual(true);
    expect(DateService.getFormattedDatePickerStringFromDateObject.calls.count()).toEqual(2);
  });

  it('getRequiredDateStringFormat() should return date from MM/dd/yyyy  format to MM/dd/yyyy format', function () {
    spyOn(DateService, 'getRequiredDateStringFormat').and.callThrough();
    expect(DateService.getRequiredDateStringFormat.calls.any()).toEqual(false);
    DateService.getRequiredDateStringFormat(date);
    expect(DateService.getRequiredDateStringFormat.calls.any()).toEqual(true);
    tempDate = '';
    DateService.getRequiredDateStringFormat(tempDate);
    expect(DateService.getRequiredDateStringFormat.calls.any()).toEqual(true);
    tempDate = '27/Jun/2016';
    DateService.getRequiredDateStringFormat(tempDate);
    expect(DateService.getRequiredDateStringFormat.calls.any()).toEqual(true);
    expect(DateService.getRequiredDateStringFormat.calls.count()).toEqual(3);
  });

  it('getRequiredDatePickerStringFormat() should return date from dd-MMM-yyyy format to MM/dd/yyyy format', function () {
    spyOn(DateService, 'getRequiredDatePickerStringFormat').and.callThrough();
    expect(DateService.getRequiredDatePickerStringFormat.calls.any()).toEqual(false);
    DateService.getRequiredDatePickerStringFormat(tempDate);
    expect(DateService.getRequiredDatePickerStringFormat.calls.any()).toEqual(true);
  });

  it('getDateInLocalTimeZone() should return milliseconds', function () {
    spyOn(DateService, 'getDateInLocalTimeZone').and.callThrough();
    expect(DateService.getDateInLocalTimeZone.calls.any()).toEqual(false);
    DateService.getDateInLocalTimeZone(milliseconds);
    expect(DateService.getDateInLocalTimeZone.calls.any()).toEqual(true);
    DateService.getDateInLocalTimeZone(milliseconds);
    milliseconds = '';
    DateService.getDateInLocalTimeZone(milliseconds);
    expect(DateService.getDateInLocalTimeZone.calls.any()).toEqual(true);
  });

  it('getMillisecondsInUTCTimeZone() should return  milliseconds', function () {
    date = new Date();
    spyOn(DateService, 'getMillisecondsInUTCTimeZone').and.callThrough();
    expect(DateService.getMillisecondsInUTCTimeZone.calls.any()).toEqual(false);
    DateService.getMillisecondsInUTCTimeZone(date);
    expect(DateService.getMillisecondsInUTCTimeZone.calls.any()).toEqual(true);
    date = '';
    DateService.getMillisecondsInUTCTimeZone(date);
    expect(DateService.getMillisecondsInUTCTimeZone.calls.any()).toEqual(true);
    expect(DateService.getMillisecondsInUTCTimeZone.calls.count()).toEqual(2);

  });

  it('getDateObjectFromBackendDateString() should return date ', function () {
    spyOn(DateService, 'getDateObjectFromBackendDateString').and.callThrough();
    expect(DateService.getDateObjectFromBackendDateString.calls.any()).toEqual(false);
    DateService.getDateObjectFromBackendDateString(dateObjectString);
    expect(DateService.getDateObjectFromBackendDateString.calls.any()).toEqual(true);
    dateObjectString = '';
    DateService.getDateObjectFromBackendDateString(dateObjectString);
    expect(DateService.getDateObjectFromBackendDateString.calls.any()).toEqual(true);
    expect(DateService.getDateObjectFromBackendDateString.calls.count()).toEqual(2);
  });

  it('getDateStringInDateFormatOne() should return date from dd-MMM-yyyy format to MM/dd/yyyy format', function () {
    spyOn(DateService, 'getDateStringInDateFormatOne').and.callThrough();
    expect(DateService.getDateStringInDateFormatOne.calls.any()).toEqual(false);
    DateService.getDateStringInDateFormatOne(dateObjectString);
    expect(DateService.getDateStringInDateFormatOne.calls.any()).toEqual(true);
    dateObjectString = '/Date(14/04/2016)/';
    DateService.getDateStringInDateFormatOne(dateObjectString);
    expect(DateService.getDateStringInDateFormatOne.calls.any()).toEqual(true);
  });

  it('getDateStringInDateFormatTwo () should return date string in yyyy-MM-dd format', function () {
    spyOn(DateService, 'getDateStringInDateFormatTwo').and.callThrough();
    expect(DateService.getDateStringInDateFormatTwo.calls.any()).toEqual(false);
    DateService.getDateStringInDateFormatTwo(dateObjectString);
    expect(DateService.getDateStringInDateFormatTwo.calls.any()).toEqual(true);
    dateObjectString = '';
    DateService.getDateStringInDateFormatTwo(dateObjectString);
    expect(DateService.getDateStringInDateFormatTwo.calls.any()).toEqual(true);
  });

  it('getDatePickerStringInDateFormatOne() should return date string in yyyy-MM-dd format', function () {
    dateObjectString = '/Date(14/04/2016)/';
    spyOn(DateService, 'getDatePickerStringInDateFormatOne').and.callThrough();
    expect(DateService.getDatePickerStringInDateFormatOne.calls.any()).toEqual(false);
    DateService.getDatePickerStringInDateFormatOne(dateObjectString);
    expect(DateService.getDatePickerStringInDateFormatOne.calls.any()).toEqual(true);
    dateObjectString = '';
    DateService.getDatePickerStringInDateFormatOne(dateObjectString);
    expect(DateService.getDatePickerStringInDateFormatOne.calls.any()).toEqual(true);
    expect(DateService.getDatePickerStringInDateFormatOne.calls.count()).toEqual(2);
  });

  it('getDateObjectFromString() should return date string in dd-MMM-yyyy format', function () {
    spyOn(DateService, 'getDateObjectFromString').and.callThrough();
    expect(DateService.getDateObjectFromString.calls.any()).toEqual(false);
    DateService.getDateObjectFromString(dateString);
    expect(DateService.getDateObjectFromString.calls.any()).toEqual(true);
    dateString = '';
    DateService.getDateObjectFromString(dateString);
    expect(DateService.getDateObjectFromString.calls.any()).toEqual(true);
    expect(DateService.getDateObjectFromString.calls.count()).toEqual(2);

  });

  it('getDateObjectFromDatePickerString() should return date ', function () {
    dateString = '4-27-2016';
    spyOn(DateService, 'getDateObjectFromDatePickerString').and.callThrough();
    expect(DateService.getDateObjectFromDatePickerString.calls.any()).toEqual(false);
    DateService.getDateObjectFromDatePickerString(dateString);
    expect(DateService.getDateObjectFromDatePickerString.calls.any()).toEqual(true);
    dateString = '';
    DateService.getDateObjectFromDatePickerString(dateString);
    expect(DateService.getDateObjectFromDatePickerString.calls.any()).toEqual(true);
    expect(DateService.getDateObjectFromDatePickerString.calls.count()).toEqual(2);
  });

  it('getNoOfDaysBetweenTwoDates() should return true ', function () {
    dateObjectString = '/Date(14/04/2016)/';
    spyOn(DateService, 'getNoOfDaysBetweenTwoDates').and.callThrough();
    expect(DateService.getNoOfDaysBetweenTwoDates.calls.any()).toEqual(false);
    DateService.getNoOfDaysBetweenTwoDates(dateObjectString, dateObjectString);
    expect(DateService.getNoOfDaysBetweenTwoDates.calls.any()).toEqual(true);
    dateObjectString = '';
    DateService.getNoOfDaysBetweenTwoDates(dateObjectString, dateObjectString);
    expect(DateService.getNoOfDaysBetweenTwoDates.calls.any()).toEqual(true);
    expect(DateService.getNoOfDaysBetweenTwoDates.calls.count()).toEqual(2);
  });

  it('getReportFormat() should return date string in YYYY-MMM-dd format', function () {
    dateString = '4-27-2016';
    spyOn(DateService, 'getReportFormat').and.callThrough();
    expect(DateService.getReportFormat.calls.any()).toEqual(false);
    DateService.getReportFormat(dateString);
    expect(DateService.getReportFormat.calls.any()).toEqual(true);
  });

  it('isDatesInAscending () should return true or false', function () {
    dateObjectString = new Date();
    spyOn(DateService, 'isDatesInAscending').and.callThrough();
    expect(DateService.isDatesInAscending.calls.any()).toEqual(false);
    DateService.isDatesInAscending(dateObjectString, dateObjectString);
    expect(DateService.isDatesInAscending.calls.any()).toEqual(true);
  });

  it('fnBackEndDateString() should return /Date(3490834432)/ string', function () {
    milliseconds = '0.003';
    spyOn(DateService, 'fnBackEndDateString').and.callThrough();
    expect(DateService.fnBackEndDateString.calls.any()).toEqual(false);
    DateService.fnBackEndDateString(milliseconds);
    expect(DateService.fnBackEndDateString.calls.any()).toEqual(true);
    milliseconds = '';
    DateService.fnBackEndDateString(milliseconds);
    expect(DateService.fnBackEndDateString.calls.any()).toEqual(true);
    expect(DateService.fnBackEndDateString.calls.count()).toEqual(2);
  });

  it('getDateDisplayString() should return date', function () {
    spyOn(DateService, 'getDateDisplayString').and.callThrough();
    expect(DateService.getDateDisplayString.calls.any()).toEqual(false);
    DateService.getDateDisplayString(dateSQL);
    expect(DateService.getDateDisplayString.calls.any()).toEqual(true);
  });

  it('getDateStringFromDate() should return date', function () {
    spyOn(DateService, 'getDateStringFromDate').and.callThrough();
    expect(DateService.getDateStringFromDate.calls.any()).toEqual(false);
    DateService.getDateStringFromDate(dateSQL);
    expect(DateService.getDateStringFromDate.calls.any()).toEqual(true);
  });

  it('getDateSQLFormat() should return date YYYYMMDD  format ', function () {
    milliseconds = '0.003';
    spyOn(DateService, 'getDateSQLFormat').and.callThrough();
    expect(DateService.getDateSQLFormat.calls.any()).toEqual(false);
    DateService.getDateSQLFormat(milliseconds);
    expect(DateService.getDateSQLFormat.calls.any()).toEqual(true);
    milliseconds = 'fsd';
    DateService.getDateSQLFormat(milliseconds);
    expect(DateService.getDateSQLFormat.calls.any()).toEqual(true);
    expect(DateService.getDateSQLFormat.calls.count()).toEqual(2);
  });

  it('getDateDISPFormat() should return date YYYYMMDD  format ', function () {
    milliseconds = '0.003';
    spyOn(DateService, 'getDateDISPFormat').and.callThrough();
    expect(DateService.getDateDISPFormat.calls.any()).toEqual(false);
    DateService.getDateDISPFormat(milliseconds);
    expect(DateService.getDateDISPFormat.calls.any()).toEqual(true);
    milliseconds = '';
    DateService.getDateDISPFormat(milliseconds);
    expect(DateService.getDateDISPFormat.calls.any()).toEqual(true);
    expect(DateService.getDateDISPFormat.calls.count()).toEqual(2);
  });

  it('getDateInISPFormat() should return date YYYYMMDD  format ', function () {
    spyOn(DateService, 'getDateInISPFormat').and.callThrough();
    expect(DateService.getDateInISPFormat.calls.any()).toEqual(false);
    DateService.getDateInISPFormat(dateSQL);
    expect(DateService.getDateInISPFormat.calls.any()).toEqual(true);
    dateSQL = '';
    DateService.getDateInISPFormat(dateSQL);
    expect(DateService.getDateInISPFormat.calls.any()).toEqual(true);
    expect(DateService.getDateInISPFormat.calls.count()).toEqual(2);
  });

  it('fnTimeStringToMs() should return date YYYYMMDD  format ', function () {
    spyOn(DateService, 'fnTimeStringToMs').and.callThrough();
    expect(DateService.fnTimeStringToMs.calls.any()).toEqual(false);
    DateService.fnTimeStringToMs(timeString);
    expect(DateService.fnTimeStringToMs.calls.any()).toEqual(true);
  });

  it('fnMsToTimeString() should return date YYYYMMDD  format ', function () {
    spyOn(DateService, 'fnMsToTimeString').and.callThrough();
    expect(DateService.fnMsToTimeString.calls.any()).toEqual(false);
    DateService.fnMsToTimeString(millisecondTime);
    expect(DateService.fnMsToTimeString.calls.any()).toEqual(true);

  });

});
