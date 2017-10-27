import React, { Component } from 'react';
import './ScreenBlocker.css';

/*
screen blocker
usually used in two ways:
	1. as popup. In this case it usually shows with another component on its top and together wraped in a bigger component
		<Biggest Component may show or hide>
			<ScreenBlocker />
			<div z-index:11>
				<Popup Content Component />
			</div>
		<Biggest Component may show or hide>
	2. When something is processing. In this case onClick should be null

Props:
	onClick - on click function from parents. For example, you can let the screen block to be gone
*/
class ScreenBlocker extends Component{

	render(){
		return (
			<div className="screenBlocker" onClick={this.props.onClick}></div>
		);
	}
}

export default ScreenBlocker;
