import React, { Component } from 'react';
import Header from '../header/header';
import Constants from '../../services/constants';
import Autentificare from '../autentificare-inregistrare/autentificare';
import Inregistrare from '../autentificare-inregistrare/inregistrare';
import AllRestaurants from '../restaurants/all-restaurants';
import RestaurantAllView from '../restaurants/restaurant-all-view';
import Reviews from '../reviews/reviews';
import RestaurantsMap from '../map/map';
import DirectionsExampleGoogleMap from '../map/map_test';

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
            tagRestaurant: '',
            restaurantToShow: [],
            isOnButton: false,
            restaurantsTag: '',
            myRestaurants: [],
            myRestaurantsId: []
        }
        this.changeTab = this.changeTab.bind(this);
        this.getSelectedTabView = this.getSelectedTabView.bind(this);
        this.handleClickName = this.handleClickName.bind(this);
        this.handleClickTag = this.handleClickTag.bind(this);
        this.handleButtonClicked = this.handleButtonClicked.bind(this);
        this.setUserData = this.setUserData.bind(this);
        this.handleClickOnInfoBox = this.handleClickOnInfoBox.bind(this);
        this.changeTagView = this.changeTagView.bind(this);
        this.setMyRestaurantsId = this.setMyRestaurantsId.bind(this);
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

    componentWillReceiveProps(nextProps) {
        if(nextProps.logged === false) {
            this.setState({myRestaurants: []});
        }
    }

    setMyRestaurantsId(myRestaurantsId) {
        let restaurants = this.state.restaurants;
        let myRestaurants = [];
        if(myRestaurantsId.length > 0) {
            for(var i = 0; i < myRestaurantsId.length; i++) {
                for(var j = 0; j < restaurants.length; j++) {
                    if(myRestaurantsId[i] === restaurants[j].id) {
                        myRestaurants.push(restaurants[j]);
                    }
                }
            }
            this.setState({myRestaurants: myRestaurants});
        } else this.setState({myRestaurants: []});

    }

    handleClickName(props, isOnButton) {
        if(isOnButton === false) {
            this.setState({
                showOneRestaurant: true,
                idRestaurantShowed: props.id,
                restaurantToShow: props,
                isOnButton: false
            });
        } else {
            this.setState({
                showOneRestaurant: true,
                idRestaurantShowed: props.id,
                restaurantToShow: props,
                isOnButton: true
            });
        }
    }

    handleClickTag(tag) {
        console.log(tag);
        this.setState({restaurantsTag: tag});
    }

    handleButtonClicked() {
        this.setState({
            showOneRestaurant: false,
            restaurantsTag: ''
        });
    }

    setUserData(userData) {
        this.setState({userData: userData});
        this.props.setEmailLogged(userData.email);
    }

    handleClickOnInfoBox(props) {
        this.setState({
            showOneRestaurant: true,
            idRestaurantShowed: props.id,
            restaurantToShow: props
        });
    }

    changeTagView() {
        this.setState({restaurantsTag: ''});
    }

    getSelectedTabView(id) {
		switch(id){
			case 'all-restaurants':
                if(this.state.showOneRestaurant === false && this.state.tagRestaurant === '') {
                        return (
                            <AllRestaurants
                                tagRestaurant={this.state.restaurantsTag}
                                changeTagView={() => this.changeTagView()}
                                userData={this.setUserData}
                                isLogged={this.props.isLogged}
                                redirectToLogin={this.changeTab.bind(this, 'login')}
                                type='just-info' logged={this.props.logged}
                                restaurants={this.state.restaurants}
                                onClickName={this.handleClickName}
                                onClickTag={this.handleClickTag}
                            />);
                } else if(this.state.showOneRestaurant === true && this.state.idRestaurantShowed !== '') {
                        return (
                            <RestaurantAllView
                                userDataInfoEmail={this.state.userData.email}
                                userDataInfoName={this.state.userData.name}
                                userData={this.setUserData}
                                type='just-info'
                                isLogged={this.props.isLogged}
                                isOnButton={this.state.isOnButton}
                                redirectToLogin={this.changeTab.bind(this, 'login')}
                                logged={this.props.logged}
                                restaurantToShow={this.state.restaurantToShow}
                                buttonClicked={this.handleButtonClicked}
                                idRestaurant={this.state.idRestaurantShowed}
                            />);
                    }
                break;
            case 'map-logged-false':
                if(this.state.showOneRestaurant === true && this.state.idRestaurantShowed !== '') {
                    return (
                        <RestaurantAllView
                            type='just-info'
                            logged={this.props.logged}
                            restaurantToShow={this.state.restaurantToShow}
                            buttonClicked={this.handleButtonClicked}
                            idRestaurant={this.state.idRestaurantShowed}
                            isLogged={this.props.isLogged}
                            userData={this.setUserData}
                        />);
                } else return (
                    <RestaurantsMap
                        type='just-info-with-click'
                        handleClickOnInfoBox={this.handleClickOnInfoBox}
                        restaurants={this.state.restaurants}
                        isLogged={this.props.isLogged}
                    />);
            case 'login':
				return (
                    <Autentificare
                        redirectToSignup={this.changeTab.bind(this, 'signup')}
                        loginCallback={this.props.isLogged}
                        userData={this.setUserData}
                        redirect={this.changeTab.bind(this, 'my-restaurants')}
                        getMyRestaurants={() => this.getMyRestaurants()}
                        />);
            case 'signup':
				return (
                    <Inregistrare
                        redirectToLogin={this.changeTab.bind(this, 'login')}
                        buttonName='Înregistrare'
                        typeOfButton='signup'
                        redirectToLogin={this.changeTab.bind(this, 'login')}
                    />);
            case 'my-restaurants':
                if(this.state.showOneRestaurant === false && this.state.tagRestaurant === '') {
                        let email = this.props.emailLogged;
                        return (
                            <AllRestaurants
                                tagRestaurant={this.state.restaurantsTag}
                                changeTagView={() => this.changeTagView()}
                                userData={this.setUserData}
                                isLogged={this.props.isLogged}
                                redirectToLogin={this.changeTab.bind(this, 'login')}
                                type='just-info' logged={this.props.logged}
                                restaurants={this.state.myRestaurants}
                                onClickName={this.handleClickName}
                                onClickTag={this.handleClickTag}
                                setMyRestaurantsId={this.setMyRestaurantsId}
                                emailLogged={email}
                            />);
                } else if(this.state.showOneRestaurant === true && this.state.idRestaurantShowed !== '') {
                        return (
                            <RestaurantAllView
                                userDataInfoEmail={this.state.userData.email}
                                userDataInfoName={this.state.userData.name}
                                userData={this.setUserData}
                                type='just-info'
                                isLogged={this.props.isLogged}
                                isOnButton={this.state.isOnButton}
                                redirectToLogin={this.changeTab.bind(this, 'login')}
                                logged={this.props.logged}
                                restaurantToShow={this.state.restaurantToShow}
                                buttonClicked={this.handleButtonClicked}
                                idRestaurant={this.state.idRestaurantShowed}
                            />);
                    }
            case 'my-reviews':
                return (
                    <Reviews emailLogged={this.props.emailLogged} />
                );
            case 'map-logged-true':

                let email = this.props.emailLogged;
                if(this.state.showOneRestaurant === true && this.state.idRestaurantShowed !== '') {
                    return (
                        <RestaurantAllView
                            type='just-info'
                            logged={this.props.logged}
                            restaurantToShow={this.state.restaurantToShow}
                            buttonClicked={this.handleButtonClicked}
                            idRestaurant={this.state.idRestaurantShowed}
                            userData={this.setUserData}
                        />);
                } else return (
                    <RestaurantsMap
                        type='just-info-with-click-with-row'
                        handleClickOnInfoBox={this.handleClickOnInfoBox}
                        restaurants={this.state.restaurants}
                        myRestaurants={this.state.myRestaurants}
                        setMyRestaurantsId={this.setMyRestaurantsId}
                        emailLogged={email}
                    /> );
            default:
            if(this.state.showOneRestaurant === false && this.state.tagRestaurant === '') {
                    return (
                        <AllRestaurants
                            tagRestaurant={this.state.restaurantsTag}
                            changeTagView={() => this.changeTagView()}
                            userData={this.setUserData}
                            isLogged={this.props.isLogged}
                            redirectToLogin={this.changeTab.bind(this, 'login')}
                            type='just-info' logged={this.props.logged}
                            restaurants={this.state.restaurants}
                            onClickName={this.handleClickName}
                            onClickTag={this.handleClickTag}
                        />);
            } else if(this.state.showOneRestaurant === true && this.state.idRestaurantShowed !== '') {
                    return (
                        <RestaurantAllView
                            userDataInfoEmail={this.state.userData.email}
                            userDataInfoName={this.state.userData.name}
                            userData={this.setUserData}
                            type='just-info'
                            isLogged={this.props.isLogged}
                            isOnButton={this.state.isOnButton}
                            redirectToLogin={this.changeTab.bind(this, 'login')}
                            logged={this.props.logged}
                            restaurantToShow={this.state.restaurantToShow}
                            buttonClicked={this.handleButtonClicked}
                            idRestaurant={this.state.idRestaurantShowed}
                        />);
                }
		}
	}

    getTabsTypeLogged(logged) {
        switch (logged) {
            case false:
                return Constants.firstPageTabs;
            case true:
                return Constants.firstPageLoggedTabs;
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
                        userData={this.state.userData.name}
                        isLogged={this.props.isLogged}
                        logged={this.props.logged}
                        redirectToAllRestaurants={() => this.changeTab('all-restaurants')}
                        setEmptyEmail={this.props.setEmptyEmail}
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
