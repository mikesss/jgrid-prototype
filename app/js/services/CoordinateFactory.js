(function() {
    require('angular/angular');

    function CoordinateSetFactory() {
        var CoordinateSet = function() {

        };

        CoordinateSet.getType = function() {

        };

        return {
            getInstance: () => return new CoordinateSet(),
        };
    }

    angular
        .module('jGrid')
        .factory('CoordinateSetFactory', CoordinateSetFactory);

})();