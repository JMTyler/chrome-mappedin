require('./popup.less');
const React = require('react');

const renderMappedin = require('lib/popup.js');

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

			<div><button onClick={() => renderMappedin(clientId, clientSecret, venueSlug)}>GO</button></div>

			<div id="mapView"></div><select id="mapList"></select>
		</div>
	);
};

module.exports = Popup;
