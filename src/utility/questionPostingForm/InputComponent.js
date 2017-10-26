import React, { Component } from 'react';

/*
This component exist for efficiency only!!!
It doesn't even have its own css file...
only lives with QuestionPostingForm
*/
class InputComponent extends Component{
	constructor(props){
		super(props);

		this.state= {
			title:''
		}
	}

	updateTitle(e) {
		this.setState({
			title: e.target.value,
		})
	}

	returnTitle(){
		return this.state.title;
	}

	clear(){
		this.setState({
			title:'',
		});
	}

	render() {
		return(
			<input className="QuestionPostingForm_questionTitle" type="text" value={this.state.title} onChange={(e) => this.updateTitle(e)}/>
		);
	}
}

export default InputComponent;