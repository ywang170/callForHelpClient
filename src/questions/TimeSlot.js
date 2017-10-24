import React, { Component } from 'react';
import './TimeSlot.css';

/*
Description: show 1 time slot
Props: 	
	time - time of this slot in date string, like "04/15/1994"
	onChoose - functions to process chosen on a time slot
	onUnChoose - function to click on a time slot to unchoose it
	available - if this time slot is available
	date - date in date sting form like "04/15/1994"
*/
class TimeSlot extends Component {

	/*
	contructor
	
	State:
		chosen: if this time slot is chosen. If it is, then change color and change onclick functions
	*/
	constructor(props) {
		super(props);

		this.state = {
			//if chosen then the style will change and not clickable
			chosen: false,
		}
	}
	/*  
	when user click on this slot, if it is not chosen yet, it will trigger function passed by props to see if it can be chosen
	If it can be chosen, then change the state
	*/
	chooseTime(){
		if (this.props.onChoose(this.props.date + " " + this.props.time)) {
			//if picking this time slot is allowed, then change the style
			this.setState({
				chosen: true,
			});
		}
	}

	/* 
	when user click on this slot, if it is chosen already, it will trigger function passed by props to see if it can be unchosen
	If it can be unchosen, then change the state
	*/
	unChooseTime(){
		if (this.props.onUnChoose(this.props.date + " " + this.props.time)) {
			//if picking this time slot is allowed, then change the style
			this.setState({
				chosen: false,
			});
		}
	}

	/* 
	In some cases. For example we need to unchoose all the other slots when one slot is chosen, we let the parents call this function through reference
	*/
	unChooseWithoutSendingSignal() {
		if (this.state.chosen) {
			this.setState({
				chosen: false,
			});
		}
	}

	/*
	render
	*/
	render() {
		if (this.props.available) {
			return (
				<div className={this.state.chosen?"timeSlotChosen":"timeSlotAvailable"} onClick={this.state.chosen? () => this.unChooseTime(): () => this.chooseTime()}>
					{this.props.time}
				</div>
			);
		} else {
			//for unavailable slot, we just render a un-interactable one
			return (
				<div className="timeSlotUnavailable">
					{this.props.time}
				</div>
			);
		}
	}
}

export default TimeSlot;