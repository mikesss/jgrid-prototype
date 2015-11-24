(function() {
    
    require('angular/angular');

    angular
        .module('jGrid', []);

    require('./services/GridSelectorService');
    require('./services/SheetDataService');
    require('./controllers/jGridCtrl');

})();