import React, { Component } from 'react';
import TimeSlotFormForPostingQuestion from './TimeSlotFormForPostingQuestion'
import InputComponent from './InputComponent';
import TextareaComponent from './TextareaComponent';
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
			availableTimeSlots: new Set(),
			chosenTimeSlots: new Set(),
		}
	}
	componentWillMount(){
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
		//load all registered time slots for user
		fetch('/getSlots/simple/', {
			method: "GET",
			mode: 'cors',
			credentials: 'same-origin',
			headers: {"Content-Type": "application/json"}
		})
		.then(function(res){
			console.log(res);
			if (!res.ok) {
				switch (res.status) {
					case 401:
						this.props.onValidationFail();
						break;
					default:  //other error, usually 500
						this.props.onServerError();
						break;
				}
				throw new Error('get user slot fail');
			}
			return res.json();
			
		}.bind(this))
		.then(function(data){
			for (var i = 0; i < data.slots.length; i++) {
				var takenSlotInstant = new Date(data.slots[i].time).getTime();
				if (availableTimeSlotsTemp.has(takenSlotInstant)) {
					availableTimeSlotsTemp.delete(takenSlotInstant);
				}
			}
			//update availableTimeSlots and initialize chosenTimeSlots
			this.setState({
				availableTimeSlots: availableTimeSlotsTemp,
				chosenTimeSlots: new Set(),
			})
		}.bind(this))
		.catch(function(err){
			console.log('get user slot fail');
		});
	}


	confirm(){
		var questionTitle = this.refs["title"].returnTitle();
		if (!questionTitle || typeof questionTitle !== 'string' || questionTitle.length < 15 || questionTitle.length > 100) {
			console.log('question title in wrong form');
			return;
		}
		var questionContent = this.refs["content"].returnContent();
		if (!questionContent || typeof questionContent !== 'string' || questionContent.length < 15 || questionContent.length > 2000) {
			console.log('question content in wrong form');
			return;
		}
		var questionSlots = Array.from(this.state.chosenTimeSlots);
		if (!questionSlots || !Array.isArray(questionSlots) || questionSlots.length < 1 || questionSlots.length > 72) {
			console.log('chosen slots in wrong form');
			return;
		}
		//send confirmation to database
		fetch('/setQuestions/create', {
			method: "POST",
			mode: 'cors',
			credentials: 'same-origin',
			body: JSON.stringify({
				questionTitle: questionTitle,
				questionContent: questionContent,
				questionSlots: questionSlots
			}),
			headers: {"Content-Type": "application/json"}
		})
		.then(function(res){
			if (!res.ok) {
				switch (res.status) {
					case 401: //bad input
						this.props.onValidationFail();
						break;
					case 423:
						console.log("user is asking question in another environment");
						break;
					default:  //other error, usually 500
						this.props.onServerError();
						break;
				}
				throw new Error('submit question fail');
			}
			return res.json();
			
		}.bind(this))
		.then(function(data){
			console.log(data);
			//navigate user to main page
		})
		.catch(function(err){
			console.log('submit question fail');
		});
	}

	onChoosingATimeSlot(timeSlot){
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

	/*
	if only chosen time is updated, then do not update
	*/
	shouldComponentUpdate(nextProps, nextState){
		if (this.state.chosenTimeSlots.length != nextState.chosenTimeSlots.length && this.state.availableTimeSlots.length == nextState.availableTimeSlots.length) {
			return false;
		}
		return true;
	}

	render(){
		return (
			<div className="QuestionPostingForm_questionPostingFormContainer">
				<span>Title: </span><InputComponent ref={"title"} />
				<TextareaComponent ref={"content"}/>
				<TimeSlotFormForPostingQuestion availableTimeSlots={this.state.availableTimeSlots} 
				onChoosingATimeSlot={(timeSlot) => this.onChoosingATimeSlot(timeSlot)} onUnChoosingATimeSlot={(timeSlot)=>this.onUnChoosingATimeSlot(timeSlot)}/>
				<button className="QuestionPostingForm_confirm" onClick={()=>this.confirm()}>Submit Question!</button>
			</div>
		);
	}
}

export default QuestionPostingForm;