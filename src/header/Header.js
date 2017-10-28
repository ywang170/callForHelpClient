import React, { Component } from 'react';
import {withRouter} from 'react-router';
import bkgd from "../image/background1.jpg";
import './Header.css';

class Header extends Component{


	render(){
		return (
			<div className="Header_banner">
				<img className="Header_img" src={bkgd} alt="image can not load...:\"/>
				<div className="Header_title"></div>
				
			</div>
		);
	}
}

export default withRouter(Header);