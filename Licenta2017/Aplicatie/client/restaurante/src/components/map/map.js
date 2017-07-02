/* global google */
import React, {Component} from "react";

import InitialMap from './initial-map';

export default class RestaurantsMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            infoWindowVisible: false,
            center: {},
            restaurants: [],
            currentLocation: {},
            direction: null
        }
        this.handleMapLoad = this.handleMapLoad.bind(this);
        this.showInfoWindow = this.showInfoWindow.bind(this);
        this.closeInfoWindow = this.closeInfoWindow.bind(this);
        this.renderByType = this.renderByType.bind(this);
        this.closeInfoWindowFromX = this.closeInfoWindowFromX.bind(this);
        this.doNothing = this.doNothing.bind(this);
        this.getLocation = this.getLocation.bind(this);
        this.showDirection = this.showDirection.bind(this);
        this.deleteDirection = this.deleteDirection.bind(this);
    }

    componentWillMount() {
        let email = this.props.emailLogged;
		if(email) {
			fetch('/my-restaurants/' + email, {method: 'GET'})
	        .then(response => {
	            if(typeof response === 'object') {
	                return response.json();
	            }
	        })
	        .then(resp => {
	            if(resp.message && typeof resp.message === 'object') {
	               this.props.setMyRestaurantsId(resp.message);
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

        if(this.props.restaurants) {
            let restaurants = this.props.restaurants,
            newrest = restaurants.map((item) => {
                item.showInfo=false;
                return item;
            });
            this.setState({restaurants: newrest});
        }

        if(this.props.myRestaurants) {
            let myRestaurants = this.props.myRestaurants,
            newrest = myRestaurants.map((item) => {
                item.showInfo=false;
                return item;
            });
            this.setState({myRestaurants: newrest});
        }
    }

    getLocation() {
        navigator.geolocation.getCurrentPosition((position) => {
            this.setState({
                currentLocation: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    }
                });
        });
    }

    doNothing() {

    }

    handleMapLoad(map) {
        this._mapComponent = map;
    }

    showInfoWindow(id) {
        let {restaurants} = this.state;
        switch (this.props.type) {
            case 'just-info':
                restaurants = restaurants.map((restaurant) => {
                    if(restaurant.id === id) {
                        restaurant.showInfo = true;
                    }
                    return restaurant;
                });
                this.setState({restaurants: restaurants});
                break;
            case 'just-info-with-click':
                restaurants = restaurants.map((restaurant) => {
                    if(restaurant.id === id) {
                        restaurant.showInfo = true;
                    } else restaurant.showInfo = false;
                    return restaurant;
                });
                this.setState({restaurants: restaurants});
                break;
            case 'just-info-with-click-with-row':
                restaurants = restaurants.map((restaurant) => {
                    if(restaurant.id === id) {
                        restaurant.showInfo = true;
                    } else restaurant.showInfo = false;
                    return restaurant;
                });
                this.setState({restaurants: restaurants});
                break;
            default:
                break;
        }
    }

    closeInfoWindow(id) {
        if(this.props.type === 'just-info') {
            let restaurants = this.state.restaurants;

            restaurants = restaurants.map((restaurant) => {
                if(restaurant.id === id) {
                    restaurant.showInfo = false;
                }
                return restaurant;
            });

            this.setState({restaurants: restaurants});
        }
    }

    closeInfoWindowFromX(id) {
        if(this.props.type === 'just-info-with-click'){
            let restaurants = this.state.restaurants;

            restaurants = restaurants.map((restaurant) => {
                if(restaurant.id === id) {
                    restaurant.showInfo = false;
                }
                return restaurant;
            });

            this.setState({restaurants: restaurants});
        }
    }

    showDirection(marker, lat, lng) {
        if(this.props.type === 'just-info-with-click-with-row'){
            console.log(marker);
            const DirectionsService = new google.maps.DirectionsService();

            DirectionsService.route({
              origin: new google.maps.LatLng(lat, lng),
              destination: new google.maps.LatLng(marker.lat, marker.lng),
              travelMode: google.maps.TravelMode.DRIVING,
            }, (result, status) => {
              if (status === google.maps.DirectionsStatus.OK) {
                  console.log(result)
                this.setState({
                  direction: result,
                });
              } else {
                console.error(`error fetching directions ${result}`);
              }
          });
        }
    }

    deleteDirection() {
        this.setState({direction: null});
        // console.log('deleteDirection')
    }

    renderByType(type) {
        let {restaurants, myRestaurants} = this.state;

        switch (type) {
            case 'just-info':
                return (
                        <InitialMap
                            containerElement={
                                <div style={{ height: `100%`, width: `100%` }} />
                            }
                            mapElement={
                                <div style={{ height: `100%`, width: `100%` }} />
                            }
                            type={this.props.type}
                            markers={restaurants}
                            onMapLoad={this.handleMapLoad}
                            onMouseOver={this.handleMouseHover}
                            infoPanelVisible={this.state.infoPanelVisible}
                            currentLocation={this.state.center}
                            showInfoWindow={this.showInfoWindow}
                            closeInfoWindow={this.closeInfoWindow}
                            showDirection={this.showDirection}
                            visibleInfo={this.state.infoWindowVisible}
                            onMapClick={this.doNothing}
                            zoom={15}
                        />
                );
            case 'just-info-with-click':
                return(
                    <InitialMap
                        containerElement={
                            <div style={{ height: `100%`, width: `100%` }} />
                        }
                        mapElement={
                            <div style={{ height: `100%`, width: `100%` }} />
                        }
                        type={this.props.type}
                        markers={restaurants}
                        onMapLoad={this.handleMapLoad}
                        onMouseOver={this.handleMouseHover}
                        infoPanelVisible={this.state.infoPanelVisible}
                        showInfoWindow={this.showInfoWindow}
                        closeInfoWindow={this.closeInfoWindow}
                        closeInfoWindowFromX={this.closeInfoWindowFromX}
                        showDirection={this.showDirection}
                        visibleInfo={this.state.infoWindowVisible}
                        handleClickOnInfoBox={this.props.handleClickOnInfoBox}
                        onMapClick={this.doNothing}
                        zoom={15}
                    />
                );
            case 'just-info-with-click-with-row':
                this.getLocation();
                return(
                    <InitialMap
                        containerElement={
                            <div style={{ height: `100%`, width: `100%` }} />
                        }
                        mapElement={
                            <div style={{ height: `100%`, width: `100%` }} />
                        }
                        type={this.props.type}
                        markers={restaurants}
                        myMarkers={myRestaurants}
                        onMapLoad={this.handleMapLoad}
                        onMouseOver={this.handleMouseHover}
                        infoPanelVisible={this.state.infoPanelVisible}
                        currentLocation={this.state.currentLocation}
                        showInfoWindow={this.showInfoWindow}
                        closeInfoWindow={this.closeInfoWindow}
                        closeInfoWindowFromX={this.closeInfoWindowFromX}
                        showDirection={this.showDirection}
                        visibleInfo={this.state.infoWindowVisible}
                        handleClickOnInfoBox={this.props.handleClickOnInfoBox}
                        onMapClick={this.doNothing}
                        direction={this.state.direction}
                        deleteDirection={this.deleteDirection}
                        zoom={13}
                    />
                );
            default:

        }
    }

    render() {
        return (
            <div className='map'>
                {this.renderByType(this.props.type)}
            </div>
        );
    }
}
