require('./popup.less');
const React = require('react');

const Popup = ({ ready, initialState }) => {
	console.log('-- DUMB render');

	console.log('---- DUMB props', { ready, initialState });
	if (!ready) {
		return (<div>Loading...</div>);
	}

	const [ state, setState ] = React.useState(initialState);
	console.log('---- DUMB state', state);

	const renderTextbox = (field, label) => {
		return (
			<div>
				<label>{label}</label>
				<input type="text"
					value={state[field]}
				/>
			</div>
		);
	};

	return (
		<div className='Popup'>
			<h1>Popup</h1>

			<form>
				<div>
					{renderTextbox('clientId', 'Client ID')}
					{renderTextbox('clientSecret', 'Client Secret')}
					{renderTextbox('venueSlug', 'Venue Slug')}
				</div>
			</form>
		</div>
	);
};

module.exports = Popup;
