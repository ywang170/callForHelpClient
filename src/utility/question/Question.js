import React, { Component } from 'react';
import './Question.css';


/*
Simplest module to show a question

Props: 	
	title - question title
	content - question content
	askerUsername - username of the author

State:
	expand -default to false, click to expand question
*/
class Question extends Component {

	constructor(props){
		super(props);

		this.state={
			expand: false,
		}
	}

	toggleExpand(){
		this.setState({
			expand: !this.state.expand,
		});
	}


	render() {
		return (
			<div className="Question_questionContainer">
				<div className="Question_questionTitle" onClick={()=>this.toggleExpand()}>{this.props.title}</div>
				<div className={this.state.expand?"Question_questionContentExpand":"Question_questionContent"}>{this.props.content}</div>
				<div className="Question_expander" onClick={()=>this.toggleExpand()}>{this.state.expand?"^":"......"}</div>
				<div className="Question_questionAuthor">{this.props.askerUsername}</div>
			</div>
		);
	}
}

export default Question;