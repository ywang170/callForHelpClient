import React, { Component } from 'react';
import {withRouter} from 'react-router';
import './Header.css';

class Header extends Component{

	toUrl(url){
		this.props.history.push(url);
	}

	render(){
		return (
			<div className="Header_banner">
				<div className="Header_links">
					<a className="Header_link" onClick={()=>this.toUrl('/questions')}>Home</a>
					<a className="Header_link">My Note</a>
					<a className="Header_link">Setting</a>
					<a className="Header_link" onClick={()=>this.toUrl('/signInSignUp')}>Login/Register</a>
					<a className="Header_link" onClick={()=>this.toUrl('/credit')}>Credit</a>
				</div>
				<div className="Header_title"></div>
				
			</div>
		);
	}
}

export default withRouter(Header);