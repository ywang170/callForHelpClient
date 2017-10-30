import React, { Component } from 'react';
import Day from './Day';
import './TimeSlotForm.css';

/*
show 4 days with 24*4 = 96 slots at most. Though not every day may show up
This component is like a convenient input receiver
it doesn't deal with logic or server interaction at all
Just reflect what user chooses and tell parent component

Props: 	
	onChoosingATimeSlot - processing picking a time slot. System calling time slot form should be responsible for logic. Should return false when user did invalid choice or we doon't want user change anything
	onUnChoosingATimeSlot - processing click again to cancel. System calling time slot form should be responsible for logic Should return false when user did invalid choice or we doon't want user change anything
	availableTimeSlots - time instant in number that is available
	onlyOneChoice - is the form only allows one choice
	currentInstant - current's instant
	externalDays - like state days, but work as an external resource. If using external dates then parent will be responsible for updating which time slot is chosen
					Currently the only use case is when we show use slots and we don't want user to change anything

State:
	days -  very  important, this is 2D array shows which slot are chosen. "days" is not a very good name... maybe I should rename it to slotsMap
	
*/
class TimeSlotForm extends Component {


	constructor(props){
		super(props);

		this.state={
			days: null,
		}
	}

	componentWillMount(){
		if (this.props.externalDays){
			return;
		}

		var daysTemp = []
		for (var i = 0; i <= 3; i++){
			var SlotChosenArr = [];
			for (var j = 0; j < 24; j++) {
				SlotChosenArr.push(false);
			}
			daysTemp.push(SlotChosenArr);
		}
		this.setState({
			days: daysTemp,
		});
	}

	/*
	function to run when a time slot is chosen
	According to if this time slot form is "one choice only", it may clean the previous chosen time slot

	Params:
		day - which day does the slog belong
		slot - hr of the slot
		dateTime - the date and time being unchosen in local time

	Question:
		Q: Why we don't use state to record which slot was chosen before and when we choose another slot we only update the old slot?
		A: Because setting state will cause react js to render again. We just want each small slot instead of the whole picture to re-render. Of course you can 
		   avoid this by overriding shouldComponentUpdate, but we just want to make it more refreshable... Alright I'm lazy! Damn!
	*/
	onChoosingATimeSlot(day, slot, dateTime) {
		if (this.props.onChoosingATimeSlot(dateTime)) {
			var daysTemp;
			if (this.props.onlyOneChoice) {
				daysTemp = this.state.days;
				for (var i = 0; i <= 3; i++){
					for (var j = 0; j < 24; j++) {
						if (i === day && j === slot){
							daysTemp[i][j] = true;
						}else if(daysTemp[i][j]){
							daysTemp[i][j] = false;
						}	
					}
				}
				
			} else {
				daysTemp = this.state.days;
				daysTemp[day][slot] = true;
			}
			this.setState({
				days: daysTemp,
			});
		}
	}

	/*
	function to run when a time slot is unchosen

	Params:
		day - which day does the slog belong
		slot - hr of the slot
		dateTime - the date and time being unchosen in local time
	*/
	onUnChoosingATimeSlot(day, slot, dateTime) {
		if (this.props.onUnChoosingATimeSlot(dateTime)) {
			var daysTemp = this.state.days;
			daysTemp[day][slot] = false;
			this.setState({
				days: daysTemp,
			});
		}
	}

	componentWillReceiveProps(newProps){
		if (newProps.currentInstant !== this.props.currentInstant) {
			var daysTemp = []
			for (var i = 0; i <= 3; i++){
				var SlotChosenArr = [];
				for (var j = 0; j < 24; j++) {
					SlotChosenArr.push(false);
				}
				daysTemp.push(SlotChosenArr);
			}
			this.setState({
				days: daysTemp,
			});
		}
	}

	/*
	render all the days needed
	we put them together because we only want to show one "current"
	*/
	renderDays(){
		var daysToRender = [];
		var current = new Date(this.props.currentInstant);
		//day 1
		daysToRender.push (
		<Day key={0} date={current.toLocaleDateString()} availableTimeSlots={this.props.availableTimeSlots} slots={this.props.externalDays? this.props.externalDays[0] : this.state.days[0]}
		onChoosingATimeSlot={(slot, dateTime) => this.onChoosingATimeSlot(0, slot, dateTime)} 
		 onUnChoosingATimeSlot={(slot, dateTime) => this.onUnChoosingATimeSlot(0, slot, dateTime)} isLastDay={false}
		/>);
		current.setDate(current.getDate() + 1);
		//day 2
		daysToRender.push (
		<Day key={1} date={current.toLocaleDateString()} availableTimeSlots={this.props.availableTimeSlots} slots={this.props.externalDays? this.props.externalDays[1] : this.state.days[1]}
		onChoosingATimeSlot={(slot, dateTime) => this.onChoosingATimeSlot(1, slot, dateTime)} 
		 onUnChoosingATimeSlot={(slot, dateTime) => this.onUnChoosingATimeSlot(1, slot, dateTime)} isLastDay={false}
		/>);
		current.setDate(current.getDate() + 1);
		//day 3
		daysToRender.push (
		<Day key={2} date={current.toLocaleDateString()} availableTimeSlots={this.props.availableTimeSlots} slots={this.props.externalDays? this.props.externalDays[2] : this.state.days[2]}
		onChoosingATimeSlot={(slot, dateTime) => this.onChoosingATimeSlot(2, slot, dateTime)} 
		 onUnChoosingATimeSlot={(slot, dateTime) => this.onUnChoosingATimeSlot(2, slot, dateTime)} isLastDay={false}
		/>);
		current.setDate(current.getDate() + 1);
		//day 4
		daysToRender.push (
		<Day key={3} date={current.toLocaleDateString()} availableTimeSlots={this.props.availableTimeSlots} slots={this.props.externalDays? this.props.externalDays[3] : this.state.days[3]}
		onChoosingATimeSlot={(slot, dateTime) => this.onChoosingATimeSlot(3, slot, dateTime)} 
		 onUnChoosingATimeSlot={(slot, dateTime) => this.onUnChoosingATimeSlot(3, slot, dateTime)} isLastDay={true}
		/>);

		return daysToRender;

	}
	
	/*
	render
	*/
	render() {
		return (
			<div className="TimeSlotForm_timeSlotFormContainer">
				<div className="TimeSlotForm_timeSlotFormInnerContainer">
					{this.renderDays()}
				</div>
			</div>
		);
	}
}

export default TimeSlotForm;