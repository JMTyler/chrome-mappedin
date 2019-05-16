require('./options.less');
const React = require('react');

const OptionsForm = ({ ready, appVersion, initialState, onSave }) => {
	console.log('-- DUMB render');

	console.log('---- DUMB props', { ready, appVersion, initialState, onSave });
	if (!ready) {
		return (<div>Loading...</div>);
	}

	const [ state, setState ] = React.useState(initialState);
	console.log('---- DUMB state', state);

	const onChange = (field, value) => {
		return setState({ ...state, [field] : value });
	};

	const onSubmit = (evt) => {
		evt && evt.preventDefault();
		return onSave(state);
	};

	const renderTextbox = (field, label) => {
		return (
			<div>
				<label>{label}</label>
				<input type="text"
					onChange={(evt) => onChange(field, evt.target.value)}
					value={state[field]}
				/>
			</div>
		);
	};

	return (
		<div className='Options'>
			<h1>Options</h1>

			<form>
				<div>
					{renderTextbox('clientId', 'Client ID')}
					{renderTextbox('clientSecret', 'Client Secret')}
					{renderTextbox('venueSlug', 'Venue Slug')}
				</div>

				<div>
					<button onClick={onSubmit}>Save</button>
				</div>
			</form>

			<div>
				Mappedin for Chrome <br/>
				Version <span id="lblVersion">{appVersion}</span>
			</div>
		</div>
	);
};

module.exports = OptionsForm;
