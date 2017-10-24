import React, { Component } from 'react';
import Question from './Question'
import './Questions.css';

class Questions extends Component {

	constructor(props) {
		super(props);

		this.state= {
			latestQuestionId: 0,
			oldestQuestionId: 0,
			currentQuestionNumber: 0,
			questionList: [],
			userSlots: [],
			
		}
	}

	componentDidMount(){
		//get all slots of current user

		//load questions from server

		//populate this.state.questionList
	}

	render() {
		return (
			<div></div>
		);
	}
}

export default Questions;
