import _ from "lodash";
import React, {Component} from "react";
import {
    withGoogleMap,
    GoogleMap,
    InfoWindow,
    Marker
} from "react-google-maps";
import Rating from 'react-rating';
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
        return (
            <InfoWindow className='info-wrapper' onCloseClick={() => props.closeInfoWindowFromX(marker.id)}>
              <div className='info-box'>
                  <span className='name-of-restaurant-all'>
                      {marker.name}
                  </span>
                  <span className='raiting'>
                    <Rating
                        placeholderRate={marker.raiting}
                        empty={<img src={LogoImgEmpty} className="icon-review"/>}
                        placeholder={<img src={LogoImgFull} className="icon-review" />}
                        full={<img src={LogoImgFull} className="icon-review" />}
                        readonly
                    />
                    <span className='text-review'>{marker.raiting} puncte</span>
                </span>
              </div>
            </InfoWindow>
        );
    }
}

const InitialMap = withGoogleMap(props => {

    let lat = parseFloat(props.currentLocation.lat);
    let lng = parseFloat(props.currentLocation.lng);

    return (<GoogleMap
        ref={props.onMapLoad}
        zoom={15}
        defaultCenter={{lat: 47.1739724, lng: 27.5699964}}
        //center={{lat: lat, lng: lng}}
        onClick={props.onMapClick} >
        {
            props.markers.map((marker, index) => {
                return (
                    <Marker
                        key={index}
                        position={{lat: marker.lat * 1, lng: marker.lng * 1}}
                        onMouseOver={() => props.showInfoWindow(marker.id)}
                        onMouseOut={() => props.closeInfoWindow(marker.id)}
                    >
                    {marker.showInfo && returnInfo(props, marker)}
                    </Marker>
                );
            })
        }
    </GoogleMap>
    );
});

export default InitialMap;
