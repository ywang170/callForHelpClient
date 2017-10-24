import React, { Component } from 'react';
import TimeSlot from './TimeSlot';
import './Day.css';

/*
Description: show 24 time slot
Props: 	
	date - date of this day, in the format of a date string like "April 16, 2017" or "04/15/1994", it is LOCAL TIME!
	availableTimeInstants - set of time slots that are available, in time instant, which is a number
	onChoosingATimeSlot - will be passed into each time slot as the onClick function
	onUnChoosingATimeSlot - on choose the chosen time slot again
	isLastDay - if this day is the last day on time slot form. Only the last day has the ability to hide
*/
class Day extends Component {

	/*
	contructure

	State:
		anyTimeAvailableOnThisDay - if this day doesn't contain any time slot available and it is the last day, then just don't show
	*/
	constructor(props) {
		super(props);

		this.state={
			//if not time slot is avaiable at all for this date, hide it
			anyTimeAvailableOnThisDay: true,
		}

	}

	/*
	a function called by parents using reference to clean all chosen slots
	*/
	cleanChosen(){
		for(var i = 0;i < 24; i++) {
			var refTag = "timeSlot"+i;
			if(this.refs[refTag]){
				this.refs[refTag].unChooseWithoutSendingSignal();
			}
			
		}
	}

	/*
	on mount, check if it is necessary to hide this day
	*/
	componentDidMount(){
		if (!this.props.isLastDay && !this.state.anyTimeAvailableOnThisDay) {
			this.setState({
				anyTimeAvailableOnThisDay: true,
			});
		}
	}

	/*
	render time slots of the day
	only render the slot as clickable if it is available and later than curr time

	Params:
		hourOfTheDay: for one day we have 24 hrs, so this param ranges from 0~23, to show which time slot it is
	*/
	renderTimeSlot(hourOfTheDay) {
		//get time to show
		var timeToShow = (hourOfTheDay+1)+":00"
		//get the time instant of this day at this hour (We need to cast it to "time" so it is a UTC time)
		var timeInstant = new Date(this.props.date + " " + timeToShow).getTime(); 
		//check if this time instant is available, plus it has to be bigger than now
		if (this.props.availableTimeInstants.has(timeInstant) && timeInstant > new Date().getTime()) {
			return (
				<TimeSlot ref={"timeSlot"+hourOfTheDay} time={timeToShow} date={this.props.date} available={true} onChoose={this.props.onChoosingATimeSlot} onUnChoose={this.props.onUnChoosingATimeSlot}
				/>
			);
		} else {
			return (
				<TimeSlot time={timeToShow} available={false} 
				/>
			);
		}
	}

	/*
	render
	*/
	render() {
		//render 24 hours
		return (
			<div className={this.state.anyTimeAvailableOnThisDay? "dayContainerShow": "dayContainerHide"}>
				<div className="dateShowing">{this.props.date}</div>
				{this.renderTimeSlot(0)}
				{this.renderTimeSlot(1)}
				{this.renderTimeSlot(2)}
				{this.renderTimeSlot(3)}
				{this.renderTimeSlot(4)}
				{this.renderTimeSlot(5)}
				{this.renderTimeSlot(6)}
				{this.renderTimeSlot(7)}
				{this.renderTimeSlot(8)}
				{this.renderTimeSlot(9)}
				{this.renderTimeSlot(10)}
				{this.renderTimeSlot(11)}
				{this.renderTimeSlot(12)}
				{this.renderTimeSlot(13)}
				{this.renderTimeSlot(14)}
				{this.renderTimeSlot(15)}
				{this.renderTimeSlot(16)}
				{this.renderTimeSlot(17)}
				{this.renderTimeSlot(18)}
				{this.renderTimeSlot(19)}
				{this.renderTimeSlot(20)}
				{this.renderTimeSlot(21)}
				{this.renderTimeSlot(22)}
				{this.renderTimeSlot(23)}
			</div>
		);
	}
}

export default Day;