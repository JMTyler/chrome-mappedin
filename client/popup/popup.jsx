require('./popup.less');
const React = require('react');

const renderMappedin = require('lib/popup.js');

const Popup = ({ ready, clientId, clientSecret, venueSlug }) => {
	console.log('-- DUMB render');

	console.log('---- DUMB props', { ready, clientId, clientSecret, venueSlug });
	if (!ready) {
		return (<div>Loading...</div>);
	}

	// const [sdk, setSDK] = React.useState(null);
	const mapView = React.useRef();
	const mapList = React.useRef();
	React.useEffect(() => {
		if (mapView && mapView.current && mapList && mapList.current) {
			renderMappedin(mapView.current, mapList.current, clientId, clientSecret, venueSlug);
		}
	}, [mapView, mapList]);

	return (
		<div className='Popup'>
			<div ref={mapView} className='mapView'></div>
			<select ref={mapList} className='mapList'></select>
		</div>
	);
};

module.exports = Popup;
