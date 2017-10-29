import React, { Component } from 'react';
import QuestionWithAnswerButton from './QuestionWithAnswerButton';
import TimeSlotFormForAnswerQuestion from './TimeSlotFormForAnswerQuestion';
import PopupAlert from '../utility/popupAlert/PopupAlert';
import QuestionPostingForm from '../utility/questionPostingForm/QuestionPostingForm';
import Header from '../header/Header';
import ScrollDetector from '../utility/scrollDetector/ScrollDetector';
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
			loadingOlderQuestions: false,
			noMoreOlderQuestions: false,
			//user info
			username: '',
		}
	}

	//////////////////////////////////////////////////////questions Loading//////////////////////////////////////////////////////////////////

	/*
	Logic here is important!!
	We only load older or newer or everything
	when we load older or newer, we just append to list. In the thrid case when load everything, we replace the old list

	In case we didn't find anything suitable to put into question list:
		happens when we load a bunch of question, but none of them is suitable for user to answer, then we will remove them from list
		Now we have an empty list, but fortunately, when the number of questions < 20 we will keep calling "loadOlderQuestions" until no more can be loaded

	In case we didn't load any questions from server at all...:
		this means no available questions in database
		In this bad situation, latestQuestionId and oldestQuestionId will not be updated
		Fortunately nothing will be messed up because in every kind of loading, the query we passed to server is valid
		For example, we have no quesstions and latestQuestionId = 0. Now when we auto load newer questions, since the latestQuestionId we passed in is 0, server will
		think it as a load all query. And for whatever we get from server, it is fine to use client "load newer" rule and just append to questionList since we have none in
		the list from very beginning.
		In reality what more likely to happen is we load no questions from db at all, then loadOlderQuestions will trigger and load none as well, then load older will be disabled.
		Then we periodically wait for loadNewerQuestions to see what we can find
	*/
	loadQuestions(loadNewer, loadOlder, amount){
		if (this.state.blockLoadingQuestions) {
			console.log("was trying to load more questions but action was blocked");
			return;
		}
		this.blockLoadingQuestions(loadOlder);
		var serverUrl = '/getQuestions';

		if (!amount || isNaN(amount) || amount <= 0 || amount > 100) {
			amount = 20;
		}

		if (loadNewer && this.state.latestQuestionId && this.state.latestQuestionId !== 0) {
			serverUrl += ('/' + this.state.latestQuestionId + '/0/' + amount );

		} else if (loadOlder && this.state.oldestQuestionId && this.state.oldestQuestionId !== 0) {
			serverUrl += ('/0/' + this.state.oldestQuestionId + '/' + amount);
		} else {
			serverUrl += '/0/0/' + amount;
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
			//if user switched then we reload the page!
			if (this.state.username && username && this.state.username !== username) {
				console.log("you switched user...humm");
				window.location.reload();
				return;
			}
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
				if ((question.answererusernames && question.answererusernames.includes(username)) || question.askerusername === username) {
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
				username: username? username: this.state.username,
				noMoreOlderQuestions: (loadOlder && (oldestQuestionIdTemp === this.state.oldestQuestionId))? true: this.state.noMoreOlderQuestions,
				oldestQuestionId: oldestQuestionIdTemp,
				latestQuestionId: latestQuestionIdTemp,
			});
			//if there are too fewer questions then load more
			this.unblockLoadingQuestions(loadOlder);
			if (this.state.questionList.length < 20) {
				this.loadOlderQuestions();
			}
			console.log("new oldest question Id " + this.state.oldestQuestionId);
			console.log("new latest question Id " + this.state.latestQuestionId);
			console.log("current user " + this.state.username);
			
		}.bind(this))
		.catch(function(err){
			this.unblockLoadingQuestions(loadOlder);
			console.log('get questions fail');
		}.bind(this));
	}

	/*
	Load more older questions and update oldatesQuestionId
	*/
	loadOlderQuestions(){
		if (this.state.noMoreOlderQuestions){
			return;
		}
		this.loadQuestions(false, true);
	}

	/*
	Load more newer questions and update latestQuestionId
	*/
	loadLaterQuestions(){
		console.log("loading more recent questions");
		this.loadQuestions(true, false);
	}


	/////////////////////////////////////////////////////asking a question///////////////////////////////////////////////////////////////////
	onShowQuestionPostingForm(){
		//block updating
		if (this.state.blockLoadingQuestions) {
			return;
		} else {
			this.blockLoadingQuestions();
		}
		this.setState({
			showQuestionPostingForm: true,
		})
	}

	onCancelCreateQuestion(){
		this.setState({
			showQuestionPostingForm: false,
		})
		this.unblockLoadingQuestions();
	}

	onSubmitQuestion(){
		this.setState({
			showQuestionPostingForm: false,
		})
		this.unblockLoadingQuestions();
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
			return res.json();
			
		}.bind(this))
		.then(function(data){
			this.refs["popupAlert"].showMessage("Thank you for your help! " + data.askerUsername +" will call you at " + new Date(data.time) +
				" using possible phone number: " + data.askerPhone, 5000);
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

	blockLoadingQuestions(loadOlder){
		console.log("blocking loading questions");
		this.setState({
			blockLoadingQuestions: true,
			loadingOlderQuestions: loadOlder? true: this.state.loadingOlderQuestions,
		});
	}

	unblockLoadingQuestions(loadOlder){
		console.log("unblocking loading questions");
		this.setState({
			blockLoadingQuestions: false,
			loadingOlderQuestions: loadOlder? false: this.state.loadingOlderQuestions,
		});
	}

	onScrollToBottom(){
		this.loadOlderQuestions();
	}

	/////////////////////////////////////////////render view////////////////////////////////////////////////////////
	componentWillUnmount(){
		clearInterval(this.timeInterval);
	}

	componentDidMount(){
		this.loadQuestions(false,false,30);
		console.log(this.state.username);
		//keep loading questions every a while
		this.timeInterval = setInterval(this.loadLaterQuestions.bind(this), 30000);
		
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
			<div>
				<Header />
				<div className="QuestionsContainer">
					<div className="AskingQuestionTriggerButton" onClick={()=>this.onShowQuestionPostingForm()}>Ask a Question</div>
					<QuestionPostingForm asPopup={true} show={this.state.showQuestionPostingForm} onCancelCreateQuestion={()=>this.onCancelCreateQuestion()} 
					onSubmit={()=>this.onSubmitQuestion()} onUserBusy={()=>this.onUserBusySubmittingQuestion()} onServerError={()=>this.onSubmitQuestionServerError()}
					onValidationFail={()=>this.onValidationFail()}/>

					{this.renderQuestions()}

					<TimeSlotFormForAnswerQuestion show={this.state.showTimeSlotForm} availableTimeSlots={this.state.timeSlotFormAvailableTimeSlot} 
					onConfirmTime={(dateTime, comment) => this.onTimeSlotFormConfirmTime(dateTime, this.state.timeSlotFormQuestionId, comment)}
					onCancelAnswerQuestion = {()=>this.onCancelAnswerQuestion()}/>
					{this.state.noMoreOlderQuestions? 
						<div className="NoMoreOlderQuestionsWarning">No more...Above is all we got :P</div> :
						<div className={this.state.loadingOlderQuestions?"LoadOlderQuestionsButtonDisable":"LoadOlderQuestionsButton"} onClick={() => this.loadOlderQuestions()}>
							{this.state.loadingOlderQuestions?"Loading...":"Load me more questions"}
						</div>
					}
					<PopupAlert ref="popupAlert"/>
				</div>
				<ScrollDetector onScrollToBottom={() => this.onScrollToBottom()} keepListening={!this.state.noMoreOlderQuestions}/>
			</div>
		);
	}
}

export default withRouter(Questions);
