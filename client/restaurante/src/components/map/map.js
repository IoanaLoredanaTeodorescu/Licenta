import _ from "lodash";
import React, {Component} from "react";
import {
    withGoogleMap,
    GoogleMap,
    InfoWindow,
    Marker
} from "react-google-maps";
import InitialMap from './initial-map';

export default class RestaurantsMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            infoWindowVisible: false,
            center: {},
            restaurants: []
        }
        this.handleMapLoad = this.handleMapLoad.bind(this);
        this.showInfoWindow = this.showInfoWindow.bind(this);
        this.closeInfoWindow = this.closeInfoWindow.bind(this);
        this.renderByType = this.renderByType.bind(this);
        this.closeInfoWindowFromX = this.closeInfoWindowFromX.bind(this);
    }

    componentDidMount() {
        let restaurants = this.props.restaurants;
        restaurants.map((item) => {
            item.showInfo=false
        });

        this.setState({restaurants: restaurants});

        navigator.geolocation.getCurrentPosition((position) => {
            if (this.isUnmounted) {
                return;
            }
            this.setState({
                center: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                }
            });
        });
    }

    handleMapLoad(map) {
        this._mapComponent = map;
    }

    showInfoWindow(id) {
        if(this.props.type === 'just-info'){
            let restaurants = this.state.restaurants;

            restaurants = restaurants.map((restaurant) => {
                if(restaurant.id === id) {
                    restaurant.showInfo = true;
                }
                return restaurant;
            });

            this.setState({restaurants: restaurants});
        } if(this.props.type === 'just-info-with-click'){
            let restaurants = this.state.restaurants;

            restaurants = restaurants.map((restaurant) => {
                if(restaurant.id === id) {
                    restaurant.showInfo = true;
                } else restaurant.showInfo = false;
                return restaurant;
            });

            this.setState({restaurants: restaurants});
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

    renderByType(type) {
        if(type === 'just-info')
            {
                return (
                        <InitialMap
                            containerElement={
                                <div style={{ height: `100%`, width: `100%` }} />
                            }
                            mapElement={
                                <div style={{ height: `100%`, width: `100%` }} />
                            }
                            type={this.props.type}
                            markers={this.state.restaurants}
                            onMapLoad={this.handleMapLoad}
                            onMouseOver={this.handleMouseHover}
                            infoPanelVisible={this.state.infoPanelVisible}
                            currentLocation={this.state.center}
                            showInfoWindow={this.showInfoWindow}
                            closeInfoWindow={this.closeInfoWindow}
                            visibleInfo={this.state.infoWindowVisible}
                        />
                );
            }
        else if(type === 'just-info-with-click') {
            return(
                <InitialMap
                    containerElement={
                        <div style={{ height: `100%`, width: `100%` }} />
                    }
                    mapElement={
                        <div style={{ height: `100%`, width: `100%` }} />
                    }
                    type={this.props.type}
                    markers={this.state.restaurants}
                    onMapLoad={this.handleMapLoad}
                    onMouseOver={this.handleMouseHover}
                    infoPanelVisible={this.state.infoPanelVisible}
                    currentLocation={this.state.center}
                    showInfoWindow={this.showInfoWindow}
                    closeInfoWindow={this.closeInfoWindow}
                    closeInfoWindowFromX={this.closeInfoWindowFromX}
                    visibleInfo={this.state.infoWindowVisible}
                />
            );
        } else return ;
    }

    render() {
        return (
            <div className='map'>
                {this.renderByType(this.props.type)}
            </div>
        );
    }
}
