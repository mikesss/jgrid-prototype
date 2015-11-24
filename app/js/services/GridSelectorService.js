(function() {
    require('angular/angular');

    function GridSelectorService() {
        var columnLetterToIndex = (letter) => {
            return letter.codePointAt(0) - 65;
        };

        return {
            /*
             * { count: n, rowStart: n, rowEnd: n, col: n } ??????
             */
            toCoordSet: function(sel) {
                if (typeof selector !== 'string' || selector.indexOf(':') === -1) {
                    console.error('bad selector syntax');
                    return { count: 0 };
                }

                // TODO: Allow different types of separators
                var selectorPieces = selector.split(':');

                // TODO: Allow more than two cell references in a selector
                if (selectorPieces.length !== 2) {
                    console.error('bad selector syntax');
                    return { count: 0 };
                }

                var selectorStart = selectorPieces[0];
                var selectorEnd = selectorPieces[1];

                // TODO: Allow referencing different columns for start and end part of range
                var column = _columnLetterToIndex(selectorStart[0]);

                var rowstart = Number.parseInt(selectorStart.slice(1));
                var rowend = Number.parseInt(selectorEnd.slice(1));

                return { count: rowend - rowstart + 1, rowStart: rowstart, rowEnd: rowend, col: column };
            },

            toSel: (coords) => {

            }
        };
    }

    angular
        .module('jGrid')
        .factory('GridSelectorService', GridSelectorService);

})();