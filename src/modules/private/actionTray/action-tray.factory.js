(function () {
    'use strict';
    angular.module('saintApp')
        .factory('ActionTrayFactory', [function () {
            var counter = 0;
            return {
                setCounter: function () {
                    counter++;
                },
                getCounter: function () {
                    return counter;
                }
            };
        }]);
})();
