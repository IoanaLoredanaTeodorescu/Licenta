import React, { Component } from 'react';
import Header from '../header/header';
import Constants from '../../services/constants';
import Autentificare from '../autentificare-inregistrare/autentificare';
import Inregistrare from '../autentificare-inregistrare/inregistrare';
import AllRestaurants from '../restaurants/all-restaurants';
import RestaurantAllView from '../restaurants/restaurant-all-view';
import RestaurantsMap from '../map/map';

class FirstPage extends Component {

    constructor(){
        super();
        this.state = {
            showedTab: null,
            selectedTab: 'all-restaurants',
            restaurants: [],
            showOneRestaurant: false,
            idRestaurantShowed: ''
        }
        this.changeTab = this.changeTab.bind(this);
        this.getSelectedTabView = this.getSelectedTabView.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleButtonClicked = this.handleButtonClicked.bind(this);
    }

    changeTab(id) {
		this.setState({
            selectedTab: id,
            showOneRestaurant: false,
            logged: false
        });
	}

    componentWillMount() {
        fetch('/allrestaurants', {method: 'GET'})
        .then(response => {
            if(typeof response === 'object') {
                return response.json();
            }
        })
        .then(resp => {
            if(resp.message && typeof resp.message === 'object') {
                this.setState({restaurants: this.state.restaurants.concat(resp.message)});
            } else {
                if(resp.message) {
                    console.log(resp.message);
                }
            }
        })
        .catch(e => {
            console.error('Error->', e);
        });
    }

    handleClick(id) {
        this.setState({
            showOneRestaurant: true,
            idRestaurantShowed: id
        });
    }

    handleButtonClicked() {
        this.setState({showOneRestaurant: false});
    }


    getSelectedTabView(id) {
		switch(id){
			case 'all-restaurants':
                if(this.state.showOneRestaurant === false)
                    return (<AllRestaurants restaurants={this.state.restaurants} onClick={this.handleClick}/>);
                else
                    return (<RestaurantAllView buttonClicked={this.handleButtonClicked} idRestaurant={this.state.idRestaurantShowed}/>);
			case 'map-logged-false':
				return (<RestaurantsMap restaurants={this.state.restaurants} />);
			case 'login':
				return (<Autentificare loginCallback={this.props.isLogged} />);
			case 'signup':
				return (<Inregistrare buttonName='Înregistrare' typeOfButton='signup' redirectToLogin={this.changeTab.bind(this, 'login')} />);
            case 'my-restaurants':
                return (<div>restaurantele mele</div>);
            case 'map-logged-true':
                return (<div>harta mea</div>);
            case 'logout':
                this.props.isLogged;
                break;
            default:
                if(this.state.showOneRestaurant === false)
                    return (<AllRestaurants restaurants={this.state.restaurants} onClick={this.handleClick}/>);
                else
                    return (<RestaurantAllView buttonClicked={this.handleButtonClicked} idRestaurant={this.state.idRestaurantShowed}/>);
		}
	}

    getTabsTypeLogged(logged) {
        switch (logged) {
            case false:
                return Constants.firstPageTabs;
                break;
            case true:
                //this.setState({selectedTab: 'my-restaurants'});
                return Constants.firstPageLoggedTabs;
                break
            default:
                return Constants.firstPageTabs;
        }
    }

    render() {
        let showedTab = this.getSelectedTabView(this.state.selectedTab);
        let tabs = this.getTabsTypeLogged(this.props.logged);
        return (
            <div className="main-page">
                <div className='bg'></div>
                <div className='header'>
                    <Header callback={this.changeTab} tabs={tabs} selectedTab={this.state.selectedTab} />
                </div>
                <div className='main-page-wrapper'>
                    <div className='main-page-content'>
                        <div className='output-tab-place'>
                            {showedTab}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default FirstPage;
