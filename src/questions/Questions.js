import React, { Component } from 'react';
import QuestionWithAnswerButton from './QuestionWithAnswerButton';
import TimeSlotFormForAnswerQuestion from './TimeSlotFormForAnswerQuestion';
import PopupAlert from '../utility/popupAlert/PopupAlert';
import QuestionPostingForm from '../utility/questionPostingForm/QuestionPostingForm';
import {withRouter} from 'react-router';
import './Questions.css';


/*
List of questions 
This can be a stand alone page
It can be reponsible for loading questions, showing questions

States:
	latestQuestionId - id of the latest question, used to load newer questions
	oldestQuestionId - id of the oldest question, used to load older questions
	questionList - list of all questions
	showTimeSlotForm - if time slot form is shown
	timeSlotFormQuestionId - question id of the question that is open
	timeSlotFormAvailableTimeSlot - available time slot for the question
	username - username
*/
class Questions extends Component {

	constructor(props) {
		super(props);

		this.state= {
			//keep information for questions
			latestQuestionId: 0,
			oldestQuestionId: 0,
			questionList: [],
			//keep information for time slots
			showTimeSlotForm: false,
			timeSlotFormQuestionId: '',
			timeSlotFormAvailableTimeSlot: '',
			//ask question info
			showQuestionPostingForm: false,
			//loading blocker
			blockLoadingQuestions: false,
			//user info
			username: '',
		}
	}

	//////////////////////////////////////////////////////questions Loading//////////////////////////////////////////////////////////////////

	loadQuestions(loadNewer, loadOlder, amount){
		if (this.state.blockLoadingQuestions) {
			console.log("was trying to load more questions but action was blocked");
			return;
		}
		this.blockLoadingQuestions();
		var serverUrl = '/getQuestions';

		if (loadNewer && this.state.latestQuestionId && this.state.latestQuestionId !== 0) {
			serverUrl += ('/' + this.state.latestQuestionId + '/0');

		} else if (loadOlder && this.state.oldestQuestionId && this.state.oldestQuestionId !== 0) {
			serverUrl += ('/0/' + this.state.oldatesQuestionId);
		} else {
			serverUrl += '/0/0'
		}

		if (amount && !isNaN(amount) && amount > 0 && amount < 100) {
			serverUrl += ('/' + amount);
		}

		console.log(serverUrl);

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
					case 401:
						this.onValidationFail();
						break;
					default:  //other error, usually 500
						break;
				}
				console.log(res.json());
				throw new Error('get questions fail');
			}
			return res.json();
			
		}.bind(this))
		.then(function(data){
			var username = data.username;
			var questionListTemp = [];
			var oldestQuestionIdTemp = this.state.oldestQuestionId;
			var latestQuestionIdTemp = this.state.latestQuestionId;
			//update newer and older
			if(data.questions.length !== 0){
				if (loadNewer){
					latestQuestionIdTemp = data.questions[data.questions.length-1].questionid;
				} else if(loadOlder) {
					oldestQuestionIdTemp = data.questions[0].questionid;
				} else {
					oldestQuestionIdTemp = data.questions[0].questionid;
					latestQuestionIdTemp = data.questions[data.questions.length-1].questionid;
				}	
			}
			//question will always be in the order from oldest to newest
			for (var i = 0; i < data.questions.length; i++) {
				var question = data.questions[i];
				if ((question.answererusernames && (question.answererusernames.includes(username)) || question.askerusername === username)) {
					continue;
				}
				questionListTemp.unshift(question);
			}
			//update lower/newer accordingly
			if (loadNewer) {
				questionListTemp = questionListTemp.concat(this.state.questionList);

			} else if(loadOlder) {
				questionListTemp = this.state.questionList.concat(questionListTemp);
			}
			//otherwise questionListTemp itself is what we want
			//populate state
			this.setState({
				questionList: questionListTemp,
				username: username,
				oldestQuestionId: oldestQuestionIdTemp,
				latestQuestionId: latestQuestionIdTemp,
			});
			this.unblockLoadingQuestions();
			console.log("new oldest question Id " + this.state.oldestQuestionId);
			console.log("new latest question Id " + this.state.latestQuestionId);
			
		}.bind(this))
		.catch(function(err){
			this.unblockLoadingQuestions();
			console.log('get questions fail');
		}.bind(this));
	}

	/*
	Load more older questions and update oldatesQuestionId
	*/
	loadOlderQuestions(){
		
	}

	/*
	Load more newer questions and update latestQuestionId
	*/
	loadLaterQuestions(){
		console.log("loading more recent questions");
		this.loadQuestions(true, false);
		setTimeout(this.loadLaterQuestions.bind(this), 30000);
	}


	/////////////////////////////////////////////////////asking a question///////////////////////////////////////////////////////////////////
	onShowQuestionPostingForm(){
		this.setState({
			showQuestionPostingForm: true,
		})
	}

	onCancelCreateQuestion(){
		this.setState({
			showQuestionPostingForm: false,
		})
	}

	onSubmitQuestion(){
		this.setState({
			showQuestionPostingForm: false,
		})
	}

	onUserBusySubmittingQuestion(){
		this.refs["popupAlert"].showMessage("same user is submitting a question elsewhere, please try again later!");
	}

	onSubmitQuestionServerError(){
		this.refs["popupAlert"].showMessage("your submitted question failed to be created for server error");
	}




	///////////////////////////////////////////////////////populating a question's time slot////////////////////////////////////////////////

	/*
	When user click on a question's "yes" button, we provide him with time slots
	*/
	onAnswerQuestion(questionId, slots, askerUsername){
		//block updating
		if (this.state.blockLoadingQuestions) {
			return;
		} else {
			this.blockLoadingQuestions();
		}
		//current available slots
		var availableTimeSlots = new Set();
		var currentTimeInstant = new Date().getTime();
		//add all slots that are after current time to set
		for (var i = 0; i < slots.length; i++) {
			var slotInstant = new Date(slots[i]).getTime();
			if (currentTimeInstant >= slotInstant) {
				continue;
			}
			availableTimeSlots.add(slotInstant);
		}
		fetch('/getSlots/simple/'+askerUsername, {
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
						this.onValidationFail();
						break;
					default:  //other error, usually 500
						break;
				}
				throw new Error('get user slot fail');
			}
			return res.json();
			
		}.bind(this))
		.then(function(data){
			for (var i = 0; i < data.slots.length; i++) {
				var takenSlotInstant = new Date(data.slots[i].time).getTime();
				if (availableTimeSlots.has(takenSlotInstant)) {
					availableTimeSlots.delete(takenSlotInstant);
				}
			}
			//if no slot available for this question just delete it
			if (availableTimeSlots.size === 0){
				this.deleteQuestionById(questionId);
				this.unblockLoadingQuestions();
				this.refs["popupAlert"].showMessage("sorry the question has no compatible time with your schedule!", 5000);
				return;
			} 
			//show time slot form
			this.setState({
				timeSlotFormQuestionId: questionId,
				timeSlotFormAvailableTimeSlot: availableTimeSlots,
				showTimeSlotForm: true,
			});
		}.bind(this))
		.catch(function(err){
			//unblock loading
			this.unblockLoadingQuestions();
		}.bind(this));
	}

	/////////////////////////////////////////////////////confirm time//////////////////////////////////////////////////////////

	/*
	when user picked a time slot and confirm
	*/
	onTimeSlotFormConfirmTime(dateTime, questionId, comment) {
		//hide popup
		this.setState({
			showTimeSlotForm: false,
		})
		var time = new Date(dateTime).getTime();
		//send submittion to database
		fetch('/setSlots/confirm', {
			method: "POST",
			mode: 'cors',
			credentials: 'same-origin',
			body: JSON.stringify({
				time: time,
				questionId: questionId,
				comment: comment
			}),
			headers: {"Content-Type": "application/json"}
		})
		.then(function(res){
			if (!res.ok) {
				console.log(res.json());
				switch (res.status) {
					case 401: //validation fail
						this.onValidationFail();	
						break;
					default:  //other error, usually 500
						//give user a popup alert	
						break;
				}
				throw new Error('confirm appointment fail');
			}
			//no need to notify user
			//but we are going to remove a question from list. Here we do a binary search
			this.deleteQuestionById(questionId);
			this.unblockLoadingQuestions();
			
		}.bind(this))
		.catch(function(err){
			console.log("confirming date fail!");
			this.unblockLoadingQuestions();
			//some handle for error
		}.bind(this));
	}

	/*
	helper function to delete question using its ID
	*/
	deleteQuestionById(questionId){
		var questionListTemp = this.state.questionList;
		var index = -1;
		for (var i = 0; i < questionListTemp.length; i ++) {
			if (questionListTemp[i].questionid === questionId) {
				index = i;
				break;
			}
		}
		if(index >= 0) {
			questionListTemp.splice(index, 1);
			this.setState({
				questionList: questionListTemp,
			});
		}
	}

	/*
	when user clicked on the white region to cancel time slot confirmation
	*/
	onCancelAnswerQuestion(){
		this.setState({
			showTimeSlotForm: false,
		});
		this.unblockLoadingQuestions();
	}


	/////////////////////////////////////////////other functions////////////////////////////////////////////////////

	onValidationFail(){
		this.props.history.push('/signInSignUp');			
	}

	blockLoadingQuestions(){
		console.log("blocking loading questions");
		this.setState({
			blockLoadingQuestions: true,
		});
	}

	unblockLoadingQuestions(){
		console.log("unblocking loading questions");
		this.setState({
			blockLoadingQuestions: false,
		});
	}

	/////////////////////////////////////////////render view////////////////////////////////////////////////////////
	componentDidMount(){
		this.loadQuestions(false,false,30);
		//keep loading questions every a while
		setTimeout(this.loadLaterQuestions.bind(this), 30000);
		
	}


	renderQuestions(){
		var questionsToRender = [];
		for (var i = 0;  i < this.state.questionList.length; i++) {
			var question = this.state.questionList[i];

			questionsToRender.push(
				<QuestionWithAnswerButton key={question.questionid} title={question.title} content={question.content} questionId={question.questionid} 
				slots={question.slots} askerUsername={question.askerusername} onAnswerQuestion={(questionId, slots, askerUsername) => this.onAnswerQuestion(questionId, slots, askerUsername)}/>
			);
		}
		return questionsToRender;
	}

	render() {
		return (
			<div className="QuestionsContainer">
				<div className="AskingQuestionTriggerButton" onClick={()=>this.onShowQuestionPostingForm()}>Ask a Question</div>
				<QuestionPostingForm asPopup={true} show={this.state.showQuestionPostingForm} onCancelCreateQuestion={()=>this.onCancelCreateQuestion()} 
				onSubmit={()=>this.onSubmitQuestion()} onUserBusy={()=>this.onUserBusySubmittingQuestion()} onServerError={()=>this.onSubmitQuestionServerError()}
				onValidationFail={()=>this.onValidationFail()}/>

				{this.renderQuestions()}

				<TimeSlotFormForAnswerQuestion show={this.state.showTimeSlotForm} availableTimeSlots={this.state.timeSlotFormAvailableTimeSlot} 
				onConfirmTime={(dateTime, comment) => this.onTimeSlotFormConfirmTime(dateTime, this.state.timeSlotFormQuestionId, comment)}
				onCancelAnswerQuestion = {()=>this.onCancelAnswerQuestion()}/>
				<div className="LoadOlderQuestionsButton" onClick={() => this.loadOlderQuestions()}>Load me more questions</div>

				<PopupAlert ref="popupAlert"/>
			</div>
		);
	}
}

export default withRouter(Questions);
