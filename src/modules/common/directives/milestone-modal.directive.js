'use strict';
angular.module('saintApp')
  .directive('milestoneModal',function () {
return{
  scope:{
    markMilestone:'&',
    cancelMilestoneModal:'&'
  },
  templateUrl:'views/private/milestone-modal/milestone-modal-popup.html',
  link: function(scope) {
    scope.markMilestoneComplete=function(){
      scope.markMilestone();
    };
    scope.cancelMilestone=function(){
      scope.cancelMilestoneModal();
    };
  }};});
