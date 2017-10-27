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
	chosen - if this slot is chosen
*/
class TimeSlot extends Component {

	/*  
	when user click on this slot, if it is not chosen yet, it will trigger function passed by props to see if it can be chosen
	If it can be chosen, then change the state
	*/
	chooseTime(){
		this.props.onChoose(this.props.date + " " + this.props.time);
	}

	/* 
	when user click on this slot, if it is chosen already, it will trigger function passed by props to see if it can be unchosen
	If it can be unchosen, then change the state
	*/
	unChooseTime(){
		this.props.onUnChoose(this.props.date + " " + this.props.time)
	}

	/* 
	In some cases. For example we need to unchoose all the other slots when one slot is chosen, we let the parents call this function through reference
	*/
	unChooseWithoutSendingSignal() {

	}

	/*
	render
	*/
	render() {
		if (this.props.available) {
			return (
				<div className={this.props.chosen?"timeSlotChosen":"timeSlotAvailable"} 
				onClick={this.props.chosen? () => this.unChooseTime(this.props.date + " " + this.props.time): () => this.chooseTime(this.props.date + " " + this.props.time)}>
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