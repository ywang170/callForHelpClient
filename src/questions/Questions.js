import React, { Component } from 'react';
import QuestionWithAnswerButton from './QuestionWithAnswerButton';
import TimeSlotFormForAnswerQuestion from './TimeSlotFormForAnswerQuestion';
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
		//variables need to populate and set to state later
		var questionListTemp = [];
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
			for (var i = 0; i < data.questions.length; i++) {
				var question = data.questions[i];
				if ((question.answererusernames && (question.answererusernames.includes(username)) || question.askerusername === username)) {
					continue;
				}
				questionListTemp.push(question)
			}
			//populate state
			this.setState({
				questionList: questionListTemp,
				username: username,

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
		for (var i = 0; i < slots.length; i++) {
			var slotInstant = new Date(slots[i]).getTime();
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

	onTimeSlotFormConfirmTime(dateTime, questionId, comment) {
		console.log(dateTime);
		console.log(questionId);
		console.log(comment);

		//block auto-refreshing
		this.setState({
			showTimeSlotForm: false,
		})
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
			</div>
		);
	}
}

export default withRouter(Questions);
