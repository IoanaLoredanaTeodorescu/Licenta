import React from 'react';
import Restaurant from './restaurant';

export default function AllRestaurants({restaurants}) {
	return (
		<div className='restaurants-wrapper'>
		{
			restaurants.map( item => {
				return (
					<Restaurant key={item.id} restaurant={item} />
				);
			})
		}
		</div>
	);
}
