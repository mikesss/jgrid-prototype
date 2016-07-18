(function() {
    require('angular/angular');

    function GridSelectorService() {
        var columnLetterToIndex = (letter) => {
            return letter.codePointAt(0) - 65;
        };

        return {

            toCoordSet: function(sel) {
                var sets    = [];
                var areas   = sel.split(',');

                for(var i = 0; i < areas.length; i++) {
                    var range   = areas[i].trim().split(':');
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
                        if(!end) {
                            end = start;
                        }
                        
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

                return sets;
            },

            pointIsInSelector: function(x, y, sel) {
                var sets    = [];
                var areas   = sel.split(',');

                for(var i = 0; i < areas.length; i++) {
                    var range   = areas[i].trim().split(':');
                    var start   = range[0];
                    var end     = range[1];

                    if(start.match(/^\d$/)) {
                        if(y >= Number(start) - 1 && y <= Number(end) - 1) {
                            return true;
                        }
                    } else if(start.match(/^\w$/)) {
                        if(x >= columnLetterToIndex(start) && x <= columnLetterToIndex(end)) {
                            return true;
                        }
                    } else if(start.match(/^\w\d$/)) {
                        if(!end) {
                            end = start;
                        }
                        
                        var x1 = columnLetterToIndex(start[0]);
                        var y1 = Number(start[1]) - 1;
                        var x2 = columnLetterToIndex(end[0]);
                        var y2 = Number(end[1]) - 1;

                        if(x >= x1 && x <= x2 && y >= y1 && y <= y2) {
                            return true;
                        }
                    }
                }

                return false;
            },

            pointIsInSelectorList: function(x, y, sels) {
                if(!sels) {
                    return false;
                }

                for(var i = 0; i < sels.length; i++) {
                    if(this.pointIsInSelector(x, y, sels[i])) {
                        return true;
                    }
                }

                return false;
            },

            colIsInSelector: function(x, sel) {
                var sets    = [];
                var areas   = sel.split(',');

                for(var i = 0; i < areas.length; i++) {
                    var range   = areas[i].trim().split(':');
                    var start   = range[0];
                    var end     = range[1];

                    if(start.match(/^\w$/)) {
                        if(x >= columnLetterToIndex(start) && x <= columnLetterToIndex(end)) {
                            return true;
                        }
                    }
                }

                return false;                
            },

            colIsInSelectorList: function(x, sels) {
                if(!sels) {
                    return false;
                }

                for(var i = 0; i < sels.length; i++) {
                    if(this.colIsInSelector(x, sels[i])) {
                        return true;
                    }
                }

                return false;
            },

            rowIsInSelector: function(y, sel) {
                var sets    = [];
                var areas   = sel.split(',');

                for(var i = 0; i < areas.length; i++) {
                    var range   = areas[i].trim().split(':');
                    var start   = range[0];
                    var end     = range[1];

                    if(start.match(/^\d$/)) {
                        if(y >= Number(start) - 1 && y <= Number(end) - 1) {
                            return true;
                        }
                    }
                }

                return false;                
            },

            rowIsInSelectorList: function(y, sels) {
                if(!sels) {
                    return false;
                }

                for(var i = 0; i < sels.length; i++) {
                    if(this.rowIsInSelector(y, sels[i])) {
                        return true;
                    }
                }

                return false;
            },
        };
    }

    angular
        .module('jGrid')
        .factory('GridSelectorService', GridSelectorService);

})();