import React, { Component } from 'react';
import Day from './Day';


/*
Description: show 4 days with 24*4 = 96 slots at most. Though not every day may show up
Props: 	
	onChoosingATimeSlot - processing picking a time slot. System calling time slot form should be responsible for logic
	onUnChoosingATimeSlot - processing click again to cancel. System calling time slot form should be responsible for logic
	availableTimeInstants - time instant in number that is available
	onlyOneChoice - is the form only allows one choice
	days -how many days to show (But actually we show days+1)
	
*/
class TimeSlotForm extends Component {

	/*
	function to run when a time slot is chosen
	According to if this time slot form is "one choice only", it may clean the previous chosen time slot

	Params:
		dateTime - the date and time being chosen

	Question:
		Q: Why we don't use state to record which slot was chosen before and when we choose another slot we only update the old slot?
		A: Because setting state will cause react js to render again. We just want each small slot instead of the whole picture to re-render. Of course you can 
		   avoid this by overriding shouldComponentUpdate, but we just want to make it more refreshable... Alright I'm lazy! Damn!
	*/
	onChoosingATimeSlot(dateTime) {
		if (this.props.onChoosingATimeSlot(dateTime)) {
			if (this.props.onlyOneChoice) {
				for(var i = 0;i <= this.props.days; i++) {
					this.refs["day"+i].cleanChosen();
				}
			}
			return true;
		}
		return false;
	}

	/*
	function to run when a time slot is unchosen

	Params:
		dateTime - the date and time being unchosen
	*/
	onUnChoosingATimeSlot(dateTime) {
		if (this.props.onUnChoosingATimeSlot(dateTime)) {
			return true;
		}
		return false;
	}

	/*
	render all the days needed
	*/
	renderDays(){
		var daysToRender = []
		var today = new Date();
		for (var i = 0; i <= this.props.days; i++) {
			daysToRender.push (
			<Day ref={"day"+i} key={i} date={today.toLocaleDateString()} availableTimeInstants={this.props.availableTimeInstants} onChoosingATimeSlot={() => this.onChoosingATimeSlot()}  onUnChoosingATimeSlot={() => this.onUnChoosingATimeSlot()} isLastDay={i===this.props.days?true:false}
			/>);
			today.setDate(today.getDate() + 1);
		}

		return daysToRender;

	}
	
	/*
	render
	*/
	render() {
		return (
			<div className="timeSlotFormContainer">
				{this.renderDays()}
			</div>
		);
	}
}

export default TimeSlotForm;