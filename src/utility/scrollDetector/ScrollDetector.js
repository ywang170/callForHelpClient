import React, {Component} from 'react';


/*
detect scroll to bottom

Props:
	ononScrollToBottom - what to do when scroll to bottom
*/
class ScrollDetector extends Component {
	constructor(props){
		super(props);

		this.handleScroll = this.handleScroll.bind(this);
	}

	handleScroll(){
		const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
    	const body = document.body;
    	const html = document.documentElement;
    	const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
    	const windowBottom = windowHeight + window.pageYOffset;
    	if (windowBottom >= docHeight) {
    		this.props.onScrollToBottom();
    	}
	}

	componentWillReceiveProps(newProps){
		if(newProps.keepListening === false){
			window.removeEventListener("scroll", this.handleScroll);
		}
	}

	componentDidMount(){
		window.addEventListener("scroll", this.handleScroll);
	}

	componentWillUnmount(){
		window.removeEventListener("scroll", this.handleScroll);
	}

	render(){
		return (
			<div/>
		);
	}

}

export default ScrollDetector;