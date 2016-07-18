(function() {
    require('angular/angular');
    var http = require('http');

    function SheetDataService(GridSelectorService) {
        var map = {},

            getScript = function(x, y) { 
                if(x in map) {
                    if(y in map[x]) {
                        return map[x][y].src;
                    }
                }

                return null;
            },

            setScript = function(x, y, script) { 
                if(!(x in map)) {
                    map[x] = {};
                    map[x][y] = { src: script };
                }

                if(!(y in map[x])) {
                    map[x][y] = { src: script };
                } else {
                    map[x][y].src = script;
                }
            },

            getValue = function(x, y) {
                if(x in map) {
                    if(y in map[x]) {
                        return map[x][y].val;
                    }
                }

                return null;
            },

            getError = function(x, y) {
                if(x in map) {
                    if(y in map[x]) {
                        return map[x][y].error;
                    }
                }

                return null;
            },

            getRelatedSelectors = function(x, y) {
                if(x in map) {
                    if(y in map[x]) {
                        return map[x][y].relatedSelectors || [];
                    }
                }

                return [];
            },

            mapFromCoordSet = function(set, f) {
                var results = [];
                for(var i = 0; i < set.length; i++) {

                    if(set[i].type == 'row') {
                        for(var y = set[i].start; y <= set[i].end; y++) {
                            for(x in map) {
                                var r = f(x, y);
                                if(r) {
                                    results.push(r);
                                }
                            }
                        }
                    } else if(set[i].type == 'col') {
                        for(var x = set[i].start; x <= set[i].end; x++) {
                            for(y in map[x]) {
                                var r = f(x, y);
                                if(r) {
                                    results.push(r);
                                }
                            }
                        }
                    } else if(set[i].type == 'cell') {
                        for(var y = set[i].start.y; y <= set[i].end.y; y++) {
                            for(var x = set[i].start.x; x <= set[i].end.x; x++) {
                                var r = f(x, y);
                                if(r) {
                                    results.push(r);
                                }
                            }
                        }
                    }

                }

                return results;
            },

            mapValuesFromCoordSet = function(set) {
                return mapFromCoordSet(set, getValue);
            },

            pointIsInCoordSet = function(x0, y0, set) {
                if(!set) {
                    return false;
                }
                var booleans = mapFromCoordSet(set, function(x, y) { return x == x0 && y == y0; });
                return booleans.indexOf(true) >= 0;
            };

        return {
            getScript: function(x, y) {
                return getScript(x, y);
            },

            getScriptBySel: function(sel) {
                var coordSet = GridSelectorService.toCoordSet(sel);
                if(coordSet.count == 1) {
                    var x = coordSet.col,
                        y = coordSet.rowStart;

                    return getScript(x, y);
                } else if(coordSet.count > 1) {

                }
            },

            getValue: function(x, y) {
                return getValue(x, y);
            },

            getValueBySel: function(sel) {
                var coordSet = GridSelectorService.toCoordSet(sel);

                return mapValuesFromCoordSet(coordSet);
            },

            getError: function(x, y) {
                return getError(x, y);
            },

            getRelatedSelectors: function(x, y) {
                return getRelatedSelectors(x, y);
            },

            setScript: function(x, y, script) {
                setScript(x, y, script);
            },

            setScriptBySel: function(sel, script) {
                var coordSet = GridSelectorService.toCoordSet(sel);
                if(coordSet.count == 1) {
                    var x = coordSet.col,
                        y = coordSet.rowStart;

                    return setScript(x, y, script);
                }

            },

            cellIsDependentOn: function(x1, y1, x2, y2) {
                var selectorsFrom2  = getRelatedSelectors(x2, y2),
                    coordSet        = null;

                for(var j = 0; j < selectorsFrom2.length; j++) {
                    coordSet = GridSelectorService.toCoordSet(selectorsFrom2[j]);
                    if(pointIsInCoordSet(x1, y1, coordSet)) {
                        return true;
                    }
                }

                return false;
            },

            computeValues: function() {
                var that        = this,
                    hasChanged  = false;

                angular.forEach(map, function(x) {
                    angular.forEach(x, function(y) {
                        // we catch and store any exceptions that occur
                        try {
                            // create function for the cell and evaluate it
                            var f       = new Function('G', 'R', 'http', y.src);
                            var val     = f(that.getValue, that.getValueBySel, http);
                            var error   = null;

                            if(val instanceof Promise) {
                                // if the computed value is a promise (such as from http)
                                // then we need to do something special here
                                val.then((v) => y.val = v).catch((e) => console.error(e));
                            }
                        } catch(e) {
                            error = e;
                            val = null;
                        }

                        hasChanged  = hasChanged || !angular.equals(y.val, val) || !angular.equals(y.error, error);
                        y.val       = val;
                        y.error     = error;

                        if(y.src != null) {
                            var re = /R\('(.*?)'\)/g;
                            var matches, groups = [];
                            while(matches = re.exec(y.src)) {
                                groups.push(matches[1]);
                            }

                            y.relatedSelectors = groups;
                        }
                    });
                });

                return { hasChanged: hasChanged };
            },

            saveToLocalStorage: function() {
                window.localStorage.setItem('sheet1', JSON.stringify(map));
            },

            loadFromLocalStorage: function() {
                var savedMap = window.localStorage.getItem('sheet1');
                if (savedMap !== null) {
                    map = JSON.parse(savedMap);
                }
            }
        };
    }

    angular
        .module('jGrid')
        .factory('SheetDataService', SheetDataService);

})();