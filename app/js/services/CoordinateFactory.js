(function() {
    require('angular/angular');

    function CoordinateSetFactory() {
        var CoordinateSet = () => {

        };

        return {
            getInstance: () => return new CoordinateSet(),
        };
    }

    angular
        .module('jGrid')
        .factory('CoordinateSetFactory', CoordinateSetFactory);

})();