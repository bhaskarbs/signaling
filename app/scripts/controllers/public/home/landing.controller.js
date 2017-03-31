'use strict';
/**
 * @ngdoc function
 * @name saintApp.controller.unauth:LandingController
 * @description
 * # LandingController
 * Controller of the saintApp
 */
angular.module('saintApp')
.controller('LandingController',['$scope', function (scope) {
    scope.home={slides:[],slideInterval:10000};
    scope.home.slides=[{
      'image':'images/public/home/img-slide-01.jpg',
      'text':'public-home.BUNDLE_SLIDE1_TEXT_KEY',
      'tag':'public-home.BUNDLE_SLIDE1_CAPTION_TEXT_KEY',
      'active':true
    }, {
      'image':'images/public/home/img-slide-02.jpg',
      'text':'public-home.BUNDLE_SLIDE2_TEXT_KEY',
      'tag':'public-home.BUNDLE_SLIDE2_CAPTION_TEXT_KEY',
      'active':false
    },{
      'image':'images/public/home/img-slide-03.jpg',
      'text':'public-home.BUNDLE_SLIDE3_TEXT_KEY',
      'tag':'public-home.BUNDLE_SLIDE3_CAPTION_TEXT_KEY',
      'active':false
    }];
}]);
