import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter} from 'react-router-dom';
import './index.css';
import cookieTest from './test/cookieTest';
import SignInSignUp from './signInSignUp/SignInSignUp';
import questions from './questions/Questions';
import registerServiceWorker from './registerServiceWorker';
import timeSlotFormTest from './test/timeSlotFormTest';
import questionTest2 from './test/questionTest';
import ScreenBlockerTest from './test/ScreenBlockerTest'
import AskQuestionTest from './test/askQuestionTest';


ReactDOM.render(
		<BrowserRouter>
			<div>
				<Route path="/" component={SignInSignUp} />
				<Route path="/signInSignUp" component={SignInSignUp} />
				<Route path="/questions" component={questions} />
				<Route path="/cookieTest" component={cookieTest} />
				<Route path="/timeSlotFormTest" component={timeSlotFormTest} />
				<Route path='/screenBlockerTest' component={ScreenBlockerTest}/>
				<Route path="/questionTest2" component={questionTest2} />
				<Route path="/askQuestionTest" component={AskQuestionTest} />
			</div>

		</BrowserRouter>
	,
	document.getElementById('root')
);
registerServiceWorker();
