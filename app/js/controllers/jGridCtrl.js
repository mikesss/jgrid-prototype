(function() {
    require('angular/angular');

    function JGridCtrl($scope, SheetDataService) {
        var vm              = this;

        SheetDataService.loadFromLocalStorage();

        vm.gridX            = new Array(10);
        vm.gridY            = new Array(10);
        vm.x                = 0;
        vm.y                = 0;
        vm.selectedScript   = SheetDataService.getScript(0, 0);

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
            SheetDataService.computeValues();
            SheetDataService.saveToLocalStorage();
        });
    }

    angular
        .module('jGrid')
        .controller('JGridCtrl', JGridCtrl);

})();