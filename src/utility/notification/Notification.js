import React, {Component} from 'react';
import Header from '../../header/Header';
import './Notification.css'

/*
component used to get user notification

Props:
	onValidationFail - when user validation fail
	onServerError - on server error

State:
	latestNotificationId - the latest id used to grab newer notifications


*/
class Notification extends Component{

	constructor(props){
		super(props);

		this.state={
			latestNotificationId: '',
			notificationList: [1,2],
			showNotifications: false,
		}
	}

	toggleNotification(){
		if (this.state.showNotifications) {
			//empty notifications
			//send delete request to db
			//toggle state
			this.setState({
				showNotifications: false,
			});
		} else {
			this.setState({
				showNotifications: true,
			});
		}
	}

	loadNotifications(){
		console.log("loading new notifications");
		//load notification

		//change state

		//get notification
		setTimeout(this.loadNotifications.bind(this), 5000);
	}

	componentDidMount(){
		//get notification
		setTimeout(this.loadNotifications.bind(this), 5000);
	}
	
	render(){
		return (
			<div>
				<div className={((this.state.notificationList.length===0) || (this.state.showNotifications) )?"Notification_icon":"Notification_iconActive"} onClick={()=>this.toggleNotification()}/>
				{this.state.showNotifications?
				<div className="Notification_notificationsContainer">
				</div> :
				null
				}
			</div>
		);
	}
}

export default Notification;