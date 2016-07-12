(function() {
    
    require('angular/angular');
    require('http');
    require('./vendor/ui-ace/ui-ace')

    angular
        .module('jGrid', ['ui.ace']);

    require('./services/GridSelectorService');
    require('./services/SheetDataService');
    require('./filters/IndexToHeader');
    require('./controllers/jGridCtrl');

})();