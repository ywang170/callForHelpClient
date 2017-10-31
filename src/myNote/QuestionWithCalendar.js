import React, { Component } from 'react';
import Question from '../utility/question/Question';
import './QuestionWithCalendar.css';

class QuestionWithCalendar extends Component {

	render() {
		return (
			<div className={this.props.chosen?"MyNote_questionWrapperChosen":"MyNote_questionWrapper"}>
				<Question title={this.props.title} content={this.props.content} askerUsername={this.props.username} />
				<div className="MyNote_calendarIcon" onClick={()=>this.props.onQuestionChosen(this.props.slots, this.props.questionId)}/>
			</div>
		);
	}
}

export default QuestionWithCalendar;