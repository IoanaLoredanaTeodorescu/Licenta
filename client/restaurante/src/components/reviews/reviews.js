import React, {Component} from 'react';
import _ from 'lodash';
import Review from './review';

class Reviews extends Component {
    constructor(props){
    	super(props);
        this.state = {
            myReviewsRestaurants: []
        }
        this.showMessageZeroRezults = this.showMessageZeroRezults.bind(this);
    }

    componentWillMount() {
        fetch('/my-reviews/' + this.props.emailLogged, {method: 'GET'})
            .then(res => {
                if(typeof res === 'object') {
                    return res.json();
                }
            })
            .then(resp => {
                if(resp.typeError === 'NoError') {
                    console.log(resp.message);
                    this.setState({myReviewsRestaurants: resp.message});
                } else {
                    if(resp.message) {
                        console.log(resp.message);
                    }
                }
            })
            .catch(e => {
                console.error('Error->', e);
        });
    }

    showMessageZeroRezults(restaurantReviews) {
        if(restaurantReviews.length === 0) {
            return (<div className='message-zero-result'>Nu există recenzii!</div>);
        } else {
            let k = 0;
            let newRestaurantReviews = _.reverse(_.sortBy(restaurantReviews, 'credibility_score'));
            return (
                <div className='reviews'>
                    {
                        newRestaurantReviews.map(review => {
                            return (
                                <Review key={k++} review={review} />
                            );
                        })
                    }
                </div>
            );
        }
    }

    render() {
        let restaurantReviews = this.props.restaurantReviews ? this.props.restaurantReviews : this.state.myReviewsRestaurants;
        return (
            <div>
                {this.showMessageZeroRezults(restaurantReviews)}
            </div>
        );
    }
}
export default Reviews;
