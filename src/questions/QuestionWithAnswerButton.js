import React, { Component } from 'react';
import Question from '../utility/question/Question'
import './QuestionWithAnswerButton.css'

/*
Simple question wrap with "Question + answer button"

States:


Props: 	
	title - question title
	content - question content
	questionId - id of the question, kept here mostly because we need to pass back to parent
	slots - slot available for this question, kept here mostly because we need to pass back to parent
	askerUsername - username of the author
	onAnswerQuestion - on this question being answered, parent will be notified and popup the time slot form
*/
class QuestionWithAnswerButton extends Component {

	onAnswerQuestion() {
		this.props.onAnswerQuestion(this.props.questionId, this.props.slots, this.props.askerUsername);
	}

	render() {
		return (
			<div className="QuestionWithAnswerButton_questionWithAnswerButtonContainer">
				<Question title={this.props.title} content={this.props.content} askerUsername={this.props.askerUsername} />
				<button className="QuestionWithAnswerButton_answerQuestionButton" onClick={() => this.onAnswerQuestion()}>Y e s</button>
			</div>
		);
	}
}

export default QuestionWithAnswerButton;
