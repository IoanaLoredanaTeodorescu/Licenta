import React from 'react';

export default function Restaurant({restaurant}) {
    let {id, name, address} = restaurant;
	return (
		<div key={id} className='restaurant' >
			<div className='name-restaurant'>
                {name}
            </div>
			<div className='address-restaurant'>
                {address}
            </div>
		</div>
	);
}
