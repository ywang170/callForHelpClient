import React, { Component } from 'react';
import Question from '../utility/question/Question'
import './QuestionWithAnswerButton.css'

/*
Simple question wrap with "Question + answer button"

States:


Props: 	
	title - question title
	content - question content
	questionId - id of the question
	slots - slot available for this question
	askerUsername - username of the author
	onAnswerQuestion - on this question being answered, parent will be notified and popup the time slot form
*/
class QuestionWithAnswerButton extends Component {

	onAnswerQuestion() {
		this.props.onAnswerQuestion(this.props.questionId, this.props.slots, this.props.askerUsername);
	}

	render() {
		return (
			<div className="questionWithAnswerButtonContainer">
				<Question title={this.props.title} content={this.props.content} askerUsername={this.props.askerUsername} />
				<button className="answerQuestionButton" onClick={() => this.onAnswerQuestion()}>I can help!</button>
			</div>
		);
	}
}

export default QuestionWithAnswerButton;
