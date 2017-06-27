import React, {Component} from 'react';
import Restaurant from './restaurant';
import {getSizeOfObject} from '../../services/functions';

class AllRestaurants extends Component {

	constructor(props){
		super(props);
		this.state = {
			inputValue: ''
		};
		this.changeHandler = this.changeHandler.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.renderButton = this.renderButton.bind(this);
		this.renderRestaurants = this.renderRestaurants.bind(this);
	}

	componentWillMount() {
		if(this.props.setMyRestaurantsId) {
			let email = this.props.emailLogged;
			fetch('/my-restaurants/' + email, {method: 'GET'})
	        .then(response => {
	            if(typeof response === 'object') {
	                return response.json();
	            }
	        })
	        .then(resp => {
				console.log(resp.message);
	            if(resp.message && typeof resp.message === 'object') {
	                this.props.setMyRestaurantsId(resp.message);
	            } else {
	                if(resp.message === 'Nu există reviews!') {
	                    console.log(resp.message);
						this.props.setMyRestaurantsId([]);
	                }
	            }
	        })
	        .catch(e => {
	            console.error('Error->', e);
	        });
		}
	}

	changeHandler(e) {
        this.setState({
			inputValue:e.target.value,
			emailError:''
		});
    }

    handleClick() {
		// if(this.state.loginError !== ''){
		// 	this.setState({loginError: ''});
		// }
	}

	renderButton() {
		if(this.props.tagRestaurant !== '') {
			return (
				<button className='back-button' onClick={() => this.props.changeTagView()}>Șterge filtrul de tag</button>
			);
		}
	}

	renderRestaurants() {
		if(this.props.restaurants.length === 0 || getSizeOfObject(this.props.restaurants[0]) === 0) {
			return (
				<div className='not-restaurants'>Nu există restaurante!</div>
			);
		} else {
			let k = 0;
			return (
				<div>
					<div className='input-search'>
						<input
							id='input-search'
							type="text"
							placeholder="Caută după nume..."
							value={this.state.inputValue}
							onChange={this.changeHandler}
							className='input-search-value'
							onClick={this.handleClick}
						/>
					</div>
					{
						this.props.restaurants.map( item => {
							if(this.props.tagRestaurant === '') {
								if(item.name.toLowerCase().indexOf(this.state.inputValue.toLowerCase()) > -1) {
									var arr = [].concat(item);
									return (
										<Restaurant key={k++}
											redirectToLogin={this.props.redirectToLogin}
											logged={this.props.logged}
											restaurant={arr}
											type={this.props.type}
											onClickName={this.props.onClickName}
											onClickTag={this.props.onClickTag}
											isLogged={this.props.isLogged}
											userData={this.props.userData}
										/>
									);
								}
							} else if(item.tags.toLowerCase().indexOf(this.props.tagRestaurant.toLowerCase()) > -1) {
								var arr = [].concat(item);
								return (
									<Restaurant key={k++}
										redirectToLogin={this.props.redirectToLogin}
										logged={this.props.logged}
										restaurant={arr}
										type={this.props.type}
										onClickName={this.props.onClickName}
										onClickTag={this.props.onClickTag}
										isLogged={this.props.isLogged}
										userData={this.props.userData}
									/>
								);
							}
						})
					}
					{this.renderButton()}
				</div>
			);
		}
	}

	render() {
		return (
			<div className='restaurants-wrapper'>
				{this.renderRestaurants()}
			</div>
		);
	}
}

export default AllRestaurants;
