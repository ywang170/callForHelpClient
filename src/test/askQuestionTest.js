import React, { Component } from 'react';
import QuestionPostingForm from '../utility/questionPostingForm/QuestionPostingForm';
import {withRouter} from 'react-router';

class AskQuestionTest extends Component{

	constructor(props){
		super(props);

		this.state={
			show: true,
		}
	}

	onValidationFail(){
		this.props.history.push('/signInSignUp');
	}

	onServerError(){
		console.log("server error")
	}

	onSubmit(){
		this.setState({
			show: false,
		});

		setTimeout(()=>{
			this.setState({
				show: true,
			})
		}, 1000);
	}

	onUserBusy(){

	}

	onCancelCreateQuestion(){
		this.setState({
			show: false,
		});

		setTimeout(()=>{
			this.setState({
				show: true,
			})
			console.log("what");
		}, 1000);
	}

	render(){
		return (
			<QuestionPostingForm asPopup={true} show={this.state.show} onValidationFail={()=>this.onValidationFail()} onSubmit={()=>this.onSubmit()}
			 onServerError={()=>this.onServerError()} onUserBusy={()=>this.onUserBusy()} onCancelCreateQuestion={()=>this.onCancelCreateQuestion()}/>
		);
	}
}

export default withRouter(AskQuestionTest);