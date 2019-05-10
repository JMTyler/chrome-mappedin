const Flux = require('pico-flux');

const ChromeStorage = require('../shared/store');

const SmartPopup = Flux.Component({
	component : require('./popup.jsx'),
	sources   : [ ChromeStorage ],
	getProps  : () => {
		console.log('SMART render');
		const ready = ChromeStorage.isLoaded();
		const initialState = ChromeStorage.getOptions();
		console.log('-- SMART state', initialState);

		// Data from Stores & Contracts should be passed by reference to limit needless re-renders.
		return {
			ready,
			initialState,
		};
	},
});

module.exports = SmartPopup;
