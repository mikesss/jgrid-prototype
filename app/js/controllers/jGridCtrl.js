(function() {
    require('angular/angular');

    function JGridCtrl($scope, $interval, hotkeys, SheetDataService, GridSelectorService) {
        var vm              = this;

        SheetDataService.loadFromLocalStorage();

        vm.gridX                    = new Array(10);
        vm.gridY                    = new Array(10);
        vm.x                        = 0;
        vm.y                        = 0;
        vm.selectedScript           = SheetDataService.getScript(0, 0);
        vm.selectedScriptDepSels    = null;
        vm.updateDelay              = 100;
        vm.activeUpdateCycle        = null;
        vm.aceEditor                = null;
        vm.aceEditorIsFocused       = false;

        vm.selectGrid = function(x, y) {
            vm.x = x;
            vm.y = y;
            vm.selectedScript = SheetDataService.getScript(x, y);
        };

        vm.isDependencyCell = function(x, y) {
            return GridSelectorService.pointIsInSelectorList(x, y, SheetDataService.getRelatedSelectors(vm.x, vm.y));
        };

        vm.isDependencyCol = function(x) {
            return GridSelectorService.colIsInSelectorList(x, SheetDataService.getRelatedSelectors(vm.x, vm.y));
        };

        vm.isDependencyRow = function(y) {
            return GridSelectorService.rowIsInSelectorList(y, SheetDataService.getRelatedSelectors(vm.x, vm.y));
        };

        vm.moveUp = function(e) {
            e.preventDefault();
            vm.selectGrid(vm.x, Math.max(vm.y - 1, 0));
        };

        vm.moveDown = function(e) {
            e.preventDefault();
            vm.selectGrid(vm.x, Math.min(vm.y + 1, vm.gridY.length - 1));
        };

        vm.moveLeft = function(e) {
            e.preventDefault();
            vm.selectGrid(Math.max(vm.x - 1, 0), vm.y);
        };

        vm.moveRight = function(e) {
            e.preventDefault();
            vm.selectGrid(Math.min(vm.x + 1, vm.gridX.length - 1), vm.y);
        };

        vm.getValue = function(x, y) {
            return SheetDataService.getValue(x, y);
        };

        vm.getError = function(x, y) {
            return SheetDataService.getError(x, y);
        };

        vm.aceLoaded = function(_editor) {
            vm.aceEditor = _editor;

            vm.aceEditor.$blockScrolling = Infinity
            vm.aceEditor.on('focus', function() { vm.aceEditorIsFocused = true; });
            vm.aceEditor.on('blur', function() { vm.aceEditorIsFocused = false; });
        };

        vm.focusAceEditor = function(e) {
            e.preventDefault(); // without this, the keypress gets entered into the editor
            vm.aceEditor.focus();
        };

        vm.blurAceEditor = function(e) {
            vm.aceEditor.blur();
        };

        hotkeys.bindTo($scope)
            .add({
                combo: 'up',
                description: 'Move one cell up',
                callback: vm.moveUp
            })
            .add({
                combo: 'down',
                description: 'Move one cell down',
                callback: vm.moveDown
            })
            .add({
                combo: ['left', 'shift+tab'],
                description: 'Move one cell left',
                callback: vm.moveLeft
            })
            .add({
                combo: ['right', 'tab'],
                description: 'Move one cell right',
                callback: vm.moveRight
            })
            .add({
                combo: '=',
                description: 'Edit script',
                callback: vm.focusAceEditor
            })
            .add({
                combo: 'esc',
                description: 'Get outta there',
                callback: vm.blurAceEditor,
                allowIn: ['textarea']
            });

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