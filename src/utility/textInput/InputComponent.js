import React, { Component } from 'react';

/*
This component exist for efficiency only!!!
It doesn't even have its own css file...

Props:
	cssClass - css class

State:
	value - value
*/
class InputComponent extends Component{
	constructor(props){
		super(props);

		this.state= {
			value:''
		}
	}

	updateValue(e) {
		this.setState({
			value: e.target.value,
		})
	}

	getValue(){
		return this.state.value;
	}

	clear(){
		this.setState({
			value:'',
		});
	}

	render() {
		return(
			<input className={this.props.cssClass} type="text" value={this.state.value} onChange={(e) => this.updateValue(e)}/>
		);
	}
}

export default InputComponent;