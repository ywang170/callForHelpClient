import React, { Component } from 'react';

/*
This component exist for efficiency only!!!
It doesn't even have its own css file...
only lives with QuestionPostingForm
*/
class TextareaComponent extends Component{
	constructor(props){
		super(props);

		this.state= {
			content:''
		}
	}

	updateContent(e) {
		this.setState({
			content: e.target.value,
		})
	}

	returnContent(){
		return this.state.content;
	}

	render() {
		return(
			<textarea className="QuestionPostingForm_questionContent" value={this.state.content} onChange={(e) => this.updateContent(e)} />
		);
	}
}

export default TextareaComponent;