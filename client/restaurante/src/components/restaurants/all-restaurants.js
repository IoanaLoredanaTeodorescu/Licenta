import React, {Component} from 'react';
import Restaurant from './restaurant';

class AllRestaurants extends Component {
	render() {
		let k = 0;
		return (
			<div className='restaurants-wrapper'>
			{
				this.props.restaurants.map( item => {
					item.defaultAnimation = 2;
					item = [].concat(item);
					return (
						<Restaurant key={k++} restaurant={item} type={this.props.type} onClickName={this.props.onClickName} onClickTag={this.props.onClickTag}/>
					);
				})
			}
			</div>
		);
	}
}

export default AllRestaurants;
