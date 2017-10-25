import React, { Component } from 'react';
import QuestionWithAnswerButton from './QuestionWithAnswerButton';
import TimeSlotFormForAnswerQuestion from './TimeSlotFormForAnswerQuestion';
import {withRouter} from 'react-router';
import './Questions.css';


/*
List of questions 
This can be a stand alone app
It can be reponsible for loading questions, showing questions

States:
	latestQuestionId: id of the latest question, used to load newer questions
	oldestQuestionId: id of the oldest question, used to load older questions
	questionList: list of all questions
	autoRefreshBlocking: if refreshing(getting more questions) is currently blocked

Props:
	userSlots: time slots that are already taken for the user. Used to filter 
*/
class Questions extends Component {

	constructor(props) {
		super(props);

		this.state= {
			latestQuestionId: 0,
			oldestQuestionId: 0,
			questionList: [],
			autoRefreshBlocked: false,
			screenBlocked: false,
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
			questionListTemp = data.questions.slice();
			//populate state
			this.setState({
				questionList: questionListTemp,
			});
			
		}.bind(this))
		.catch(function(err){
			console.log('get questions fail');
		});
	}

	loadOlderQuestions(){
		
	}

	loadLaterQuestions(){

	}

	onAnswerQuestion(questionId, slots, askerUsername){
		//block auto-refreshing
		this.setState({
			autoRefreshBlocked: true,
			screenBlocked: true
		})
		//current available slots
		var availableTimeInstants = new Set();
		for (var i = 0; i < slots.length; i++) {
			var slotInstant = new Date(slots[i]).getTime();
			availableTimeInstants.add(slotInstant);
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
				console.log('get user slot fail');
				throw new Error('get user slot fail');
			}
			return res.json();
			
		}.bind(this))
		.then(function(data){
			for (var i = 0; i < data.slots.length; i++) {
				var takenSlotInstant = new Date(data.slots[i].time).getTime();
				if (availableTimeInstants.has(takenSlotInstant)) {
					availableTimeInstants.delete(takenSlotInstant);
				}
			}
			//show time slot form
			this.refs["timeSlotFormForAnswerQuestion"].show(questionId, availableTimeInstants);
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
			autoRefreshBlocked: false,
			screenBlocked: false,
		})
	}

	renderQuestions(){
		var questionsToRender = [];
		for (var i = 0;  i < this.state.questionList.length; i++) {
			var question = this.state.questionList[i];

			questionsToRender.push(
				<QuestionWithAnswerButton key={i} title={question.title} content={question.content} questionId={question.questionid} 
				slots={question.slots} askerUsername={question.askerusername} onAnswerQuestion={(questionId, slots, askerUsername) => this.onAnswerQuestion(questionId, slots, askerUsername)}/>
			);
		}
		return questionsToRender;
	}

	render() {
		return (
			<div className="QuestionsContainer">
				{this.renderQuestions()}
				<TimeSlotFormForAnswerQuestion ref={"timeSlotFormForAnswerQuestion"} onConfirmTime={(dateTime, questionId, comment) => this.onTimeSlotFormConfirmTime(dateTime, questionId, comment)}/>
				<div className="LoadOlderQuestionsButton" onClick={() => this.loadOlderQuestions()}>load older</div>
			</div>
		);
	}
}

export default withRouter(Questions);
