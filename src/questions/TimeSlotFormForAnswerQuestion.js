import React, { Component } from 'react';
import ScreenBlocker from '../utility/screenBlocker/ScreenBlocker'
import TimeSlotForm from '../utility/timeSlotForm/TimeSlotForm'
import './TimeSlotFormForAnswerQuestion.css'


class TimeSlotFormForAnswerQuestion extends Component{

	constructor(props) {
		super(props);

		this.state= {
			show: false,
			availableTimeInstants: [],
			questionId:'',
			timeSlotChosen:'',
			comment:'',
		}
	}

	show(questionId, availableTimeInstants){
		this.setState({
			questionId: questionId,
			availableTimeInstants: availableTimeInstants,
			show: true,
		});
	}

	off(){
		this.setState({
			show: false,
			timeSlotChosen: '',
			comment: '',
		});
	}

	confirm(){
		this.props.onConfirmTime(this.state.timeSlotChosen, this.state.questionId, this.state.comment);
		this.off();
	}

	updateComment(e){
		this.setState({
			comment: e.target.value
		});
	}

	onUnChoosingATimeSlot(dateTime){
		return true;
	}

	onChoosingATimeSlot(dateTime) {
		this.setState({
			timeSlotChosen: dateTime,
		})
		return true;
	}

	shouldComponentUpdate(nextProps, nextState){
		//we want to avoid overly updating
		if(nextState.show !== this.state.show || nextState.comment !== this.state.comment) {
			return true;
		}
		return false;
	}


	render(){
		return (
			<div>
			{
				this.state.show ?
					(
						<div>
							<ScreenBlocker onClick={() => this.off()}/>
							<div className="TimeSlotFormForAnswerQuestionContainer">
								<TimeSlotForm availableTimeInstants={this.state.availableTimeInstants} onlyOneChoice={true} days={3} 
							onChoosingATimeSlot={(dateTime) => this.onChoosingATimeSlot(dateTime)} onUnChoosingATimeSlot={(dateTime) => this.onUnChoosingATimeSlot(dateTime)}/>
								<textarea className="TimeSlotFormForAnswerQuestionComment" type="text" value = {this.state.comment} onChange={(e) => this.updateComment(e)}/>
								<button className="TimeSlotFormForAnswerQuestionConfirmButton" onClick={() => this.confirm()}>Confirm</button>
							</div>
						</div>
					)

					: null
			}
			</div>
		);
	}
}

export default TimeSlotFormForAnswerQuestion;