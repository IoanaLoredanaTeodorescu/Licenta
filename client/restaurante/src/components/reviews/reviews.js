import React, {Component} from 'react';
import Review from './review';

class Reviews extends Component {
    constructor(props){
    	super(props);
        this.showMessageZeroRezults = this.showMessageZeroRezults.bind(this);
    }

    showMessageZeroRezults(restaurantReviews) {
        if(restaurantReviews.length === 0) {
            return (<div className='message-zero-result'>Nu există recenzii!</div>);
        } else {
            let k = 0;
            return (
                <div className='reviews'>
                    {
                        restaurantReviews.map(review => {
                            console.log(review);
                            return (
                                <Review key={k++} review={review}/>
                            );
                        })
                    }
                </div>
            );
        }
    }

    render() {
        let restaurantReviews = this.props.restaurantReviews;
        return (
            <div>
                {this.showMessageZeroRezults(restaurantReviews)}
            </div>
        );
    }
}
export default Reviews;
