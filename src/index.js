import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter} from 'react-router-dom';
import './index.css';
//import cookieTest from './test/cookieTest';
//import questions from './questions/Questions';
//import timeSlotFormTest from './test/timeSlotFormTest';
//import questionTest2 from './test/questionTest';
//import ScreenBlockerTest from './test/ScreenBlockerTest'
//import AskQuestionTest from './test/askQuestionTest';
//import Header from './header/Header';
import Notification from './utility/notification/Notification';
import SignInSignUp from './signInSignUp/SignInSignUp';
import Questions from './questions/Questions';
import Credit from './credit/Credit';
import registerServiceWorker from './registerServiceWorker';


ReactDOM.render(
		<BrowserRouter>
			<div>
				<Route exact path="/" component={Questions} />
				<Route exact path="/signInSignUp/:register?" component={SignInSignUp} />
				<Route exact path="/questions" component={Questions} />
				<Route exact path="/credit" component={Credit} />
				<Route exact path="/notificationTest" component={Notification} />
			</div>

		</BrowserRouter>
	,
	document.getElementById('root')
);
registerServiceWorker();
