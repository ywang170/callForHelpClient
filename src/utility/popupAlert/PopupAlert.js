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
			message:'',
			messageList:[]
		}
	}

	showMessage(msg, timeoutTime){
		if (this.state.message !== '') {
			var messageListTemp = this.state.messageList;
			messageListTemp.push(msg);
			this.setState({
				messageList: messageListTemp,
			});
			return;
		} else {
			this.revealMessage(msg);
		}
	}

	revealMessage(msg){
		this.setState({
			message:msg
		});
		setTimeout(this.removeAlert.bind(this), 5000);
	}

	removeAlert(){
		var messageListTemp = this.state.messageList;
		var nextMsg;
		if (messageListTemp.length !== 0){
			nextMsg = messageListTemp.shift();
		}
		this.setState({
			message:'',
			messageList: messageListTemp,
		});
		if (nextMsg) {
			setTimeout(function(){this.revealMessage(nextMsg);}.bind(this), 500);
		}
		
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