import React, { Component } from 'react';
import TimeSlotForm from '../utility/timeSlotForm/TimeSlotForm';


class timeSlotFormTest extends Component{


	testFunc(dateTime){
		return true;
	}

	renderTest(){
		var today = new Date();
		today.setHours(0);
		today.setMinutes(0);
		today.setSeconds(0);
		today.setMilliseconds(0);
		var availableTimeInstants = new Set();
		for(var i = 0; i < 30; i++) {
			availableTimeInstants.add(today.getTime());
			today.setHours(today.getHours()+3);
		}

		return (
			<div>
				lalalal
				<TimeSlotForm availableTimeInstants={availableTimeInstants} onChoosingATimeSlot={this.testFunc} onUnChoosingATimeSlot={this.testFunc} onlyOneChoice={true} days={3}/>
			</div>	
		);
	}


  	render(){
  		return(
  			<div>
  				{this.renderTest()}
  			</div>
  		);
  	}
}


export default timeSlotFormTest;