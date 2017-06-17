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
            infoPanelVisible: false
        }
        this.handleMapLoad = this.handleMapLoad.bind(this);
        this.handleMapClick = this.handleMapClick.bind(this);
        this.handleMouseHover = this.handleMouseHover.bind(this);
    }

    handleMapLoad(map) {
        this._mapComponent = map;
    }

    handleMapClick(event) {

    }

    handleMouseHover() {
        console.log('hover');
        this.setState({infoPanelVisible: true});
    }

    render() {
        return (
                <div className='map'>
                    <InitialMap
                        containerElement={
                            <div style={{ height: `100%`, width: `100%` }} />
                        }
                        mapElement={
                            <div style={{ height: `100%`, width: `100%` }} />
                        }
                        markers={this.props.restaurants}
                        onMapLoad={this.handleMapLoad}
                        onMapClick={this.handleMapClick}
                        onMouseOver={this.handleMouseHover}
                        infoPanelVisible={this.state.infoPanelVisible}
                    />
                </div>
        );
    }
}
