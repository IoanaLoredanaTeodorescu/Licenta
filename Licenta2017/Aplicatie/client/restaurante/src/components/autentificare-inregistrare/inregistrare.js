import React, {Component} from 'react';
import {isValidInput} from '../../services/form-validation';
import {isLengthAtLeastNumber} from '../../services/form-validation';
import {isAlphanumeric} from '../../services/form-validation';
import {areEqual} from '../../services/form-validation';
import {isEmail} from '../../services/form-validation';
import {containLettersSpacesOnly} from '../../services/form-validation';
import {isLowerThanANumber} from '../../services/form-validation';

const ERRORS = {
	0: '',
	1: 'Lipsă nume!',
	2: 'Numele trebuie să conțină cel puțin 4 caractere!',
	3: 'Numele trebuie să conțină doar litere și spații!',
	4: 'Lipsă email!',
	5: 'Email invalid!',
	6: 'Lipsă parolă!',
	7: 'Parola trebuie să conțină cel putn 13 caractere!',
	8: 'Parola trebuie să conțină doar litere și cifre!',
	9: 'Lipsă copie parolă!',
	10: 'Parolele nu se potrivesc!',
	11: 'Parola poate să conțină maxim 25 de caractere!'
}


class SignupForm extends Component {

	constructor() {
		super();
		this.state = {
			fullNameValue:'',
			emailValue:'',
			passwordValue:'',
			rePasswordValue:'',
			fullNameError:'',
			emailError:'',
			passwordError:'',
			rePasswordError:'',
			signupError:''
		}
		this.changeHandler = this.changeHandler.bind(this);
		this.signUpRequest = this.signUpRequest.bind(this);
		this.fullNameValidation = this.fullNameValidation.bind(this);
		this.emailValidation = this.emailValidation.bind(this);
		this.passwordValidation = this.passwordValidation.bind(this);
		this.rePasswordValidation = this.rePasswordValidation.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.signupWhenEnterKey = this.signupWhenEnterKey.bind(this);
		window.addEventListener("keypress", this.signupWhenEnterKey);
	}

		componentWillUnmount() {
			window.removeEventListener("keypress", this.signupWhenEnterKey);
		}

		signupWhenEnterKey(e) {
			if(e.keyCode === 13) {
				this.signUpRequest();
			}
		}

	// componentWillMount() {
	// 	if(this.props.formData){
	// 		this.setState({
	// 			fullNameValue: this.props.formData.fullname,
	// 			emailValue: this.props.formData.email,
	// 			currentEmail: this.props.formData.email,
	// 			passwordValue: this.props.formData.password,
	// 			rePasswordValue: this.props.formData.password
	// 		});
	// 	}
	// }

	// componentWillReceiveProps(nextProps) {
	// 	nextProps.email && this.setState({currentEmail: nextProps.formData.email});
	// }

	changeHandler(e) {
		this.setState({[e.target.id]:e.target.value});
		switch (e.target.id) {
			case 'fullNameValue':
				this.setState({fullNameError:''});
				break;
			case 'emailValue':
				this.setState({emailError:''});
				break;
			case 'passwordValue':
				this.setState({passwordError:''});
				break;
			case 'rePasswordValue':
				this.setState({rePasswordError:''});
				break;
			default:
				this.setState({err:''});
		}
	}

	async signUpRequest() {

		let {fullNameValue, emailValue, passwordValue, rePasswordValue} = this.state;

		await this.fullNameValidation(fullNameValue);
		await this.emailValidation(emailValue);
		await this.passwordValidation(passwordValue);
		await this.rePasswordValidation(rePasswordValue,this.state.passwordValue);

		let {fullNameError, emailError, passwordError, rePasswordError} = this.state;

		switch (this.props.typeOfButton) {
			case 'signup':
				if(fullNameError === '' && emailError === '' && passwordError === '' && rePasswordError === ''){
					return fetch('/signup', {method: 'POST',
						body: JSON.stringify({fullName: fullNameValue, email: emailValue, password: passwordValue}),
						headers: {"Content-Type": "application/json"}})
      					.then(res => {
							if(typeof res === 'object') {
								this.setState({signupError: ''});
								return res.json();
							}
						})
      					.then(resp => {
							if(resp.typeError === 'NoError') {
								console.log(resp.message);
								this.props.redirectToLogin();
								this.setState({
									fullNameValue:'',
									emailValue:'',
									passwordValue:'',
									rePasswordValue: ''
								});
							} else {
								if(resp.message) {
									this.setState({signupError: resp.message});
								}
							}
						})
						.catch(e => {
							this.setState({signupError: 'A apărut o eroare neașteptată la înregistrare!'});
							console.error('Error->', e);
					});
				}
				break;
			case 'save':
				/*if(fullNameError === '' && emailError === '' && passwordError === '' &&  rePasswordError === '')
				{
					fetch(`${API_ROOT}/events-tracker/update`, {
						method: 'POST',
						body: {
							fullname: fullNameValue,
							currentEmail: currentEmail,
							email: emailValue,
							password: passwordValue,
							profilePicture: this.props.image
						}
					})
					.then( response => {
						if(response.ok || response.status === 409) {
							return response.json();
						}
						throw new Error('Error!');
					})
					.then(rjson => {
						if(rjson.created) {
							this.props.toggleModal();
							this.props.updateDataCallback({email: emailValue, password: passwordValue});
						} else {
							this.setState({signupError: rjson.message});
						}
					})
					.catch(e => {
						this.setState({signupError: 'There has been a problem with your saving operation! \n Please try again!'});
						console.error('Error-> ',e);
					});
				}*/
                console.log('save');
				break;
			default:
				this.setState({err:''});

		}

	}

	fullNameValidation(input) {
		return new Promise((resolve, reject) => {
			let setError = (errorMessage) =>{
				this.setState({
					fullNameError: errorMessage
				});
			};
			resolve('ok');
			if (!isValidInput(input)) {
				setError(ERRORS[1]);
			} else {
					if(!isLengthAtLeastNumber(input,4)) {
						setError(ERRORS[2]);
					} else {
							if(!containLettersSpacesOnly(input)) {
								setError(ERRORS[3]);
							} else {
								setError(ERRORS[0]);
							}
					}
			}
		});
	}

	emailValidation(input) {
		return new Promise((resolve, reject) => {
			let setError = (errorMessage) => {
				this.setState({
					emailError: errorMessage
				});
			};
			resolve('ok');
			if (!isValidInput(input)) {
				setError(ERRORS[4]);
			} else {
					if(!isEmail(input)) {
						setError(ERRORS[5]);
					} else {
							setError(ERRORS[0]);
					}
			}
		});
	}

	passwordValidation(input) {
		return new Promise((resolve, reject) => {
			let setError = (errorMessage) =>{
				this.setState({
					passwordError: errorMessage
				});
			};
			resolve('ok');
			if (!isValidInput(input)) {
				setError(ERRORS[6]);
			} else {
					if(!isLengthAtLeastNumber(input,13)) {
						setError(ERRORS[7]);
					} else {
							if(!isAlphanumeric(input)) {
								setError(ERRORS[8]);
							} else {
								if(!isLowerThanANumber(input, 25)) {
									setError(ERRORS[11]);
								} else setError(ERRORS[0]);
							}
					}
			}
		});
	}

	rePasswordValidation(input,pass) {
		return new Promise((resolve, reject) => {
			let setError = (errorMessage) => {
				this.setState({
					rePasswordError: errorMessage
				});
			};
			resolve('ok');
			if (!isValidInput(input)) {
				setError(ERRORS[9]);
			} else {
					if(!areEqual(input,pass)) {
						setError(ERRORS[10]);
					} else {
							setError(ERRORS[0]);
					}
			}
		});
	}

	handleClick() {
		if(this.state.signupError !== ''){
			this.setState({signupError: ''});
		}
	}

	render() {
		let {fullNameError, emailError, passwordError, rePasswordError} = this.state;
		return (
			<div className='vertical-align'>
				<div className='wrapper'>
					<div className='main-wrapper'>
		                <span className='title'>
		                    înregistrare
		                </span>
						<input
							id='fullNameValue'
							type='text'
							placeholder='Nume...'
							value={this.state.fullNameValue}
							onChange={this.changeHandler}
							className={fullNameError ? 'error-input' : ''}
							onClick={this.handleClick}
						/>
							<p className='error'>{this.state.fullNameError}</p>
						<input
							id='emailValue'
							type='text'
							placeholder='Email...'
							value={this.state.emailValue}
							onChange={this.changeHandler}
							className={emailError ? 'error-input' : ''}
							onClick={this.handleClick}
						/>
							<p className='error'>{this.state.emailError}</p>
						<input
							id='passwordValue'
							type='password'
							placeholder='Parolă...'
							value={this.state.passwordValue}
							onChange={this.changeHandler}
							className={passwordError ? 'error-input' : ''}
							onClick={this.handleClick}
						/>
							<p className='error'>{this.state.passwordError}</p>
						<input
							id='rePasswordValue'
							type='password'
							placeholder='Rescrie parola...'
							value={this.state.rePasswordValue}
							onChange={this.changeHandler}
							className={rePasswordError ? 'error-input' : ''}
							onClick={this.handleClick}
						/>
							<p className='error'>{this.state.rePasswordError}</p>
							<p className='error'>{this.state.signupError}</p>
						<button
								className='form-button'
								onClick={this.signUpRequest}>
									{this.props.buttonName}
						</button>
						<div className='suggest-wrapper'>
							<span className='sugget-message'>Ai deja cont?</span>
							<span className='suggest' onClick={() => this.props.redirectToLogin()}>Autentificare</span>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
export default SignupForm;
