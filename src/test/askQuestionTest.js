import React, { Component } from 'react';
import QuestionPostingForm from '../utility/questionPostingForm/QuestionPostingForm';
import {withRouter} from 'react-router';

class AskQuestionTest extends Component{

	onValidationFail(){
		this.props.history.push('/signInSignUp');
	}

	onServerError(){
		console.log("server error")
	}

	onSubmit(){

	}

	onUserBusy(){

	}

	render(){
		return (
			<QuestionPostingForm onValidationFail={()=>this.onValidationFail()} onServerError={()=>this.onServerError()} onSubmit={()=>this.onSubmit()} onUserBusy={()=>this.onUserBusy()}/>
		);
	}
}

export default withRouter(AskQuestionTest);