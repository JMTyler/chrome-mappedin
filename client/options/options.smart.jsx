const React = require('react');
const Flux = require('pico-flux');

const ChromeStorage = require('../shared/store');

const SmartOptionsPage = Flux.Component({
	component : require('./options.jsx'),
	sources   : [ ChromeStorage ],
	getProps  : () => {
		console.log('SMART render');
		const ready = ChromeStorage.isLoaded();
		const appVersion = typeof chrome !== 'undefined' ? chrome.runtime.getManifest().version : null;
		const initialState = ChromeStorage.getOptions();
		console.log('-- SMART state', initialState);
		delete initialState.loaded;

		const onSave = (state) => {
			console.log('-- SMART saving', state);
			ChromeStorage.setOptions(state);
			return;

			jmtyler.log('saving settings...', { clientId, clientSecret, venueSlug, isDebugMode });
			return;

			jmtyler.settings.set('client_id', this.state.clientId)
				.set('client_secret', this.state.clientSecret)
				.set('venue_slug', this.state.venueSlug)
				.set('is_debug_mode', this.state.isDebugMode);
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
