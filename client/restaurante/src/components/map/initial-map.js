import _ from "lodash";
import React, {Component} from "react";
import {
    withGoogleMap,
    GoogleMap,
    InfoWindow,
    Marker
} from "react-google-maps";

const InitialMap = withGoogleMap(props => (
        <GoogleMap
            ref={props.onMapLoad}
            defaultZoom={12}
            defaultCenter={{lat: 47.1567647, lng: 27.6121708}}
            onClick={props.onMapClick}>
            {
                props.markers.map((marker, index) => {
                    return (
                        <Marker
                            key={index}
                            position={{lat: marker.lat * 1, lng: marker.lng * 1}}
                            onMouseOver={props.onMouseOver}
                        />

                                // <InfoWindow position={{lat: marker.lat * 1, lng: marker.lng * 1}} visible={props.infoPanelVisible}>
                                //   <div>{marker.description}</div>
                                // </InfoWindow>
                    );
                })
            }
        </GoogleMap>


    )
);

export default InitialMap;
