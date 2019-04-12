
var jmtyler = jmtyler || {};
jmtyler.settings = (function()
{
	var _settings = {};
	var _resource = null;

	var _defaults = {
		is_debug_mode : false,
		client_id     : '<Your API Key Here>',
		client_secret : '<Your API Secret Here>',
		venue_slug    : '<Your venue slug here>',
	};

	var _commit = function()
	{
		_resource.set({ settings: _settings });
	};

	return {
		init: function(resource, callback)
		{
			_resource = chrome.storage[resource];
			this.reload(callback);
			return this;
		},
		reload: function(callback)
		{
			callback = callback || function(){};

			_resource.get('settings', function(storage) {
				if (!storage.settings) {
					storage.settings = {};
				}
				_settings = storage.settings;
				return callback();
			});
			return this;
		},
		get: function(key)
		{
			if (typeof(key) == 'undefined') {
				return _settings;
			}

			if (typeof(_settings[key]) != 'undefined') {
				return _settings[key];
			}

			// TODO: Should probably clone defaults into _settings when accessed, so I don't mess up users' expectations if I change a default and to ensure that nested objects in defaults actually get saved.
			if (typeof(_defaults[key]) != 'undefined') {
				return _defaults[key];
			}

			return null;
		},
		set: function(key, value)
		{
			_settings[key] = value;
			_commit();

			return this;
		},
		clear: function(key)
		{
			if (typeof(key) == 'undefined' || key === null) {
				_settings = {};
				_commit();
				return this;
			}

			delete _settings[key];
			_commit();

			return this;
		},
	};
})();

jmtyler.log = function()
{
	if (!jmtyler.settings.get('is_debug_mode')) {
		return false;
	}

	return console.log.apply(console, arguments);
};
