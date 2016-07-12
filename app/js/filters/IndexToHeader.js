(function() {
	
	function IndexToHeader() {
		return function(index) {
			return String.fromCharCode(64 + parseInt(index, 10));
		}
	}

	angular
		.module('jGrid')
		.filter('indexToHeader', IndexToHeader);

})();