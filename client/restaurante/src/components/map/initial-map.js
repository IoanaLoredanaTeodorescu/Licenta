/* global google */
import React from "react";
import _ from "lodash";
import {
    withGoogleMap,
    GoogleMap,
    InfoWindow,
    Marker,
    DirectionsRenderer
} from "react-google-maps";
import Rating from 'react-rating';
import LogoImgPinLocation2 from '../../assets/graphic/location_pin2.ico';
import LogoImgPinLocation1 from '../../assets/graphic/location_pin1.ico';
import LogoImgEmpty from '../../assets/graphic/ustensil_color.png';
import LogoImgFull from '../../assets/graphic/ustensil.png';


function returnInfo(props, marker) {
    if(props.type === 'just-info') {
        return (
            <InfoWindow className='info-wrapper' onCloseClick={() => props.closeInfoWindowFromX(marker.id)}>
              <div className='info-box'>
                  <span className='name-of-restaurant'>
                      {marker.name}
                  </span>
              </div>
            </InfoWindow>
        );
    } else if(props.type === 'just-info-with-click') {
        let raiting = marker.raiting;
        if(raiting === '') {
            raiting = '0';
        }
        return (
            <InfoWindow className='info-wrapper' onCloseClick={() => props.closeInfoWindowFromX(marker.id)}>
              <div className='info-box'>
                  <span className='name-of-restaurant-all' onClick={() => props.handleClickOnInfoBox(marker)}>
                      {marker.name}
                  </span>
                  <span className='raiting'>
                    <Rating
                        placeholderRate={parseFloat(raiting)}
                        empty={<img src={LogoImgEmpty} alt='logo' className="icon-review"/>}
                        placeholder={<img src={LogoImgFull} alt='logo' className="icon-review" />}
                        full={<img src={LogoImgFull} alt='logo' className="icon-review" />}
                        readonly
                    />
                    <span className='text-review'>{raiting} puncte</span>
                </span>
              </div>
            </InfoWindow>
        );
    } else if(props.type === 'just-info-with-click-with-row') {
        let raiting = marker.raiting;
        if(raiting === '') {
            raiting = '0';
        }
        return (
            <InfoWindow className='info-wrapper' onCloseClick={() => props.closeInfoWindowFromX(marker.id)}>
              <div className='info-box'>
                  <span className='name-of-restaurant-all' onClick={() => {props.handleClickOnInfoBox(marker)}}>
                      {marker.name}
                  </span>
                  <span className='raiting'>
                    <Rating
                        placeholderRate={parseFloat(raiting)}
                        empty={<img src={LogoImgEmpty} alt='logo' className="icon-review"/>}
                        placeholder={<img src={LogoImgFull} alt='logo' className="icon-review" />}
                        full={<img src={LogoImgFull} alt='logo' className="icon-review" />}
                        readonly
                    />
                    <span className='text-review'>{raiting} puncte</span>
                </span>
              </div>
            </InfoWindow>
        );
    }
}

function getCurrnetLocation(props, lat, lng) {
    if(props.currentLocation && props.currentLocation.lat && props.currentLocation.lng) {
        return (
            <Marker
                key={0}
                position={{lat: lat * 1, lng: lng * 1}}
                icon='https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
                onClick={() => props.deleteDirection()}
            >
            </Marker>
        );
    }

}

function showDirection() {

}

const InitialMap = withGoogleMap(props => {

    var lat = 0;
    var lng = 0;
    if(props.currentLocation && props.currentLocation.lat && props.currentLocation.lng) {
        lat = parseFloat(props.currentLocation.lat);
        lng = parseFloat(props.currentLocation.lng);
    } else {
        lat = 47.1739724;
        lng = 27.5699964;
    }

    return (<GoogleMap
        ref={props.onMapLoad}
        zoom={props.zoom}
        key={'google-map-key'}
        defaultCenter={new google.maps.LatLng(lat, lng)}
        onClick={props.onMapClick} >
        {
            props.markers.map((marker, index) => {
                if(props.myMarkers && _.includes(props.myMarkers, marker)) {
                    return (
                        <Marker
                            key={marker.id}
                            position={{lat: marker.lat * 1, lng: marker.lng * 1}}
                            onMouseOver={() => props.showInfoWindow(marker.id)}
                            onMouseOut={() => props.closeInfoWindow(marker.id)}
                            icon={LogoImgPinLocation2}
                            onClick={() => props.showDirection(marker, lat, lng)}
                        >
                        {marker.showInfo && returnInfo(props, marker)}
                        </Marker>
                    );
                } else {
                    return (
                        <Marker
                            key={index}
                            position={{lat: marker.lat * 1, lng: marker.lng * 1}}
                            onMouseOver={() => props.showInfoWindow(marker.id)}
                            onMouseOut={() => props.closeInfoWindow(marker.id)}
                            onClick={() => props.showDirection(marker, lat, lng)}
                        >
                        {marker.showInfo && returnInfo(props, marker)}
                        </Marker>
                    );
                }
            })
        }
        {props.direction && <DirectionsRenderer directions={props.direction} />}
        {getCurrnetLocation(props,lat, lng)}
    </GoogleMap>
    );
});

export default InitialMap;
