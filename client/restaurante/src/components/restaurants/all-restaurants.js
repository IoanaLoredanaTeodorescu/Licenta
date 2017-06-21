import React from 'react';
import Restaurant from './restaurant';

export default function AllRestaurants({restaurants, onClickName, onClickTag, type}) {
	return (
		<div className='restaurants-wrapper'>
		{
			restaurants.map( item => {
				item.defaultAnimation = 2;
				item = [].concat(item);
				return (
					<Restaurant key={item.id} restaurant={item} type={type} onClickName={onClickName} onClickTag={onClickTag}/>
				);
			})
		}
		</div>
	);
}
