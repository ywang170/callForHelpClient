import React, {Component} from 'react';
import Header from '../header/Header';
import ReactAudioPlayer from 'react-audio-player';
import audioFile from '../sound/dd.mp3';
import './Credit.css';

class Credit extends Component{
	render(){
		return(
			<div>
				<Header />
				<div className="Credit_container">
					<div className="Credit_docs">
						<a href="https://docs.google.com/document/d/1iaQlz0TV1RpRlO6UbAEWztEx8r1jEF4ELSezm8jMv4w/edit">Overall Design</a><br/><br/>
						<a href="https://docs.google.com/document/d/1rOn-2zoA-NUCeAN99KvkhzCtKGlTVD2cDuLElaqAbvc/edit">React Node</a><br/><br/>
						<a href="https://docs.google.com/document/d/1Bn7wA_dn-F09N5JzqPg0CIqKk_E6uIsCJKsC_h5a28g/edit#heading=h.xvfwxi9nmqxz">Cassandra Note</a>
					</div>
					<div className="Credit_cast">
						<h1>Cast</h1>
						<p>Director - Yizhou Wang</p>
						<p>Producer - Yizhou Wang</p>
						<p>Project Leader - Yizhou Wang</p>
						<p>Project Chief Engineer - Yizhou Wang</p>
						<p>Project Manager - Yizhou Wang</p>
						<p>Concept Designer - Yizhou Wang</p>
						<p>Art - Yizhou Wang</p>
						<p>Resources - Yizhou Wang</p>
						<br/>
						<h1>Tech Stack</h1>
						<p>Front End - React Js</p>
						<p>Back End - Node js Express</p>
						<p>Database - cassandra</p>
						<p>DB-Server Connect - Cassandra Driver</p>
						<br/>
						<h1>Special Thanks</h1>
						<p>LaiOffer edu</p>
						<br/>
						<br/>
						<br/>
						<br/>
						<br/>
						<h2>~ 劇終 ~</h2>
					</div>
				</div>	
				<ReactAudioPlayer autoPlay={true} loop={true} src={audioFile} />			
			</div>
		);
	}
}

export default Credit;