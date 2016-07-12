(function() {
    
    require('angular/angular');
    require('http');

    angular
        .module('jGrid', []);

    require('./services/GridSelectorService');
    require('./services/SheetDataService');
    require('./filters/IndexToHeader.js');
    require('./controllers/jGridCtrl');

})();