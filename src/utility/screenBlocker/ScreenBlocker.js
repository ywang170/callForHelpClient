import React, { Component } from 'react';
import './ScreenBlocker.css';

/*
screen blocker

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
