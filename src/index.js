import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter} from 'react-router-dom';
import './index.css';
import App from './App';
import cookieTest from './test/cookieTest';
import SignInSignUp from './signInSignUp/SignInSignUp';
import questions from './questions/Questions';
import registerServiceWorker from './registerServiceWorker';
import timeSlotFormTest from './test/timeSlotFormTest'


ReactDOM.render(
		<BrowserRouter>
			<div>
				<Route path="/" component={App} />
				<Route path="/signInSignUp" component={SignInSignUp} />
				<Route path="/questions" component={questions} />
				<Route path="/cookieTest" component={cookieTest} />
				<Route path="/timeSlotFormTest" component={timeSlotFormTest} />
			</div>

		</BrowserRouter>
	,
	document.getElementById('root')
);
registerServiceWorker();
