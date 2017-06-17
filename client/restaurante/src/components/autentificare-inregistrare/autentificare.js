import React, {Component} from 'react';
import {isValidInput} from '../../services/form-validation';


class Autentificare extends Component {

    constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
			emailError: '',
			passwordError: '',
			loginError: ''
		}
		this.loginRequest = this.loginRequest.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.changeHandler = this.changeHandler.bind(this);
	}


	async loginRequest() {
		let {email, password} = this.state;
		let validEmail = isValidInput(email),
			validPassword = isValidInput(password),
			emailError = validEmail ? '' : 'Invalid email!',
			passwordError = validPassword ? '' : 'Invalid password!';

		this.setState({
			emailError,
			passwordError
		});

		if(validEmail && validPassword) {
            return fetch('/login', {method: 'GET'})
                .then(res => {
                    if(typeof res === 'object') {
                        this.setState({loginError: ''});
                        return res.json();
                    }
                })
                .then(resp => {
                    if(resp.typeError === 'NoError') {
                        console.log(resp.message);
                        //this.props.redirectToLogin();
                        this.props.loginCallback();
                        this.setState({
                            email: '',
                            password: ''
                        });
                    } else {
                        if(resp.message) {
                            this.setState({loginError: resp.message});
                        }
                    }
                })
                .catch(e => {
                    this.setState({loginError: 'A apărut o eroare neașteptată la autentificare!'});
                    console.error('Error->', e);
            });
			/*let response = await UserdataService.getUserData({email, password})
			.catch(e => {
				this.setState({loginError: 'There has been a problem with your login operation'});
				console.error("Error-> ",e);
			});
			if(typeof response === 'object') {
				this.props.loginCallback(response);
			} else {
				this.setState({loginError: 'Wrong username or password!'});
			}*/
		}
	}

    changeHandler(e) {
        this.setState({[e.target.id]:e.target.value});
        switch (e.target.id) {
            case 'email':
                this.setState({emailError:''});
                break;
            case 'password':
                this.setState({passwordError:''});
                break;
            default:
                this.setState({err:''});
        }
    }

    handleClick() {
		if(this.state.loginError !== ''){
			this.setState({loginError: ''});
		}
	}

    render() {
        let {emailError, passwordError, loginError} = this.state;
        return (
            <div className='vertical-align'>
                <div className='wrapper'>
                    <div className="main-wrapper">
                        <span className='title'>
                            autentificare
                        </span>
        				<input
                            id='email'
        					type="text"
        					placeholder="Email..."
                            value={this.state.email}
                            onChange={this.changeHandler}
        					className={emailError ? 'error-input' : ''}
                            onClick={this.handleClick}
                        />
        				<span className="error">{emailError}</span>
        				<input
                            id='password'
        					type="password"
        					placeholder="Password..."
                            value={this.state.password}
                            onChange={this.changeHandler}
        					className={passwordError ? 'error-input' : ''}
                            onClick={this.handleClick}
        				/>

        				<span className="error">{passwordError}</span>

        				<span className="error">{loginError}</span>
        				<button className="form-button" onClick={this.loginRequest}>Autentificare</button>
        			</div>
                </div>
            </div>
        );
    }
}

export default Autentificare;
