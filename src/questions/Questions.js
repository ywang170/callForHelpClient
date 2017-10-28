import React, { Component } from 'react';
import QuestionWithAnswerButton from './QuestionWithAnswerButton';
import TimeSlotFormForAnswerQuestion from './TimeSlotFormForAnswerQuestion';
import PopupAlert from '../utility/popupAlert/PopupAlert';
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
			//user info
			username: '',
		}
	}

	componentDidMount(){
		//load questions from server and get latest and oldest id
		fetch('/getQuestions', {
			method: "GET",
			mode: 'cors',
			credentials: 'same-origin',
			headers: {"Content-Type": "application/json"}
		})
		.then(function(res){
			if (!res.ok) {
				switch (res.status) {
					case 401:
						this.props.history.push('/signInSignUp');
						break;
					default:  //other error, usually 500
						break;
				}
				throw new Error('get questions fail');
			}
			return res.json();
			
		}.bind(this))
		.then(function(data){
			var username = data.username;
			var questionListTemp = [];
			var oldestQuestionIdTemp = 0;
			var latestQuestionIdTemp = 0;
			//question will always be in the order from oldest to newest
			for (var i = 0; i < data.questions.length; i++) {
				var question = data.questions[i];
				if ((question.answererusernames && (question.answererusernames.includes(username)) || question.askerusername === username)) {
					continue;
				}
				questionListTemp.unshift(question);
			}
			if(data.questions.length !== 0){
				oldestQuestionIdTemp = data.questions[0].questionid;
				latestQuestionIdTemp = data.questions[data.questions.length-1].questionid;
			}
			//populate state
			this.setState({
				questionList: questionListTemp,
				username: username,
				oldestQuestionId: oldestQuestionIdTemp,
				latestQuestionId: latestQuestionIdTemp,
			});
			//keep loading questions every a while
			setTimeout(this.loadLaterQuestions.bind(this), 60000);
			
		}.bind(this))
		.catch(function(err){
			console.log('get questions fail');
		});
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
		setTimeout(this.loadLaterQuestions.bind(this), 60000);
	}

	onAnswerQuestion(questionId, slots, askerUsername){
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
						this.props.history.push('/signInSignUp');
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
			
		});
	}

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
						this.props.history.push('/signInSignUp');					
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
			return res.json();
			
		}.bind(this))
		.then(function(data){

		})
		.catch(function(err){
			//some handle for error
		});
	}

	onCancelAnswerQuestion(){
		this.setState({
			showTimeSlotForm: false,
		});
	}

	shouldComponentUpdate(nextProps, nextState){
		return true;
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
