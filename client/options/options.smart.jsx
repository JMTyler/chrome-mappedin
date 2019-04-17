const React = require('react');
const Flux = require('pico-flux');

const ChromeStorage = require('../shared/store');

const SmartOptionsPage = Flux.Component({
	component : require('./options.jsx'),
	sources   : [ ChromeStorage ],
	getProps  : () => {
		console.log('rendering SMART');
		const state = ChromeStorage.getOptions();
		console.log('SMART state', state);

		const onSave = (state) => {
			console.log('saving', state);
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
			state,
			onSave,
		};
	},
});

module.exports = SmartOptionsPage;
