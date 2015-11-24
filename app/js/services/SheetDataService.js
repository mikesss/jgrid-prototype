(function() {
    require('angular/angular');

    function SheetDataService(GridSelectorService) {
        var data = {
            map: {},

            getScript: function(x, y) { 
                if(x in this.map) {
                    if(y in this.map[x]) {
                        return this.map[x][y].src;
                    }
                }

                return null;
            },

            setScript: function(x, y, script) { 
                if(!(x in this.map)) {
                    this.map[x] = {};
                    this.map[x][y] = { src: script };
                }

                if(!(y in this.map)) {
                    this.map[x][y] = { src: script };
                } else {
                    this.map[x][y].src = script;
                }
            },

            getValue: function(x, y) {
                if(x in this.map) {
                    if(y in this.map[x]) {
                        return this.map[x][y].val;
                    }
                }

                return null;
            },
        };

        return  {
            getScript: function(x, y) {
                return data.getScript(x, y);
            },

            getScriptBySel: function(sel) {
                var coordSet = GridSelectorService.toCoordSet(sel);
                if(coordSet.count == 1) {
                    var x = coordSet.col,
                        y = coordSet.rowStart;

                    return data.getScript(x, y);
                } else if(coordSet.count > 1) {

                }
            },

            getValue: function(x, y) {
                return data.getValue(x, y);
            },

            getValueBySel: function(sel) {
                var coordSet = GridSelectorService.toCoordSet(sel);
                if(coordSet.count == 1) {
                    var x = coordSet.col,
                        y = coordSet.rowStart;

                    return data.getValue(x, y);
                } else if(coordSet.count > 1) {
                    var vals = [];
                    for(var i = coordSet.rowStart; i <= coordSet.rowEnd; i++) {
                        vals.push(data.getValue(coordSet.col, i));
                    }

                    return vals;
                }
            },

            setScript: function(x, y, script) {
                data.setScript(x, y, script);
            },

            setScriptBySel: function(sel, script) {
                var coordSet = GridSelectorService.toCoordSet(sel);
                if(coordSet.count == 1) {
                    var x = coordSet.col,
                        y = coordSet.rowStart;

                    return data.setScript(x, y, script);
                }

            },

            computeValues: function() {
                var that = this;

                angular.forEach(data.map, function(x) {
                    angular.forEach(x, function(y) {
                        var f   = new Function('G', 'R', y.src);
                        var val = f(that.getValue, that.getValueBySel);

                        if(val instanceof Promise) {
                            val.then((v) => y.val = v).catch((e) => console.error(e));
                        } else {
                            y.val = val;
                        }
                    });
                });
            }
        };
    }

    angular
        .module('jGrid')
        .factory('SheetDataService', SheetDataService);

})();