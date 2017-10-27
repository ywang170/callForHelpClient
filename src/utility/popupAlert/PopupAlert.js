import React, { Component } from 'react';
import './PopupAlert.css'

/*
popup alert used to show some messages
Can only be called by parent
*/
class PopupAlert extends Component{

	constructor(props) {
		super(props);

		this.state={
			message:''
		}
	}

	showMessage(msg, timeoutTime){
		this.setState({
			message:msg
		});
		if (!timeoutTime) {
			timeoutTime = 3000;
		}
		setTimeout(this.removeAlert.bind(this), timeoutTime);
	}

	removeAlert(){
		this.setState({
			message:'',
		});
	}

	render(){
		return (
			<div>
			{	this.state.message?
				<div className="PopupAlert_banner">{this.state.message}</div>:null
			}
			</div>
		);
	}
}

export default PopupAlert;