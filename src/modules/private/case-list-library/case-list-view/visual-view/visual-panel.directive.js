'use strict';
angular.module('saintApp')
    .directive('visualPanel', [function() {
        return {
            scope: {
                type: '=',
                name: '=',
                dimension: '=',
                size: '=',
                data: '='
            },
            controller: 'VisualPanelController',
            templateUrl: 'views/private/case-list-library/case-list-view/visual-view/visual-panel.html'
        };
    }]);
