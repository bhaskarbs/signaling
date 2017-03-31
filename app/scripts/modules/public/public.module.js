'use strict';

/**
 * @ngdoc overview
 * @name saintApp
 * @description
 * # saintApp
 *
 * Main module of the application.
 */
angular
  .module('saintApp', [
    'ui.router','ui.bootstrap','icomps','ngLocalize','saint-config', 'common.providers'
  ])
  .config(['$stateProvider', '$urlRouterProvider', 'logServiceProvider', 'CookieServiceProvider', 'Environment', 'UrlServiceProvider', function ($stateProvider,$urlRouterProvider,logServiceProvider,CookieServiceProvider,Environment,UrlServiceProvider) {
    CookieServiceProvider.setCookieParsing();
    CookieServiceProvider.setOptions({'Environment':Environment});
    UrlServiceProvider.setOptions({'useFixture':false,'Environment':Environment});
    $urlRouterProvider.otherwise('/home');
    logServiceProvider.setLog(true);
    logServiceProvider.setLogLevel('INFO');
    $stateProvider
      .state('main',
      {
        abstract:true,
        views:
        {
          'headerNavigation@':
          {
            templateUrl:'views/public/header/header.html',
            controller:'LandingHeaderController'
          },
          'footerNavigation@': {
            templateUrl:'views/public/footer/footer.html'
          }
        }
      })
      .state('home',
      {
        parent:'main',
        url: '/home',
        views:
        {
          'main@':
          {
            templateUrl: 'views/public/home/home.html',
            controller: 'LandingController'
          }
        }
      })
      .state('login',
      {
        parent:'main',
        url: '/login',
        views:
        {
          'main@':
          {
            templateUrl: 'views/public/login/login.html',
            controller: 'LoginController'
          }
        }
      })
      .state('loginError',
      {
        parent:'main',
        url: '/loginError',
        views:
        {
          'main@':
          {
            template: '',
            controller: 'LoginErrorController'
          }
        }
      });
  }]).run(['loaderService', 'CookieService', 'UrlService',function(LoaderService, CookieService, UrlService){
      angular.element(document).ready(function(){
        if(CookieService.get('application') && CookieService.get('application').length>0){
          window.location.href = UrlService.getView('APP');
        }else{
          angular.element('.dsui').removeAttr('style');
          LoaderService.stop();
        }
      });
  }]);
