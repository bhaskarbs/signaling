'use strict';
angular.module('common.providers',[]);
angular.module('common.providers').provider('CookieService',[ function () {
  var _options = {
    'Environment':null
  };
  return {
    'setOptions': function (options) {
      if (options) {
        if (options.hasOwnProperty('Environment')) {
          _options.Environment = options.Environment;
        }
      }
    },
    //By default the cookie value is encoded/decoded when writing/reading, using encodeURIComponent/decodeURIComponent. Bypass this by setting raw to true
    'setAvoidCookieEncoding':function(){
      $.cookie.raw = true;
    },
    //Turn on automatic storage of JSON objects passed as the cookie value. Assumes JSON.stringify and JSON.parse
    'setCookieParsing':function(){
      $.cookie.json = true;
    },
    '$get': function () {
      var cookie = function() {
      };
      //Session Cookie
      cookie.put=function(cookieName,cookieValue){
        $.cookie(cookieName, cookieValue, {'secure' : _options.Environment.isHttps});
      };
      //Cookie will expire after 365 days
      cookie.store=function(cookieName,cookieValue){
        $.cookie(cookieName, cookieValue, { expires: 365 , 'secure' : _options.Environment.isHttps });
      };
      //Reading a Cookie
      cookie.get=function(cookieName){
        return $.cookie(cookieName);
      };
      //Removing a cookie
      cookie.remove=function(cookieName){
        $.removeCookie(cookieName);
      };
      //Retrieves all the cookies in the form of key value pairs
      cookie.getAll=function(){
        return $.cookie();
      };
      return cookie;
    }
  };
}]);
