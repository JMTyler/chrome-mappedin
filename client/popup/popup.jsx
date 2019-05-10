require('./popup.less');
const React = require('react');

if (typeof window !== 'undefined') {
	require('lib/mappedin-v1.50.1.js');
}

const Popup = ({ ready, clientId, clientSecret, venueSlug }) => {
	console.log('-- DUMB render');

	console.log('---- DUMB props', { ready, clientId, clientSecret, venueSlug });
	if (!ready) {
		return (<div>Loading...</div>);
	}

	return (
		<div className='Popup'>
			<h1>Popup</h1>

			<div><pre><code>{clientId}</code></pre></div>
			<div><pre><code>{clientSecret}</code></pre></div>
			<div><pre><code>{venueSlug}</code></pre></div>

			<div id="mapView"></div><select id="mapList"></select>
		</div>
	);
};

module.exports = Popup;
