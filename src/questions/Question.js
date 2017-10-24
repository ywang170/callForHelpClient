import React, { Component } from 'react';


/*
Description: the "question block" that shows one question
Props: 	
	title - question title
	content - question content
	onClick - when clicked on the "answer" button, will trigger function from "questions" with available slots and questionId so user can pick a time and send confirmation to server 
	questionId - used as parameter for onClick function
	slots - used as parameter for onClick function
*/
class Question extends Component {

	constructor(props) {
		super(props);
	}

	componentDidMount(){

	}

	render() {
		return (
			<div className="questionContainer">
				<div className="questionTitle">{this.props.title}</div>
				<div className="questionContent">{this.props.content}</div>
				<button className="answerButton" onClick={() => this.props.onClick(this.props.slots, this.props.questionId)}>I can answer!</button>
			</div>
		);
	}
}

export default Question;