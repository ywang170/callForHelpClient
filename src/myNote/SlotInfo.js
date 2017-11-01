import React, { Component } from 'react';
import ScreenBlocker from '../utility/screenBlocker/ScreenBlocker';
import './SlotInfo.css';


/*
Show information of an appointment
*/
class SlotInfo extends Component {



	render() {
		var time = new Date(this.props.slot.time).toString();
		return (
			<div>
				<ScreenBlocker onClick={this.props.hideSlotInfo} />
				<div className="SlotInfo_slotInfoContainer">
					{this.props.slot.user1isasker?
						<div>
							<div className="SlotInfo_infoBlock">Appointment with <span>{this.props.slot.user2username}</span> at <span>{time}</span>. </div>
							<div className="SlotInfo_infoBlock">on your question <span>{this.props.slot.questiontitle}</span> </div>
							<div className="SlotInfo_infoBlock">You may call <span>{this.props.slot.user2phone}</span></div>
							{this.props.slot.comment?
							 	<div className="SlotInfo_infoBlock">Here is his/her message: <span>{this.props.slot.comment}</span></div>:
							 	null
							}
						</div>
						:
						<div>
							<div className="SlotInfo_infoBlock">Appointment with <span>{this.props.slot.user2username}</span> at <span>{time}</span>. </div>
							<div className="SlotInfo_infoBlock">on his/her question <span> {this.props.slot.questiontitle} </span></div>
							<div className="SlotInfo_infoBlock">You may call <span>{this.props.slot.user2phone}</span></div>
							{this.props.slot.comment?
							 	<div className="SlotInfo_infoBlock">Here is the message you left him/her: <span>{this.props.slot.comment}</span></div>:
							 	null
							}
						</div>
					}
				</div>
			</div>
		);
	}
}

export default SlotInfo;