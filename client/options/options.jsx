// require('./options.less');
const React = require('react');

const OptionsPage = ({ ready, appVersion, initialState, onSave }) => {
	console.log('-- DUMB render');

	console.log('---- DUMB props', { ready, appVersion, initialState, onSave });
	if (!ready) {
		return (<div>Loading...</div>);
	}

	const [ state, setState ] = React.useState(initialState);
	console.log('---- DUMB state', state);

	const onChange = (field, value) => {
		// TODO: Do we need to include the whole state here, or just the bit that's changing like before?
		return setState({ ...state, [field] : value });
	};

	return (
		<div>
			<div>
				<h1>
					Settings
				</h1>

				<div>
					<label>Client ID</label>
					<input type="text"
						onChange={(evt) => onChange('clientId', evt.target.value)}
						value={state.clientId}
					/>

					<br/>

					<label>Client Secret</label>
					<input type="text"
						onChange={(evt) => onChange('clientSecret', evt.target.value)}
						value={state.clientSecret}
					/>

					<br/>

					<label>Venue Slug</label>
					<input type="text"
						onChange={(evt) => onChange('venueSlug', evt.target.value)}
						value={state.venueSlug}
					/>
				</div>

				<br/>

				<input type="hidden"
					onChange={(evt) => onChange('isDebugMode', evt.target.value)}
					value={state.isDebugMode}
					/>

				<div>
					<button onClick={() => onSave(state)}>Save</button>
				</div>
			</div>

			<div>
				Mappedin for Chrome <br/>
				Version <span id="lblVersion">{appVersion}</span>
			</div>
		</div>
	);
};

module.exports = OptionsPage;

// class Options extends React.Component {
// 	constructor(props) {
// 		super(props);
// 		this.state = {
// 			clientId: props.clientId,
// 			clientSecret: props.clientSecret,
// 			venueSlug: props.venueSlug,
// 			isDebugMode: props.isDebugMode,
// 		};
// 	}

// 	componentWillReceiveProps(props) {
// 		this.setState({
// 			clientId: props.clientId,
// 			clientSecret: props.clientSecret,
// 			venueSlug: props.venueSlug,
// 			isDebugMode: props.isDebugMode,
// 		});
// 	}

// 	handleChange(field, event) {
// 		return this.setState({
// 			[field]: event.target.value,
// 		});
// 	}

// 	handleSave() {
// 		console.log('saving', this.state);
// 		Actions.setClientId(this.state.clientId);
// 		return;

// 		jmtyler.log('saving settings...', { clientId, clientSecret, venueSlug, isDebugMode });
// 		return;

// 		jmtyler.settings.set('client_id', this.state.clientId)
// 			.set('client_secret', this.state.clientSecret)
// 			.set('venue_slug', this.state.venueSlug)
// 			.set('is_debug_mode', this.state.isDebugMode);
// 	}

// 	render() {
// 		console.log(this.props);
// 		return (
// 			<div>
// 				<div>
// 					<h1>
// 						Settings
// 					</h1>

// 					<div>
// 						<label>Client ID</label>
// 						<input type="text" onChange={this.handleChange.bind(this, 'clientId')} value={this.state.clientId} />

// 						<br/>

// 						<label>Client Secret</label>
// 						<input type="text" onChange={this.handleChange.bind(this, 'clientSecret')} value={this.state.clientSecret} />

// 						<br/>

// 						<label>Venue Slug</label>
// 						<input type="text" onChange={this.handleChange.bind(this, 'venueSlug')} value={this.state.venueSlug} />
// 					</div>

// 					<br/>

// 					<input type="hidden" onChange={this.handleChange.bind(this, 'isDebugMode')} value={this.state.isDebugMode} />

// 					<div>
// 						<button onClick={this.handleSave.bind(this)}>Save</button>
// 					</div>
// 				</div>

// 				<div>
// 					Mappedin for Chrome <br/>
// 					Version <span id="lblVersion">{''}</span>
// 				</div>
// 			</div>
// 		);
// 	}
// }

// module.exports = Options;