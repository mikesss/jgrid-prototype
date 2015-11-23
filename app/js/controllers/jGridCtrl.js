(function() {

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

        vm.selectGrid = function(x, y) {
            vm.x = x;
            vm.y = y;
        }

        var G = function(x, y) {
            return vm.gridValues[x][y];
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
                    var f   = new Function('G', 'f', vm.gridScripts[i][j]);
                    var val = f(G, fetch);
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
    }

    angular
        .module('jGrid')
        .controller('JGridCtrl', JGridCtrl);

})();