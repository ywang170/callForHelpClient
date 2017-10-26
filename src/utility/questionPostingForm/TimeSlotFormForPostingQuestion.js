import React, { Component } from 'react';
import TimeSlotForm from '../timeSlotForm/TimeSlotForm'
import './TimeSlotFormForPostingQuestion.css'


class TimeSlotFormForPostingQuestion extends Component{

	render(){
		return (
			<TimeSlotForm availableTimeInstants={this.props.availableTimeSlots} onlyOneChoice={false} days={3} 
			onChoosingATimeSlot={this.props.onChoosingATimeSlot} onUnChoosingATimeSlot={this.props.onUnChoosingATimeSlot}/>
		);
	}
}

export default TimeSlotFormForPostingQuestion;