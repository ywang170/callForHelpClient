import React, { Component } from 'react';
import ScreenBlocker from '../utility/screenBlocker/ScreenBlocker';
import TimeSlotForm from '../utility/timeSlotForm/TimeSlotForm';
import TextareaComponent from '../utility/textInput/TextareaComponent';

import './TimeSlotFormForAnswerQuestion.css'



/*
time slot form with a comment area

Props:
	onConfirmTime - function to call once user confirm the time
	onCancelAnswerQuestion - when user don't want to answer any more and click somewhere to cancel
	show - if this time slot form should render
	
*/
class TimeSlotFormForAnswerQuestion extends Component{

	constructor(props) {
		super(props);

		this.state= {
			timeSlotChosen:'',
			currentInstant:'',
		}
	}

	confirm(){
		this.props.onConfirmTime(this.state.timeSlotChosen, this.refs["comment"].getValue())
	}

	onUnChoosingATimeSlot(dateTime){
		this.setState({
			timeSlotChosen: '',
		})
		return true;
	}

	onChoosingATimeSlot(dateTime) {
		this.setState({
			timeSlotChosen: dateTime,
		})
		return true;
	}

	componentDidMount() {
		this.setState({
			timeSlotChosen: '',
			currentInstant: new Date().getTime()
		})
	}

	componentWillReceiveProps(newProps) {
		if (newProps.show === true) {
			this.setState({
				timeSlotChosen: '',
				currentInstant: new Date().getTime()
			});
		}
	}

	shouldComponentUpdate(nextProps, nextState){
		//we want to avoid overly updating
		if(nextProps.show !== this.props.show) {
			return true;
		}
		return false;
	}


	render(){
		return (
			<div>
			{
				this.props.show ?
					(
						//we put screen blocker here instead of "Questions" component because there could be more apps each having cancel action on different things
						<div>
							<ScreenBlocker onClick={this.props.onCancelAnswerQuestion}/>
							<div className="TimeSlotFormForAnswerQuestionContainer">
								<TimeSlotForm currentInstant={this.state.currentInstant} availableTimeSlots={this.props.availableTimeSlots} onlyOneChoice={true} days={3} 
							onChoosingATimeSlot={(dateTime) => this.onChoosingATimeSlot(dateTime)} onUnChoosingATimeSlot={(dateTime) => this.onUnChoosingATimeSlot(dateTime)}/>
								<TextareaComponent cssClass="TimeSlotFormForAnswerQuestionComment" ref="comment"/>
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