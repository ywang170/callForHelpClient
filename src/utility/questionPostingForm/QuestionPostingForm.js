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
	shouldShowMessage - if this is true then show message. Otherwise parent should be responsible for showing messages
	asPopup - rendered as a popup
	show - only used when as a popup
	onCancelCreateQuestion - only used as popup, when cancel creating a question

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

	componentDidMount(){
		if (!this.props.asPopup){
			this.populating();
		}
		
	}

	componentWillReceiveProps(newProps){
		if (newProps.show === true) {
			this.populating();
		}
	}

	/*
	function used to get user time slots and update the state: availableTimeSlots
	*/
	populating(){
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
		fetch('http://127.0.0.1:8081/getSlots/simple/', {
			method: "GET",
			mode: 'cors',
			credentials: 'same-origin',
			headers: {"Content-Type": "application/json"}
		})
		.then(function(res){
			//handle errors
			if (!res.ok) {
				switch (res.status) {
					case 304:
						console.log("304, nothing changes for user slot!");
						break;
					case 401:
						if(this.props.onValidationFail){
							this.props.onValidationFail(res.json());
						}						
						break;
					default:  //other error, usually 500
						if (this.props.onServerError) {
							this.props.onServerError(res.json());
						}						
						break;
				}
				throw new Error('get user slot fail');
			}
			return res.json();
			
		}.bind(this))
		.then(function(data){
			console.log("getting user slot successful");
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
				screenBlocked: false,
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
		if (!questionTitle || typeof questionTitle !== 'string' || questionTitle.length < 15 || questionTitle.length > 200) {
			console.log('question title in wrong form');
			this.refs["popupAlert"].showMessage("question title must be between 15 to 200 characters");		
			return;
		}		
		if (!questionContent || typeof questionContent !== 'string' || questionContent.length > 3000) {
			console.log('question content in wrong form');
			this.refs["popupAlert"].showMessage("question content can't be empty or over 3000 characters");		
			return;
		}
		if (!questionSlots || !Array.isArray(questionSlots) || questionSlots.length < 1 || questionSlots.length > 72) {
			this.refs["popupAlert"].showMessage("please pick at least one time slot");
			console.log('chosen slots in wrong form');
			return;
		}
		//block screen to prevent further user interaction
		this.blockScreen();
		//send submittion to database
		fetch('http://127.0.0.1:8081/setQuestions/create', {
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
							this.props.onValidationFail(res.json());
						}						
						break;
					case 423://user is currently asking in another environment
						if (this.props.onUserBusy) {
							this.props.onUserBusy(res.json());
						} 
						if (this.props.shouldShowMessage) {
							this.refs["popupAlert"].showMessage("the same user is submitting a question now in another environment...\nPlease try again later!", 3000);		
						}										
						break;
					default:  //other error, usually 500
						if (this.props.onServerError) {
							this.props.onServerError(res.json());
						} 
						if (this.props.shouldShowMessage) {
							this.refs["popupAlert"].showMessage("question submission failed for server error!", 3000);					
						}	
						break;
				}
				throw new Error('submit question fail');
			}
			return res.json();
			
		}.bind(this))
		.then(function(data){
			console.log("question successfully submitted!");
			if (this.props.onSuccessful) {
				this.props.onSuccessful(data);
			} 
			if (this.props.shouldShowMessage) {
				this.refs["popupAlert"].showMessage("your question is submitted!", 3000);
			}
			if (!this.props.asPopup) { //if it is a popup then we don't need to reset anything at all
				this.populating();
			}
		}.bind(this))
		.catch(function(err){
			console.log('submit question fail');
			//no matter if user is busy, server error or validation fail, we should not refresh but should lower the shield
			if (!this.props.asPopup) {
				this.unblockScreen();
			}
		}.bind(this));
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
		timeSlot = new Date(timeSlot).getTime();
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
		timeSlot = new Date(timeSlot).getTime();
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
		if (this.state.refresh !== nextState.refresh || (this.props.asPopup && this.props.show !== nextProps.show)) {
			return true;
		}
		return false;
	}

	render(){
		return (
			<div>
			{this.props.asPopup&& this.props.show? <ScreenBlocker onClick={this.props.onCancelCreateQuestion} />: null}
			{this.props.asPopup && !this.props.show? null:
				<div className={this.props.asPopup?"QuestionPostingForm_questionPostingFormContainerPopup":"QuestionPostingForm_questionPostingFormContainer"}>
					<span>Title: </span><InputComponent ref={"title"} cssClass={"QuestionPostingForm_questionTitle"}/>
					<TextareaComponent ref={"content"} cssClass={"QuestionPostingForm_questionContent"}/>
					<TimeSlotForm  currentInstant={this.state.currentInstant} availableTimeSlots={this.state.availableTimeSlots} onlyOneChoice={false} days={3} 
					onChoosingATimeSlot={(timeSlot) => this.onChoosingATimeSlot(timeSlot)} onUnChoosingATimeSlot={(timeSlot)=>this.onUnChoosingATimeSlot(timeSlot)}/>
					<button className="QuestionPostingForm_confirm" onClick={()=>this.submit()}>Submit Question!</button>

					{this.state.screenBlocked? <ScreenBlocker blockParentOnly={true}/>: null}
					<PopupAlert ref="popupAlert"/>
				</div>
			}
			</div>
		);
	}
}

export default QuestionPostingForm;