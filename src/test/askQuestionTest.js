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

	render(){
		return (
			<QuestionPostingForm onValidationFail={()=>this.onValidationFail()} onServerError={()=>this.onServerError()} />
		);
	}
}

export default withRouter(AskQuestionTest);