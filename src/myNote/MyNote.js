import React, { Component } from 'react';
import Header from '../header/Header';
import PopupAlert from '../utility/popupAlert/PopupAlert';
import TimeSlotForm from '../utility/timeSlotForm/TimeSlotForm';
import {withRouter} from 'react-router';
import './MyNote.css';


/*
show my questions and appointment on calendar

Props:
	

State:
	takenAndEmptySlotsMap - actually a 2D array shows which slot is "chosen"(taken with appointment). Need to load user slots to update
							This is passed into TimeSlotForm as "externalDays". 
	questionList - list of user questions
	questionAvailableTimeSlots - list of available time slots. When user don't choose anything, everything besides taken slots are unavaiable. When user choose question, some will become "clickable" to show the availability of this question
	userSlots - a map map instant to a slot object, the key value mapping is (timeinstant, slot object)
	chosenSlot - instant of the chosen slot, can be used to cancel appointment
	oldestQuestionId - current oldest question
	currentInstant - time now

Some logic here:
	loading questions doesn't have anything to do, it is pretty stand along
	clicking on question will only affect availableTimeSlots which doesn't affect the ui refreshing at all, since the question is not supposed to be changed and so does availableTimeSlots
	refreshing (loading user slots) will do reset userSlots, chosenSlot and takenAndEmptySlotsMap
*/
class MyNote extends Component{

	constructor(props){

		super(props);

		this.state={
			takenAndEmptySlotsMap:null,
			questionAvailableTimeSlots: new Set(),
			questionList:[],
			userSlots: null,
			chosenSlot: '',
			oldestQuestionId: '',
			username: '',
			currentInstant: ''
		}
	}

	loadUserSlots(){
		//load user slots
		fetch('/getSlots/detail/', {
			method: "GET",
			mode: 'cors',
			credentials: 'same-origin',
			headers: {"Content-Type": "application/json"}
		})
		.then(function(res){
			console.log(res);
			if (!res.ok) {
				switch (res.status) {
					default:  //other error, usually 500
						console.log("getting user slot error");
						break;
				}
				throw new Error('get user slot fail');
			}
			return res.json();
			
		}.bind(this))
		.then(function(data){
			var username = data.username;
			//if user switched then we reload the page!
			if (this.state.username && username && this.state.username !== username) {
				console.log("you switched user...humm");
				window.location.reload();
				return;
			}
			//generate slot map 'userSlots' and if the 'chosenSLot' is no more one of the slots, clear it
			var userSlotsTemp = {};
			var chosenSlotTemp = '';
			for (var i = 0; i < data.slots.length; i++){
				var timeInstant = (new Date(data.slots[i].time)).getTime();
				if (timeInstant === this.state.chosenSlot){
					chosenSlotTemp = this.state.chosenSlot;
				}
				userSlotsTemp[timeInstant] = data.slots[i];
			}
			if(this.state.chosenSlot && !chosenSlotTemp){
				this.refs["popupAlert"].showMessage("the appointment you were looking at has been canceled", 5000);
			}
			//generate takenAndEmptySlotsMap
			var takenAndEmptySlotsMapTemp = [];
			var timeSlot = new Date();
			timeSlot.setHours(0);
			timeSlot.setMinutes(0);
			timeSlot.setSeconds(0);
			timeSlot.setMilliseconds(0);
			for (var i = 0; i <= 3; i++){
				var SlotChosenArr = [];				
				for (var j = 0; j < 24; j++) {
					if (userSlotsTemp[timeSlot.getTime()]){
						//if this time is taken
						SlotChosenArr.push(true);
					} else {
						SlotChosenArr.push(false);
					}
					timeSlot.setHours(timeSlot.getHours()+1);
				}
				takenAndEmptySlotsMapTemp.push(SlotChosenArr);
			}

			this.setState({
				takenAndEmptySlotsMap: takenAndEmptySlotsMapTemp,
				userSlots: userSlotsTemp,
				chosenSlot: chosenSlotTemp,
				username: username,
				currentInstant: new Date().getTime()
			});
			console.log("user slot updated")

		}.bind(this))
		.catch(function(err){

		}.bind(this));

	}

	//////////////////////////////////////////////////////////questions//////////////////////////////////////////////////////////
	loadQuestions(amount){
		var serverUrl = '/getMyQuestions';

		if (!amount || isNaN(amount) || amount <= 0 || amount > 100) {
			amount = 20;
		}

		if (this.state.oldestQuestionId && this.state.oldestQuestionId !== 0) {
			serverUrl += ('/' + this.state.oldestQuestionId + '/' + amount);
		} else {
			serverUrl += '/0/' + amount;
		}


		//load questions from server and get latest and oldest id
		fetch(serverUrl, {
			method: "GET",
			mode: 'cors',
			credentials: 'same-origin',
			headers: {"Content-Type": "application/json"}
		})
		.then(function(res){
			if (!res.ok) {
				switch (res.status) {
					default:  //other error, usually 500
						break;
				}
				console.log(res.json());
				throw new Error('get questions fail');
			}
			return res.json();
			
		}.bind(this))
		.then(function(data){
			var questionListTemp = [];
			var oldestQuestionIdTemp = this.state.oldestQuestionId;
			//update newer and older
			if(data.questions.length !== 0){
				oldestQuestionIdTemp = data.questions[0].questionid;	
			}
			//question will always be in the order from oldest to newest
			for (var i = 0; i < data.questions.length; i++) {
				var question = data.questions[i];
				console.log(question);
				questionListTemp.push(question);
			}
			questionListTemp = this.state.questionList.concat(questionListTemp);
			//populate state
			this.setState({
				questionList: questionListTemp,
				oldestQuestionId: oldestQuestionIdTemp,
			});
			
		}.bind(this))
		.catch(function(err){
		}.bind(this));
	}

	renderQuestions(){
		var result=[];

		return result;
	}


	onQuestionChosen(questionAvailability){
		//update "availableTimeSlots"
	}

	onQuestionUnChosen(){
		//clear "availableTimeSlots"
	}


	/*
	show information about this slot. use dateTime to get an instant and use the instant to get slot itself
	*/
	onChooseTakenSlot(day, slot, dateTime){
		//change chosenSlot using dateTime to get instant and retrieve from "userSlots"

		return false;
	}

	/*
	just return false
	*/
	onChooseEmptySlot(day, slot, dateTime){
		return false;
	}

	/*
	use "chosenSlot" to clear appointment, will also update "takenAndEmptySlotsMap" but not need to "update userSlots"
	*/
	cancelAppointment(){

	}


	componentWillMount(){
		//load user slot by calling loadUserSlot()
		this.loadUserSlots();
		this.timeInterval = setInterval(this.loadUserSlots.bind(this), 30000);
	}

	componentDidMount(){
		//load questions
		this.loadQuestions();
	}

	componentWillUnmount(){
		//clear time interval
		clearInterval(this.timeInterval);
	}


	render(){
		return (
			<div >
				<Header/>
				<div className="MyNote_questionContainer">
				{this.renderQuestions()}
				</div>
				
				<div className="MyNote_timeSlotContainer">
					<TimeSlotForm externalDays={this.state.takenAndEmptySlotsMap} currentInstant={this.state.currentInstant} 
					availableTimeSlots={this.state.questionAvailableTimeSlots} onUnChoosingATimeSlot={(day, slot, dateTime)=>this.onChooseTakenSlot(day, slot, dateTime)}
					onChoosingATimeSlot={()=>this.onChooseEmptySlot()}/>
				</div>
				<PopupAlert ref="popupAlert"/>
			</div>
		);
	}
}

export default withRouter(MyNote);