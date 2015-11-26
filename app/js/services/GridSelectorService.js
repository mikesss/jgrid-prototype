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
                var sets    = [];
                var areas   = sel.split(',');

                for(var i = 0; i < areas.length; i++) {
                    var range   = sel.split(':');
                    var start   = range[0];
                    var end     = range[1];

                    if(start.match(/^\d$/)) {
                        sets.push({
                            type    : 'row',
                            start   : Number(start) - 1,
                            end     : Number(end) - 1,
                        });
                    } else if(start.match(/^\w$/)) {
                        sets.push({
                            type    : 'col',
                            start   : columnLetterToIndex(start),
                            end     : columnLetterToIndex(end),
                        });
                    } else if(start.match(/^\w\d$/)) {
                        var x1 = columnLetterToIndex(start[0]);
                        var y1 = Number(start[1]) - 1;
                        var x2 = columnLetterToIndex(end[0]);
                        var y2 = Number(end[1]) - 1;

                        sets.push({
                            type    : 'cell',
                            start   : { x: x1, y: y1 },
                            end     : { x: x2, y: y2 },
                        });
                    }
                }

                console.log(sets);
                return sets;
            },

            toSel: (coords) => {

            }
        };
    }

    angular
        .module('jGrid')
        .factory('GridSelectorService', GridSelectorService);

})();