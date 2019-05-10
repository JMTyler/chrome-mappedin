const Flux = require('pico-flux');

const State = {
	loaded: false,
	options: {
		isDebugMode  : false,
		clientId     : '<Your API Key Here>',
		clientSecret : '<Your API Secret Here>',
		venueSlug    : '<Your venue slug here>',
	},
};

const ChromeStorage = Flux.Store({
	init(state){
		Object.assign(State, state);
	},
	setOptions(options) {
		console.log('[persisting options]', options);
		Object.assign(State.options, options);
		chrome.storage.local.set({ settings: options });
	},
}, {
	isLoaded() {
		return State.loaded;
	},
	getOptions() {
		// I think this is actually bad, as it could cause needless re-renders.
		return State.options;
	},
});

ChromeStorage.emitter.on('update', () => {
	console.log('[updated storage]', State);
});

if (typeof chrome !== 'undefined') {
	// TODO: Let's switch to simply using `options` for this.
	chrome.storage.local.get('settings', (storage) => {
		console.log('[fetched storage]', storage)
		const state = { loaded: true };
		if (storage.settings) {
			state.options = storage.settings;
		}
		ChromeStorage.init(state);
	});
}

module.exports = ChromeStorage;
