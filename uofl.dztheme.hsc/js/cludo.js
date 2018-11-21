var CludoSearch;
(function () {
	var cludoSettings = {
		customerId: 10000261,
		engineId: 10000367,
		searchUrl: 'https://search.louisville.edu/',
		language: 'en',
		searchInputs: ['search-form', 'tablet-search-form', 'mobile-search-form'],
		type: 'inline',
		searchApiUrl: 'https://api-us1.cludo.com/api/v3',
		disableAutocomplete: true
	};
	CludoSearch = new Cludo(cludoSettings);
	CludoSearch.init();
})();
