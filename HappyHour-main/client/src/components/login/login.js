import React, { useState } from "react";
import "./login.css";
import axios from "axios";
import { useHistory } from "react-router-dom";

const Login = ( { updateUser } ) => {

	const { REACT_APP_SERVER_URL } = process.env;

	const history = useHistory();

	const [ user, setUser ] = useState( {
		email: "",
		password: ""
	} );

	const handleChange = e => {
		const { name, value } = e.target;
		setUser( {
			...user,
			[ name ]: value
		} );
	};

	const login = () => {
		axios.post( `${ REACT_APP_SERVER_URL }/login`, user )
			.then( res => {
				alert( res.data.message );
				updateUser( res.data.user );
				history.push( "/" );
			} );
	};

	return (

		<div className="login">
			<h2> Welcome to Happy Hour</h2>
			<hr></hr><br></br>
			<h2>Login</h2>
			<input type="text" name="email" value={ user.email } onChange={ handleChange } placeholder="Enter your Email"></input>
			<input type="password" name="password" value={ user.password } onChange={ handleChange } placeholder="Enter your Password" ></input>
			<div className="button" onClick={ login }>Login</div>
			<div>or</div>
			<div className="button" onClick={ () => history.push( "/register" ) }>Register</div>
		</div>

	);
};

export default Login;