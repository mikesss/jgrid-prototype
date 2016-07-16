(function() {
    require('angular/angular');

    function JGridCtrl($scope, $interval, SheetDataService) {
        var vm              = this;

        SheetDataService.loadFromLocalStorage();

        vm.gridX                = new Array(10);
        vm.gridY                = new Array(10);
        vm.x                    = 0;
        vm.y                    = 0;
        vm.selectedScript       = SheetDataService.getScript(0, 0);
        vm.updateDelay          = 100;
        vm.activeUpdateCycle    = null;

        vm.selectGrid = function(x, y) {
            vm.x = x;
            vm.y = y;
            vm.selectedScript = SheetDataService.getScript(x, y);
        };

        vm.getValue = function(x, y) {
            return SheetDataService.getValue(x, y);
        };

        vm.getError = function(x, y) {
            return SheetDataService.getError(x, y);
        }

        $scope.$watch('vm.selectedScript', function() {
            SheetDataService.setScript(vm.x, vm.y, vm.selectedScript);

            // if there's a current update cycle, stop it
            if(vm.activeUpdateCycle) {
                $interval.cancel(vm.activeUpdateCycle);
            }

            // do an update right now, if it causes changes then start a cycle
            if(SheetDataService.computeValues().hasChanged) {
                vm.activeUpdateCycle = $interval(function() {
                    var hasChanged = SheetDataService.computeValues().hasChanged;
                    console.log(hasChanged);
                    if(!hasChanged) {
                        // once nothing in the sheet has changed, kill the cycle
                        $interval.cancel(vm.activeUpdateCycle);
                        vm.activeUpdateCycle = null;
                    }
                    
                    SheetDataService.saveToLocalStorage();
                }, vm.updateDelay);
            }

            SheetDataService.saveToLocalStorage();
        });
    }

    angular
        .module('jGrid')
        .controller('JGridCtrl', JGridCtrl);

})();