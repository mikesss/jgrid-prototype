(function() {
    require('angular/angular');

    function JGridCtrl($scope) {
        var vm          = this;
        var initArray   = function() {
            var arr = new Array(vm.gridY);
            for(var i = 0; i < vm.gridY; i++) {
                arr[i] = new Array(vm.gridX);
                for(var j = 0; j < vm.gridX; j++) {
                    arr[i][j] = null;
                }
            }

            return arr;
        };

        vm.gridX        = 10;
        vm.gridY        = 10;
        vm.gridScripts  = initArray();
        vm.gridValues   = initArray();
        vm.x            = 0;
        vm.y            = 0;
        
        var savedScripts = window.localStorage.getItem('sheet1');
        if (savedScripts !== null) {
            vm.gridScripts = JSON.parse(savedScripts);
        }

        vm.selectGrid = function(x, y) {
            vm.x = x;
            vm.y = y;
        }

        var G = function(x, y) {
            return vm.gridValues[x][y];
        }

        var _columnLetterToIndex = function (letter) {
            return letter.codePointAt(0) - 65;
        }

        var R = function (selector) {
            if (typeof selector !== 'string' || selector.indexOf(':') === -1) {
                console.error('bad selector syntax');
                return [];
            }

            // TODO: Allow different types of separators
            var selectorPieces = selector.split(':');

            // TODO: Allow more than two cell references in a selector
            if (selectorPieces.length !== 2) {
                console.error('bad selector syntax');
                return [];
            }

            var selectorStart = selectorPieces[0];
            var selectorEnd = selectorPieces[1];

            // TODO: Allow referencing different columns for start and end part of range
            var column = _columnLetterToIndex(selectorStart[0]);

            var rowstart = Number.parseInt(selectorStart.slice(1));
            var rowend = Number.parseInt(selectorEnd.slice(1));

            return vm.gridValues[column].slice(rowstart, rowend + 1);
        }

        var promiseResolve = function(x, y) {
            return function(v) {
                console.log(x, y);
                vm.gridValues[x][y] = v;
                $scope.$apply();
            }
        }

        $scope.$watch('vm.gridScripts', function() {
            for(var i = 0; i < vm.gridScripts.length; i++) {
                for(var j = 0; j < vm.gridScripts[i].length; j++) {
                    var f   = new Function('G', 'R', vm.gridScripts[i][j]);
                    var val = f(G, R);
                    if(val instanceof Promise) {
                        val.then(promiseResolve(j, i)).catch(function(e) {
                            console.error(e);
                        });
                    } else {
                        vm.gridValues[j][i] = val;
                    }
                }
            }
        }, true);

        $scope.$watch('vm.gridScripts', function() {
            window.localStorage.setItem('sheet1', JSON.stringify(vm.gridScripts));
        }, true);
    }

    angular
        .module('jGrid')
        .controller('JGridCtrl', JGridCtrl);

})();