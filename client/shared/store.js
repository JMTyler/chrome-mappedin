const Flux = require('pico-flux');

let State = {
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
		console.log('persisting options', state);
	},




}, {
	getOptions() {
		return State;
	},
});

ChromeStorage.emitter.on('update', () => {
	// TODO: save chrome data async
});

if (typeof chrome !== 'undefined') {
	// TODO: fetch chrome data async
	chrome.storage.local.get('settings', (storage) => {
		console.log('fetched storage', storage)
		if (storage.settings) {
			ChromeStorage.init(storage.settings);
		}
	});
}

module.exports = ChromeStorage;
