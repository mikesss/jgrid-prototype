(function() {
    
    require('angular/angular');
    require('angular-hotkeys/build/hotkeys');
    require('http');
    require('./vendor/ui-ace/ui-ace')

    angular
        .module('jGrid', ['ui.ace', 'cfp.hotkeys']);

    require('./services/GridSelectorService');
    require('./services/SheetDataService');
    require('./filters/IndexToHeader');
    require('./controllers/jGridCtrl');

})();