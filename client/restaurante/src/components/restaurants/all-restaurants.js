import React from 'react';
import Restaurant from './restaurant';

export default function AllRestaurants({restaurants, onClick}) {
	return (
		<div className='restaurants-wrapper'>
		{
			restaurants.map( item => {
				return (
					<Restaurant key={item.id} restaurant={item} onClick={onClick}/>
				);
			})
		}
		</div>
	);
}
