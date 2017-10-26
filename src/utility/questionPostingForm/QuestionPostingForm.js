import React, { Component } from 'react';
import TimeSlotFormForPostingQuestion from './TimeSlotFormForPostingQuestion'
import './QuestionPostingForm.css';

/*
a standalone form that can submit a question to system

props:
	onValidationFail - functions to run when user fails validation
	onServerError - other than validation fail, if the server returns other error
	onConfirm - when confirmed. This module will auto send confirmation to db. But in care parent component may want to do somethings like hide module, etc...

state:
	title - title of the question
	content - content of the question
	slots - list of Date in instant number

*/
class QuestionPostingForm extends Component {
	constructor(props) {
		super(props);

		this.state= {
			title:'',
			content: '',
			availableTimeSlots: undefined,
			chosenTimeSlots: undefined,
		}
	}
	componentWillMount(){
		//load all registered time slots for user
		//generate available time slots for next 72 hrs
		var availableTimeSlotsTemp = new Set();
		var currDateTime = new Date();
		currDateTime.setMinutes(0);
		currDateTime.setSeconds(0);
		currDateTime.setMilliseconds(0);
		for (var i = 0; i < 72; i++) {
			currDateTime.setHours(currDateTime.getHours() + 1);
			availableTimeSlotsTemp.add(currDateTime.getTime());
		}
		//update availableTimeSlots and initialize chosenTimeSlots
		this.setState({
			availableTimeSlots: availableTimeSlotsTemp,
			chosenTimeSlots: new Set(),
		})
	}

	componentDidMount(){

	}

	updateTitle(e) {
		this.setState({
			title: e.target.value,
		})
	}

	updateContent(e) {
		this.setState({
			content: e.target.value,
		})
	}

	confirm(){
		console.log(this.state.chosenTimeSlots);
		//send confirmation to database
	}

	onChoosingATimeSlot(timeSlot){
		console.log("dadasd");
		if (this.state.chosenTimeSlots.has(timeSlot)) {
			return true;
		}
		var chosenTimeSlotsTemp = this.state.chosenTimeSlots;
		chosenTimeSlotsTemp.add(timeSlot);
		this.setState({
			chosenTimeSlots:chosenTimeSlotsTemp,
		})
		return true;
	}

	onUnChoosingATimeSlot(timeSlot){
		if (!this.state.chosenTimeSlots.has(timeSlot)) {
			return true;
		}
		var chosenTimeSlotsTemp = this.state.chosenTimeSlots;
		chosenTimeSlotsTemp.delete(timeSlot);
		this.setState({
			chosenTimeSlots:chosenTimeSlotsTemp,
		})
		return true;
	}

	shouldComponentUpdate(nextProps, nextState){
		//we want to avoid overly updating
		if(nextState.title !== this.state.title || nextState.content !== this.state.content) {
			return true;
		}
		return false;
	}

	render(){
		return (
			<div className="QuestionPostingForm_questionPostingFormContainer">
				<span>Title: </span><input className="QuestionPostingForm_questionTitle" type="text" value={this.state.title} onChange={(e) => this.updateTitle(e)}/>
				<textarea className="QuestionPostingForm_questionContent" value={this.state.content} onChange={(e) => this.updateContent(e)} />
				<TimeSlotFormForPostingQuestion availableTimeSlots={this.state.availableTimeSlots} 
				onChoosingATimeSlot={(timeSlot) => this.onChoosingATimeSlot(timeSlot)} onUnChoosingATimeSlot={(timeSlot)=>this.onUnChoosingATimeSlot(timeSlot)}/>
				<button className="QuestionPostingForm_confirm" onClick={()=>this.confirm()}>Submit Question!</button>
			</div>
		);
	}
}

export default QuestionPostingForm;