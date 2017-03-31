'use strict';
angular.module('saintApp').provider('DateService', [function () {
  return {
    '$get': ['$filter', function ($filter) {
      var dateService = function () {
      };
      dateService.dateFormat = 'dd-MMM-yyyy';
      dateService.datePickerFormat = 'MM/dd/yyyy';
      dateService.displayDateFormat = 'MMM dd yyyy';
      dateService.months={ 'Jan':1, 'Feb':2, 'Mar':3, 'Apr':4, 'May':5, 'Jun':6, 'Jul':7, 'Aug':8, 'Sep':9, 'Oct':10, 'Nov':11, 'Dec':12};

      //Input is Date Object and Returns the string for date in format dd-MMM-yyyy
      dateService.getFormattedDateStringFromDateObject = function (dateObject) {
        if (angular.isDate(dateObject)) {
          var formattedDate = $filter('date')(dateObject, dateService.dateFormat);
          return formattedDate;
        } else {
          return null;
        }
      };
      //Input is Date Object and Returns the string for date in format yyyy-MM-dd
      dateService.getFormattedDateStringTwoFromDateObject = function (dateObject) {
        if (angular.isDate(dateObject)) {
          var formattedDate = $filter('date')(dateObject, 'yyyy-MM-dd');
          return formattedDate;
        } else {
          return null;
        }
      };
      //Input is Date Object and Returns the string for date in format MM/dd/yyyy
      dateService.getFormattedDatePickerStringFromDateObject = function (dateObject) {
        if (angular.isDate(dateObject)) {
          var formattedDate = $filter('date')(dateObject, dateService.datePickerFormat);
          return formattedDate;
        } else {
          return null;
        }
      };

      //Input is the date string in dd-MMM-yyyy format and returns the date string in MM/dd/yyyy format
      dateService.getRequiredDateStringFormat = function (tempDateString) {
        if (tempDateString && tempDateString.length > 0) {
          var dateDetails = tempDateString.split('-');
          var month = dateService.months[dateDetails[1]];
          var temp = month + '/' + dateDetails[0] + '/' + dateDetails[2];
          return temp;
        } else {
          return null;
        }
      };

      //Input is the date string in MM/dd/yyyy format and returns the date string in MM/dd/yyyy format
      dateService.getRequiredDatePickerStringFormat = function (tempDateString) {
        return tempDateString;
      };

      // Conversion from UTC to Local Time zone, input is milliseconds and output is dateObject
      dateService.getDateInLocalTimeZone = function (milliseconds) {
        if (milliseconds) {
          var utcDate = new Date(milliseconds);
          var localDate = new Date(utcDate.getUTCFullYear(), utcDate.getUTCMonth(), utcDate.getUTCDate(), utcDate.getUTCHours(), utcDate.getUTCMinutes(), utcDate.getUTCSeconds(), utcDate.getUTCMilliseconds());
          return localDate;
        } else {
          return null;
        }
      };

      // Conversion from local to UTC Time zone, input is dateObject and output is milliseconds
      dateService.getMillisecondsInUTCTimeZone = function (dateObject) {
        if (dateObject) {
          var utcDate = Date.UTC(dateObject.getFullYear(), dateObject.getMonth(), dateObject.getDate(), dateObject.getHours(), dateObject.getMinutes(), dateObject.getSeconds(), dateObject.getMilliseconds());
          return utcDate;
        } else {
          return null;
        }
      };

      // Returns the Date Object from input string '/Date(dateLong)/'
      dateService.getDateObjectFromBackendDateString = function (dateObjectString) {
        if (dateObjectString) {
          var milliseconds = parseInt(dateObjectString.split('/Date(')[1].split(')/')[0]);
          var localDate = dateService.getDateInLocalTimeZone(milliseconds);
          return localDate;
        } else {
          return null;
        }
      };

      // Returns the Date string in dd-MMM-yyyy from input string '/Date(dateLong)/'
      dateService.getDateStringInDateFormatOne = function (dateObject) {
        if (dateObject) {
          var localDate = dateService.getDateObjectFromBackendDateString(dateObject);
          return dateService.getFormattedDateStringFromDateObject(localDate);
        } else {
          return null;
        }
      };
      // Returns the Date string in yyyy-MM-dd from input string '/Date(dateLong)/'
      dateService.getDateStringInDateFormatTwo = function (dateObject) {
        if (dateObject) {
          var localDate = dateService.getDateObjectFromBackendDateString(dateObject);
          return dateService.getFormattedDateStringTwoFromDateObject(localDate);
        } else {
          return null;
        }
      };
      // Returns the Date string in MM/dd/yyyy from input string '/Date(dateLong)/'
      dateService.getDatePickerStringInDateFormatOne = function (dateObject) {
        if (dateObject) {
          var localDate = dateService.getDateObjectFromBackendDateString(dateObject);
          return dateService.getFormattedDatePickerStringFromDateObject(localDate);
        } else {
          return null;
        }
      };

      // Input is Date string in format dd-MMM-yyyy and Returns the date object
      dateService.getDateObjectFromString = function (dateString) {
        var tempString = dateService.getRequiredDateStringFormat(angular.copy(dateString));
        if (tempString && tempString.length > 0) {
          return new Date(tempString);
        } else {
          return null;
        }
      };
      // Input is Date string in format MM/dd/yyyy and Returns the date object
      dateService.getDateObjectFromDatePickerString = function (dateString) {
        var tempString = dateService.getRequiredDatePickerStringFormat(angular.copy(dateString));
        if (tempString && tempString.length > 0) {
          return new Date(tempString);
        } else {
          return null;
        }
      };

      // Returns the number of days between two dates, both the dates are in form '/Date(dateLong)/'
      dateService.getNoOfDaysBetweenTwoDates = function (source, destination) {
        if (source && destination) {
          var perDay = 86400000, noOfDays = 0;
          source = dateService.getDateObjectFromBackendDateString(source);
          destination = dateService.getDateObjectFromBackendDateString(destination);
          noOfDays = Math.floor((destination.getTime() - source.getTime()) / perDay);
          return noOfDays;
        } else {
          return null;
        }
      };

      /*Returns the number of Hours between two dates, both are in '/Date(dateLong)/' format*/
      dateService.getNoOfHoursBetweenTwoDates = function(source,destination){
        if (source && destination) {
        var perHour =3600000 , noOfHours = 0;
          source = dateService.getUTCDateFromBackendDateString(source);
          destination = dateService.getUTCDateFromDateObject(destination);
        noOfHours = Math.floor((destination.getTime() - source.getTime()) / perHour);
        return noOfHours;
      } else {
        return null;
      }
      };

      dateService.returnNoOfDaysBetweenTwoDates = function (source, destination) {
        if (source && destination) {
          var perDay = 86400000, noOfDays = 0;
          source = dateService.getUTCDateFromBackendDateString(source);
          destination = dateService.getUTCDateFromDateObject(destination);
          noOfDays = Math.floor((destination.getTime() - source.getTime()) / perDay);
          return noOfDays;
        } else {
          return null;
        }
      };
      //Returns the number of months between two dates, both are in '/Date(dateLong)/' format
      dateService.getNoOfMonthsBetweenTwoDates = function(source,destination){
        if (source && destination) {
          var perMonth =null, noOfMonths = 0;
          perMonth = 86400000 * dateService.fnNumberOfDaysInAMonth(destination);
          source = dateService.getUTCDateFromBackendDateString(source);
          destination = dateService.getUTCDateFromDateObject(destination);
          noOfMonths = Math.floor((destination.getTime() - source.getTime()) / perMonth);
          return noOfMonths;
        } else {
          return null;
        }
      };

      //Returns the number of minutes between two dates, both are in '/Date(dateLong)/' format
      dateService.getNoOfMinutesBetweenTwoDates = function(source,destination){
        if (source && destination) {
          var perMinute = 60000, noOfMinutes = 0;
          source = dateService.getUTCDateFromBackendDateString(source);
          destination = dateService.getUTCDateFromDateObject(destination);
          noOfMinutes = Math.floor((destination.getTime() - source.getTime()) / perMinute);
          return noOfMinutes;
        } else {
          return null;
        }
      };
      // Returns the date in YYYY-MMM-dd format from the input format dd-MMM-YYYY
      dateService.getReportFormat = function (dateString) {
        if (dateString) {
          var date = dateString.split('-');
          return date[2] + '-' + date[1] + '-' + date[0];
        }
      };
      // Returns the true or false, both the dates are dateObject '
      dateService.isDatesInAscending = function (source, destination) {
        return source.getTime() < destination.getTime();
      };

      //Returns '/Date(3490834432)/' string, and input is milliseconds of date object
      dateService.fnBackEndDateString = function (milliseconds) {
        if (milliseconds) {
          return '/Date(' + milliseconds + ')/';
        } else {
          return milliseconds;
        }
      };
      dateService.getDateDisplayString = function (date) {
        var d = new Date(date);
        var dString = $filter('date')(d, dateService.displayDateFormat);
        return dString;
      };
      dateService.getDateStringFromDate = function (date) {
        var d = new Date(date);
        var dString = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        return dString;
      };
      dateService.getDateSQLFormat = function (d) { //computes the date in SQL INTEGER format. DB requires the date to be in YYYYMMDD format. Expects input as date in milliseconds
        if (isNaN(parseInt(d))) { return 'undefined'; }
        var dateSQL = '';
        var dateObj = new Date(parseInt(d));
        dateSQL += dateObj.getUTCFullYear() + '-' + (dateObj.getUTCMonth() < 10 ? ('0' + dateObj.getUTCMonth()) : dateObj.getUTCMonth()) + '-' + (dateObj.getUTCDate() < 10 ? ('0' + dateObj.getUTCDate()) : dateObj.getUTCDate());
        return dateSQL;
      };
      dateService.getDateDISPFormat = function (d) { //computes the date for display purpose. Eg. '4 MAR 2013' Expects input as date in milliseconds
        if (isNaN(parseInt(d))) { return 'undefined'; }
        var dateDisp = '';
        var dateObj = new Date(parseInt(d));
        var splitDateArr = dateObj.toDateString().split(' '); //convert the date to String and split it into day Month date year.
        dateDisp += splitDateArr[2] + ' ' + splitDateArr[1] + ' ' + splitDateArr[3]; // Take Date month and year
        return '\'' + dateDisp + '\'';
      };

      dateService.getDateInISPFormat = function (date) { //computes the date for display purpose. Eg. '4-MAR-2013' Expects input as date in milliseconds
        if (isNaN(parseInt(date))) { return 'undefined'; }
        var dateDisp = '';
        var dateObj = new Date(parseInt(date));
        var splitDateArr = dateObj.toDateString().split(' '); //convert the date to String and split it into day Month date year.
        dateDisp += splitDateArr[2] + '-' + splitDateArr[1] + '-' + splitDateArr[3]; // Take Date month and year
        return dateDisp;
      };

      dateService.fnTimeStringToMs = function (timeString) {   // your input string
        var a = timeString.split(':'); // split it at the colons
        // minutes are worth 60 seconds. Hours are worth 60 minutes.
        return ((((+a[0]) * 60 * 60 + (+a[1]) * 60 ) * 1000));
      };

      dateService.fnMsToTimeString = function (millisecondTime) {   // your input string
        // split it at the colons
        return $filter('date')(new Date(millisecondTime), 'HH:mm', 'UTC');
      };

      //Function to return the number of days in a month
      dateService.fnNumberOfDaysInAMonth = function(dateString){
        var noOfDays = new Date(dateString.getYear(), dateString.getMonth(), 0).getDate();
        return noOfDays;
      };
      dateService.getUTCDateFromBackendDateString = function(obj){
        if(obj){
          var milli = parseInt(obj.split('/Date(')[1].split(')/')[0]);
          var utcDate = new Date(milli);
          var localDate = new Date(utcDate.getUTCFullYear(), utcDate.getUTCMonth(), utcDate.getUTCDate(), utcDate.getUTCHours(), utcDate.getUTCMinutes(), utcDate.getUTCSeconds(), utcDate.getUTCMilliseconds());
          return localDate;
        }
        else{
          return null;
        }
       };
      dateService.getUTCDateFromDateObject = function(utcDate){
        if(utcDate){
          var localDate = new Date(utcDate.getUTCFullYear(), utcDate.getUTCMonth(), utcDate.getUTCDate(), utcDate.getUTCHours(), utcDate.getUTCMinutes(), utcDate.getUTCSeconds(), utcDate.getUTCMilliseconds());
          return localDate;
        }
        else{
          return null;
        }
      };
      return dateService;
    }]
  };
}]);
