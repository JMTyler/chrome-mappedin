const Widget = require('./widget.jsx');

const Store   = require('shared/store.js');
const Actions = require('shared/actions.js');

const SmartWidget = Component({
	component : Widget,
	sources   : [Store],
	getProps  : ({ value, ...props })=>{
		return {
			value    : Store.getValue(value),
			onAction : (arg)=>Actions.doThing(arg),
			...props
		};
	}
});

module.exports = SmartWidget;