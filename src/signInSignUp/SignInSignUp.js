import React, { Component } from 'react';
import {withRouter} from 'react-router';
import PopupAlert from '../utility/popupAlert/PopupAlert';
import './SignInSignUp.css';

class SignInSignUp extends Component {

	constructor(props) {
		super(props);

		this.state= {
			//some properties
			signUp: false,
			//sign in s
			username: '',
			password: '',
			//sign up only
			passwordAgain: '',
			email: '',
			phone: '',
		}
	}

	componentWillMount() {
		if (this.props.match.params.register) {
			this.setState({
				signUp: true,
			});
		}
	}

	toggleSignInSignUp() {
		this.cleanAllInput();
		if (this.state.signUp) {
			this.setState({
				signUp: false,
			});
		} else {
			this.setState({
				signUp: true,
			});
		}
	}

	cleanAllInput () {
		this.setState({
			//sign in s
			username: '',
			password: '',
			//sign up only
			passwordAgain: '',
			email: '',
			phone: '',
		});
	}

	updateUsername(e) {
		this.setState({
			username: e.target.value
		});
	}

	updatePassword(e) {
		this.setState({
			password: e.target.value
		});
	}

	updatePasswordAgain(e) {
		this.setState({
			passwordAgain: e.target.value
		});
	}

	updatePhone(e) {
		this.setState({
			phone: e.target.value
		});
	}

	updateEmail(e) {
		this.setState({
			email: e.target.value
		});
	}

	submitSignUp() {
		//username
		if (this.state.username.length < 3 || this.state.username.length > 20) {
			this.refs["PopupAlert"].showMessage('username must be between 3 to 20 characters');
			return;
		} 
		//password
		if (this.state.password.length < 6 || this.state.password.length > 20|| this.state.password.toUpperCase() === this.state.password || this.state.password.toLowerCase() === this.state.password) {
			this.refs["PopupAlert"].showMessage('password must be between 6 to 20 characters and contains at least 1 lower/upper case letter');
			return;
		}
		//password again
		if (this.state.password !== this.state.passwordAgain) {
			this.refs["PopupAlert"].showMessage('password must be the same');
			return;
		} 
		//phone
		if (!this.state.phone || isNaN(this.state.phone)) {
			this.refs["PopupAlert"].showMessage('phone number is not valid');
			return;
		} 
		//email
		if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email))) {
			this.refs["PopupAlert"].showMessage('email is not valid');
			return;
		} 

		//send request
		fetch('/register', {
			method: "POST",
			mode: 'cors',
			credentials: 'same-origin',
			body: JSON.stringify({
				username: this.state.username,
				password: this.state.password,
				email: this.state.email,
				phone: this.state.phone
			}),
			headers: {"Content-Type": "application/json"}
		})
		.then(function(res){
			if (!res.ok) {
				switch (res.status) {
					case 400: //bad input
						this.refs["PopupAlert"].showMessage('input is not valid');
						break;
					case 409: //username taken
						this.refs["PopupAlert"].showMessage('username is already taken');
						break;
					default:  //other error, usually 500
						this.refs["PopupAlert"].showMessage('system error, please try again later');
						break;
				}
				throw new Error('register fail');
			}
			console.log(res);
			return res.json();
			
		}.bind(this))
		.then(function(data){
			console.log(data);
			//navigate user to main page
			this.props.history.push('/questions');
		}.bind(this))
		.catch(function(err){
			console.log('register fail');
		});

	}

	submitSignIn() {
		//check input valid
		var inputValid = true;
		//username
		if (this.state.username.length < 3 || this.state.username.length > 20) {
			this.refs["PopupAlert"].showMessage('username must be between 3 to 20 characters');
			return;
		} 
		//password
		if (this.state.password.length < 6 || this.state.password.length > 20|| this.state.password.toUpperCase() === this.state.password || this.state.password.toLowerCase() === this.state.password) {
			this.refs["PopupAlert"].showMessage('password must be between 6 to 20 characters and contains at least 1 lower/upper case letter');
			return;
		}

		//send to data base
		fetch('/logIn', {
			method: "POST",
			mode: 'cors',
			credentials: 'same-origin',
			body: JSON.stringify({
				username: this.state.username,
				password: this.state.password,
				needSessionKey: true
			}),
			headers: {"Content-Type": "application/json"}
		})
		.then(function(res){
			if (!res.ok) {
				switch (res.status) {
					case 400: //bad input
						this.refs["PopupAlert"].showMessage('input is not valid');
						break;
					case 401: //username and password not matching
						this.refs["PopupAlert"].showMessage('no matching username/password found');
						break;
					case 404: //username not found
						this.refs["PopupAlert"].showMessage('no matching username/password found');
						break;
					default:  //other error, usually 500
						this.refs["PopupAlert"].showMessage('system error, please try again later');
						break;
				}
				this.cleanAllInput();
				throw new Error('log in fail');
			}
			console.log(res);
			return res.json();
			
		}.bind(this))
		.then(function(data){
			console.log(data);
			//navigate user to main page
			this.props.history.push('/questions');
		}.bind(this))
		.catch(function(err){
			console.log('log in fail');
		});

	}

	render() {
		var moduleToShow;//decide if show sign up module or sign in module
		if (this.state.signUp) {
			moduleToShow = 
			<div className="signUpDiv">
				<ul>
					<li>
						<div className="fieldSpan">username* </div>
						<input className="usernameInput" type = "text" value = {this.state.username} onChange={(e) => this.updateUsername(e)} />
					</li>
					<li>
						<div className="fieldSpan">password*: </div>
						<input className="passwordInput" type = "password" value = {this.state.password} onChange={(e) => this.updatePassword(e)} />
					</li>
					<li>
						<div className="fieldSpan">please enter password again* </div>
						<input className="passwordInput" type = "password" value = {this.state.passwordAgain} onChange={(e) => this.updatePasswordAgain(e)} />
					</li>
					<li>
						<div className="fieldSpan">phone* </div>
						<input className="phoneInput" type = "text" value = {this.state.phone} onChange={(e) => this.updatePhone(e)} />
					</li>
					<li>
						<div className="fieldSpan">email* </div>
						<input className="emailInput" type = "email" value = {this.state.email} onChange={(e) => this.updateEmail(e)} />
					</li>
				</ul>
				<button className="confirmButton" onClick={() => this.submitSignUp()}>Done!</button>
			</div>
		} else {
			moduleToShow = 
			<div className="signInDiv">
				<ul>
					<li>
						<div className="fieldSpan">username* </div>
						<input className="usernameInput" type = "text" value = {this.state.username} onChange={(e) => this.updateUsername(e)} />
					</li>
					<li>
						<div className="fieldSpan">password* </div>
						<input className="passwordInput" type = "password" value = {this.state.password} onChange={(e) => this.updatePassword(e)} />
					</li>
				</ul>
				<button className="confirmButton" onClick={() => this.submitSignIn()}>Go!</button>
			</div>
		}

		//return content
		return (
			<div className="signInSignUpContainer">
				<PopupAlert ref={"PopupAlert"} />
				<div className="signInSignUpSubContainer">
					<div className="title">{this.state.signUp? "Create a New Account":"User Login"}</div>
					<a className="toggleButton" onClick={() => this.toggleSignInSignUp()}>{this.state.signUp?"I have an account":"register today!"}</a>
					{moduleToShow}
				</div>
			</div>
		);
	}
}

export default withRouter(SignInSignUp);




