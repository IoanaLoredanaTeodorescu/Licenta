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
            idRestaurantShowed: '',
            userData: {},
            logged: false,
            tagRestaurant: ''
        }
        this.changeTab = this.changeTab.bind(this);
        this.getSelectedTabView = this.getSelectedTabView.bind(this);
        this.handleClickName = this.handleClickName.bind(this);
        this.handleClickTag = this.handleClickTag.bind(this);
        this.handleButtonClicked = this.handleButtonClicked.bind(this);
        this.setUserData = this.setUserData.bind(this);
    }

    changeTab(id) {
		this.setState({
            selectedTab: id,
            showOneRestaurant: false
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
                //console.log(resp.message);
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

    handleClickName(id) {
        this.setState({
            showOneRestaurant: true,
            idRestaurantShowed: id,
            tagRestaurant: ''
        });
    }

    handleClickTag(tag) {
        this.setState({
            showOneRestaurant: false,
            tagRestaurant: tag,
            idRestaurantShowed: ''
        });
        console.log(tag)
    }

    handleButtonClicked() {
        this.setState({showOneRestaurant: false});
    }

    setUserData(userData) {
        this.setState({userData: userData});
    }


    getSelectedTabView(id) {
		switch(id){
			case 'all-restaurants':
                if(this.state.showOneRestaurant === false && this.state.tagRestaurant === '')
                    return (<AllRestaurants type='just-info' restaurants={this.state.restaurants} onClickName={this.handleClickName} onClickTag={this.handleClickTag}/>);
                else
                    if(this.state.idRestaurantShowed !== '')
                        return (<RestaurantAllView type='just-info' buttonClicked={this.handleButtonClicked} idRestaurant={this.state.idRestaurantShowed}/>);
                    else
                        if(this.state.tagRestaurant !== '')
                            return ;
			case 'map-logged-false':
				return (<RestaurantsMap type='just-info-with-click' restaurants={this.state.restaurants} />);
			case 'login':
				return (<Autentificare loginCallback={this.props.isLogged} userData={this.setUserData} redirect={this.changeTab.bind(this, 'my-restaurants')}/>);
			case 'signup':
				return (<Inregistrare buttonName='Înregistrare' typeOfButton='signup' redirectToLogin={this.changeTab.bind(this, 'login')} />);
            case 'my-restaurants':
                return (<div>restaurantele mele</div>);
            case 'map-logged-true':
                return (<div>harta mea</div>);
            default:
                if(this.state.showOneRestaurant === false)
                    return (<AllRestaurants type='just-info' restaurants={this.state.restaurants} onClickName={this.handleClickName} onClickTag={this.handleClickTag}/>);
                else
                    return (<RestaurantAllView type='just-info' buttonClicked={this.handleButtonClicked} idRestaurant={this.state.idRestaurantShowed}/>);
		}
	}

    getTabsTypeLogged(logged) {
        switch (logged) {
            case false:
                return Constants.firstPageTabs;
                break;
            case true:
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
                    <Header
                        callback={this.changeTab}
                        tabs={tabs}
                        selectedTab={this.state.selectedTab}
                        userData={this.state.userData}
                    />
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
