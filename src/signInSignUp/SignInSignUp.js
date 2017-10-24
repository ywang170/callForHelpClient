import React, { Component } from 'react';
import './SignInSignUp.css';

class SignInSignUp extends Component {

	constructor(props) {
		super(props);

		this.state= {
			//some properties
			generalWarning: '',
			signUp: false,
			title: '',
			toggleTarget: '',
			//sign in s
			username: '',
			password: '',
			usernameWarning: '',
			passwordWarning: '',
			//sign up only
			passwordAgain: '',
			email: '',
			phone: '',
			passwordAgainWarning: '',
			emailWarning: '',
			phoneWarning: '',
		}
	}

	componentDidMount() {
		if (this.state.signUp) {
			this.setState({
				title: 'Sign Up',
				toggleTarget: 'I have an account!'
			});
		} else {
			this.setState({
				title: 'Sign In',
				toggleTarget: 'Sign up today!'
			});
		}
	}

	toggleSignInSignUp() {
		if (this.state.signUp) {
			this.setState({
				signUp: false,
				title: 'Sign In',
				toggleTarget: 'Sign up today!',
				warningBanner: ''
			});
		} else {
			this.setState({
				signUp: true,
				title: 'Sign Up',
				toggleTarget: 'I have an account!',
				warningBanner: ''
			});
		}
		this.cleanAllInput();
	}

	cleanAllInput () {
		this.setState({
			generalWarning: '',
			//sign in s
			username: '',
			password: '',
			usernameWarning: '',
			passwordWarning: '',
			//sign up only
			passwordAgain: '',
			email: '',
			phone: '',
			passwordAgainWarning: '',
			emailWarning: '',
			phoneWarning: '',
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
		//check input valid
		var inputValid = true;
		//username
		if (this.state.username.length < 3 || this.state.username.length > 20) {
			this.setState({
				usernameWarning: '*username must be between 3 to 20 characters'
			});
			inputValid = false;
		} else {
			this.setState({
				usernameWarning: ''
			});
		}
		//password
		if (this.state.password.length < 6 || this.state.password.length > 20|| this.state.password.toUpperCase() === this.state.password || this.state.password.toLowerCase() === this.state.password) {
			this.setState({
				passwordWarning: '*password must be between 6 to 20 characters and contains at least 1 lower/upper case letter'
			});
			inputValid = false;
		} else {
			this.setState({
				passwordWarning: ''
			});
		}
		//password again
		if (this.state.password !== this.state.passwordAgain) {
			this.setState({
				passwordAgainWarning: '*password should be the same'
			});
			inputValid = false;
		} else {
			this.setState({
				passwordAgainWarning: ''
			});
		}
		//phone
		if (!this.state.phone || isNaN(this.state.phone)) {
			this.setState({
				phoneWarning: '*phone number is required and must be valid'
			});
			inputValid = false;
		} else {
			this.setState({
				phoneWarning: ''
			});
		}
		//email
		if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email))) {
			this.setState({
				emailWarning: '*email address is required and email address must be valid'
			});
		} else {
			this.setState({
				emailWarning: ''
			});
		}

		if (!inputValid) {
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
						this.setState({
							generalWarning: '*Please give valid input',
						});
						break;
					case 409: //username taken
						this.setState({
							generalWarning: '*Username is already taken :(',
						});
						break;
					default:  //other error, usually 500
						this.setState({
							generalWarning: '*System is undergoing some issues, please try again later',
						});
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
		})
		.catch(function(err){
			console.log('register fail');
		});

	}

	submitSignIn() {
		//check input valid
		var inputValid = true;
		//username
		if (this.state.username.length < 3 || this.state.username.length > 20) {
			this.setState({
				usernameWarning: '*username must be between 3 to 20 characters'
			});
			inputValid = false;
		} else {
			this.setState({
				usernameWarning: ''
			});
		}
		//password
		if (this.state.password.length < 6 || this.state.password.length > 20 || this.state.password.toUpperCase() === this.state.password || this.state.password.toLowerCase() === this.state.password) {
			this.setState({
				passwordWarning: '*password must be between 6 to 20 characters and contains at least 1 lower/upper case letter'
			});
			inputValid = false;
		} else {
			this.setState({
				passwordWarning: ''
			});
		}
		if (!inputValid) {
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
						this.setState({
							generalWarning: '*Please give valid input',
						});
						break;
					case 401: //username and password not matching
						this.setState({
							generalWarning: '*No matching username and password found',
						});
						break;
					case 404: //username not found
						this.setState({
							generalWarning: '*No matching username and password found',
						});
						break;
					default:  //other error, usually 500
						this.setState({
							generalWarning: '*System is undergoing some issues, please try again later',
						});
						break;
				}
				throw new Error('log in fail');
			}
			console.log(res);
			return res.json();
			
		}.bind(this))
		.then(function(data){
			console.log(data);
			//navigate user to main page
		})
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
						<span className="warningSpan">{this.state.usernameWarning}</span>
					</li>
					<li>
						<div className="fieldSpan">password*: </div>
						<input className="passwordInput" type = "password" value = {this.state.password} onChange={(e) => this.updatePassword(e)} />
						<span className="warningSpan">{this.state.passwordWarning}</span>
					</li>
					<li>
						<div className="fieldSpan">please enter password again* </div>
						<input className="passwordInput" type = "password" value = {this.state.passwordAgain} onChange={(e) => this.updatePasswordAgain(e)} />
						<span className="warningSpan">{this.state.passwordAgainWarning}</span>
					</li>
					<li>
						<div className="fieldSpan">phone* </div>
						<input className="phoneInput" type = "text" value = {this.state.phone} onChange={(e) => this.updatePhone(e)} />
						<span className="warningSpan">{this.state.phoneWarning}</span>
					</li>
					<li>
						<div className="fieldSpan">email* </div>
						<input className="emailInput" type = "email" value = {this.state.email} onChange={(e) => this.updateEmail(e)} />
						<span className="warningSpan">{this.state.emailWarning}</span>
					</li>
				</ul>
				<button className="confirmButton" onClick={() => this.submitSignUp()}>Submit</button>
			</div>
		} else {
			moduleToShow = 
			<div className="signInDiv">
				<ul>
					<li>
						<div className="fieldSpan">username* </div>
						<input className="usernameInput" type = "text" value = {this.state.username} onChange={(e) => this.updateUsername(e)} />
						<span className="warningSpan">{this.state.usernameWarning}</span>
					</li>
					<li>
						<div className="fieldSpan">password* </div>
						<input className="passwordInput" type = "password" value = {this.state.password} onChange={(e) => this.updatePassword(e)} />
						<span className="warningSpan">{this.state.passwordWarning}</span>
					</li>
				</ul>
				<button className="confirmButton" onClick={() => this.submitSignIn()}>Submit</button>
			</div>
		}

		//return content
		return (
			<div className="signInSignUpContainer">
				<div className="signInSignUpSubContainer">
					<div className="title">{this.state.title}</div>
					<button className="toggleButton" onClick={() => this.toggleSignInSignUp()}>{this.state.toggleTarget}</button>
					<div className="warningBanner">{this.state.generalWarning}</div>
					{moduleToShow}
				</div>
			</div>
		);
	}
}

export default SignInSignUp;




