import React, { Component } from 'react';


/*
Simplest module to show a question

Props: 	
	title - question title
	content - question content
	askerUsername - username of the author
*/
class Question extends Component {


	render() {
		return (
			<div className="questionContainer">
				<div className="questionTitle">{this.props.title}</div>
				<div className="questionContent">{this.props.content}</div>
				<div className="questionAuthor">{this.props.askerUsername}</div>
			</div>
		);
	}
}

export default Question;