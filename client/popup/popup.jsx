require('./popup.less');
const React = require('react');


function Popup({ ...props }){
	return <div className={`Popup`} {...props}>
		Popup Component Ready.
	</div>;
};

module.exports = Popup;