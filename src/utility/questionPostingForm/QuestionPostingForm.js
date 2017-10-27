import React, { Component } from 'react';
import TimeSlotForm from '../timeSlotForm/TimeSlotForm'
import InputComponent from '../textInput/InputComponent';
import TextareaComponent from '../textInput/TextareaComponent';
import ScreenBlocker from '../screenBlocker/ScreenBlocker';
import PopupAlert from '../popupAlert/PopupAlert';
import './QuestionPostingForm.css';

/*
a standalone form that can submit a question to system
It contains:
	a title input 
	a content textarea
	a time slot form to choose available time
	a submit button
It will automatically load user slots and on error can have some basic handlings
It doesn't contain a screenblocker, so it can be used both as a popup or as part of the web page

props:
	onValidationFail - functions to run when user fails validation
	onUserBusy - function to run when the user is currently ask questions in another environment
	onServerError - other than validation fail, if the server returns other error
	onSubmit - when submit. This module will auto send submittion to db. But in care parent component may want to do somethings like hide module, etc...
	onSuccessful - when submission succeed

state:
	availableTimeSlots - available time slots for new question,
	chosenTimeSlots - currently chosen time slot,
	refresh - should refresh only when this state changes. It is a signal, if it is not changed then view will not refresh
	blockScreen - if screen is blocked or not

*/
class QuestionPostingForm extends Component {

	constructor(props) {
		super(props);

		this.state= {
			availableTimeSlots: new Set(),
			chosenTimeSlots: new Set(),
			refresh: false,
			screenBlocked: false,
			currentInstant: '',
		}
	}

	componentWillMount(){
		this.populating();
	}

	/*
	function used to get user time slots and update the state: availableTimeSlots

	Params:
		shouldUnblockScreen - should unblock the screen?
	*/
	populating(shouldUnblockScreen){
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
			//handle errors
			if (!res.ok) {
				switch (res.status) {
					case 401:
						if(this.props.onValidationFail){
							this.props.onValidationFail();
						}						
						break;
					default:  //other error, usually 500
						if (this.props.onServerError) {
							this.props.onServerError();
						}						
						break;
				}
				throw new Error('get user slot fail');
			}
			return res.json();
			
		}.bind(this))
		.then(function(data){
			//get unavailable time slots out of available time
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
				screenBlocked: shouldUnblockScreen? false: this.state.screenBlocked,
				currentInstant: new Date().getTime(),
				refresh: !this.state.refresh,
			});
			this.refs["title"].clear();
			this.refs["content"].clear();
		}.bind(this))
		.catch(function(err){
			//on error. We don't populate here because it would be horrible if we keep populating
			console.log('get user slot fail');
		});
	}


	/*
	block screen
	*/
	blockScreen(){
		this.setState({
			screenBlocked: true,
			refresh: !this.state.refresh
		})
	}

	/*
	block screen
	*/
	unblockScreen(){
		this.setState({
			screenBlocked: false,
			refresh: !this.state.refresh
		})
	}

	/*
	submit question create request to server
	*/
	submit(){
		//get value from states
		var questionTitle = this.refs["title"].getValue();
		var questionContent = this.refs["content"].getValue();
		var questionSlots = Array.from(this.state.chosenTimeSlots);
		//client validation
		if (!questionTitle || typeof questionTitle !== 'string' || questionTitle.length < 15 || questionTitle.length > 100) {
			console.log('question title in wrong form');
			return;
		}		
		if (!questionContent || typeof questionContent !== 'string' || questionContent.length < 15 || questionContent.length > 2000) {
			console.log('question content in wrong form');
			return;
		}
		if (!questionSlots || !Array.isArray(questionSlots) || questionSlots.length < 1 || questionSlots.length > 72) {
			console.log('chosen slots in wrong form');
			return;
		}
		//block screen
		this.blockScreen();
		//send submittion to database
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
					case 401: //validation fail
						if (this.props.onValidationFail){
							this.props.onValidationFail();
						}						
						break;
					case 423://user is currently asking in another environment
						if (this.props.onUserBusy) {
							this.props.onUserBusy();
						} else {
							this.refs["popupAlert"].showMessage("the same user is submitting a question now in another environment...\nPlease try again later!", 3000);		
						}										
						break;
					default:  //other error, usually 500
						if (this.props.onServerError) {
							this.props.onServerError();
						} else {
							this.refs["popupAlert"].showMessage("question submission failed for server problem!", 3000);					
						}	
						break;
				}
				throw new Error('submit question fail');
			}
			return res.json();
			
		}.bind(this))
		.then(function(data){
			console.log("question successfully submitted! now refreshing!");
			if (this.props.onSuccessful) {
				this.props.onSuccessful();
			} else {
				this.refs["popupAlert"].showMessage("your question is submitted!", 3000);
			}
			this.populating(true);
		}.bind(this))
		.catch(function(err){
			console.log('submit question fail');
			//no matter if user is busy, server error or validation fail, we should not refresh but should lower the shield
			this.unblockScreen();
		});
		if (this.props.onSubmit) {
			this.props.onSubmit();
		}						
	}

	/*
	when a time slot is chosen, update state

	Params:
		timeSLot - time instant of the time slot
	*/
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

	/*
	when a time slot is unchosen, update state

	Params:
		timeSLot - time instant of the time slot
	*/
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
	only refreshes when populating everything
	*/
	shouldComponentUpdate(nextProps, nextState){
		if (this.state.refresh !== nextState.refresh) {
			return true;
		}
		return false;
	}

	render(){
		return (
			<div className="QuestionPostingForm_questionPostingFormContainer">
				<span>Title: </span><InputComponent ref={"title"} cssClass={"QuestionPostingForm_questionTitle"}/>
				<TextareaComponent ref={"content"} cssClass={"QuestionPostingForm_questionContent"}/>
				<TimeSlotForm  currentInstant={this.state.currentInstant} availableTimeSlots={this.state.availableTimeSlots} onlyOneChoice={false} days={3} 
				onChoosingATimeSlot={(timeSlot) => this.onChoosingATimeSlot(timeSlot)} onUnChoosingATimeSlot={(timeSlot)=>this.onUnChoosingATimeSlot(timeSlot)}/>
				<button className="QuestionPostingForm_confirm" onClick={()=>this.submit()}>Submit Question!</button>

				{this.state.screenBlocked? <ScreenBlocker/>: null}
				<PopupAlert ref="popupAlert"/>
			</div>
		);
	}
}

export default QuestionPostingForm;