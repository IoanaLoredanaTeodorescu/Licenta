import React from 'react';
import Lightbox from 'react-images';

function parseTags(tags) {
    var newArr = [];
    for(var j = 0; j < tags.length; j++){
        if(tags[j].indexOf('point_of_in') === -1 && tags[j].indexOf('establ') === -1) {
            newArr.push(tags[j]);
        }
    }
    return newArr;
}


export default function Restaurant({restaurant, onClick}) {
    let {id, name, address, tags, description} = restaurant;
    let array_tags = tags.split(",");
    var i=0;
	return (
		<div key={id} className='restaurant' onClick={() => {onClick(id)}}>
			<div className='name-restaurant' >
                {name}
            </div>
			<div className='address-restaurant'>
                {address}
            </div>
            <div className='tags'>
                {
                    parseTags(array_tags).map( item => {
                        return (
                            <span key={i++} className='tag'>{item}</span>
                        );
                    })
                }
            </div>
            <div className='description'>
                {description}
            </div>
            <div className='gallery'>

            </div>
		</div>
	);
}
