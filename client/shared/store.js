const Flux = require('pico-flux');

let State = {
	loaded: false,
	clientId     : '',
	clientSecret : '',
	venueSlug    : '',
	isDebugMode  : false,
};

const ChromeStorage = Flux.Store({
	init(state){
		State = Object.assign({}, State, state);
	},
	setOptions(state) {
		console.log('[persisting options]', state);
		State = Object.assign({}, State, state);
		chrome.storage.local.set({ settings: State });
	},




}, {
	isLoaded() {
		return State.loaded;
	},
	getOptions() {
		return Object.assign({}, State);
	},
});

ChromeStorage.emitter.on('update', () => {
	// TODO: save chrome data async
	console.log('[updated storage]', State);
});

if (typeof chrome !== 'undefined') {
	// TODO: fetch chrome data async
	chrome.storage.local.get('settings', (storage) => {
		console.log('[fetched storage]', storage)
		if (storage.settings) {
			storage.settings.loaded = true;
			ChromeStorage.init(storage.settings);
		}
	});
}

module.exports = ChromeStorage;
