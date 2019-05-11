require('./popup.less');
const React = require('react');

const renderMappedin = require('lib/popup.js');

const Popup = ({ ready, clientId, clientSecret, venueSlug }) => {
	console.log('-- DUMB render');

	console.log('---- DUMB props', { ready, clientId, clientSecret, venueSlug });
	if (!ready) {
		return (<div>Loading...</div>);
	}

	setTimeout(() => renderMappedin(clientId, clientSecret, venueSlug), 5000);

	return (
		<div className='Popup'>
			<div id="mapView"></div>
			<select id="mapList"></select>
		</div>
	);
};

module.exports = Popup;
