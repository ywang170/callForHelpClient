import React, { Component } from 'react';

class cookieTest extends Component{

	constructor(props) {
		super(props);

		this.state= {
			ifSuccessGet: 0,
			ifSuccessPost: 0
		}
	}

	componentDidMount(){
		//sending post and get to test if cookie get received
		fetch('/cookieTestGet', {
			method: "GET",
			mode: 'cors',
			credentials: 'same-origin',
			headers: {"Content-Type": "application/json"}
		})
		.then(function(res){
			console.log(res);
			return res.json();
			
		})
		.then(function(data){
			console.log(data);
		})
		.catch(function(err){
			console.log('error!');
		});

		fetch('/cookieTestPost', {
			method: "POST",
			mode: 'cors',
			credentials: 'same-origin',
			headers: {"Content-Type": "application/json"}
		})
		.then(function(res){
			console.log(res);
			return res.json();
			
		})
		.then(function(data){
			console.log(data);
		})
		.catch(function(err){
			console.log('error!');
		});

	}

  	render(){
  		return(
  			<div>
  				<p>Post: {this.state.ifSuccessPost}</p>
  				<p>Get: {this.state.ifSuccessGet}</p>
  			</div>
  		);
  	}
}


export default cookieTest;