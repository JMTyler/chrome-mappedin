const Flux = require('pico-flux');

const ChromeStorage = require('../shared/store');

const SmartOptionsPage = Flux.Component({
	component : require('./options.jsx'),
	sources   : [ ChromeStorage ],
	getProps  : () => {
		console.log('SMART render');
		const ready = ChromeStorage.isLoaded();
		// TODO: Need a chrome wrapper or something.
		const appVersion = typeof chrome !== 'undefined' ? chrome.runtime.getManifest().version : null;
		const initialState = ChromeStorage.getOptions();
		console.log('-- SMART state', initialState);

		const onSave = (state) => {
			console.log('-- SMART saving', state);
			ChromeStorage.setOptions(state);
		};

		// Data from Stores & Contracts should be passed by reference to limit needless re-renders.
		return {
			ready,
			appVersion,
			initialState,
			onSave,
		};
	},
});

module.exports = SmartOptionsPage;
