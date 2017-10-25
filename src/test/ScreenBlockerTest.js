import React, { Component } from 'react';
import ScreenBlocker from '../utility/screenBlocker/ScreenBlocker'

class ScreenBlockerTest extends Component{

	constructor(props) {
		super(props);

		this.state= {
			screenBlockerOn: false,
		}
	}

	screenBlockerOn(){
		this.setState({
			screenBlockerOn: true,
		});
	}

	cancel(){
		this.setState({
			screenBlockerOn: false,
		});
	}

	render(){
		return (
			<div>
			{
				this.state.screenBlockerOn ?
					<ScreenBlocker onClick={() => this.cancel()}></ScreenBlocker>: null
				
			}
			
			<button onClick={() => this.screenBlockerOn()}>Test!</button>
			</div>
		);
	}
}

export default ScreenBlockerTest;