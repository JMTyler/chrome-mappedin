
document.addEventListener('DOMContentLoaded', function() {
	document.getElementById('lblVersion').innerText = chrome.runtime.getManifest().version;

	var _initializeSettings = function()
	{
		var clientId = jmtyler.settings.get('client_id');
		document.getElementById('txtClientId').value = clientId;

		var clientSecret = jmtyler.settings.get('client_secret');
		document.getElementById('txtClientSecret').value = clientSecret;

		var venueSlug = jmtyler.settings.get('venue_slug');
		document.getElementById('txtVenueSlug').value = venueSlug;

		var isDebugMode = jmtyler.settings.get('is_debug_mode');
		document.getElementById('hdnDebugMode').value = isDebugMode;
	};

	document.getElementById('btnSave').onClick = function() {
		var clientId = document.getElementById('txtClientId').value;
		var clientSecret = document.getElementById('txtClientSecret').value;
		var venueSlug = document.getElementById('txtVenueSlug').value;
		var isDebugMode = document.getElementById('hdnDebugMode').value;

		jmtyler.log('saving settings...', { clientId, clientSecret, venueSlug, isDebugMode });
		return;
		jmtyler.settings.set('client_id', clientId)
			.set('client_secret', clientSecret)
			.set('venue_slug', venueSlug)
			.set('is_debug_mode', isDebugMode);
	};

	document.getElementById('btnReset').onClick = function() {
		jmtyler.settings.clear();
		_initializeSettings();
	};

	jmtyler.settings.init('local', () => {
		_initializeSettings();
	});
});
