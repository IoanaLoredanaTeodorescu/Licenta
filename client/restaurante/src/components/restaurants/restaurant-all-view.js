import React, {Component} from 'react';

class RestaurantAllView extends Component {
    constructor() {
        super();
        this.state = {
            restaurantReviews: []
        }
        this.getReview = this.getReview.bind(this);
    }

    componentWillMount() {
        //fetch('/restaurantid', {method: 'POST', body: JSON.stringify({id_restaurant: this.props.idRestaurant}), headers: {"Content-Type": "application/json"}})
        fetch('/restaurantid/'+this.props.idRestaurant, {method: 'GET'})
        .then(response => {
            if(typeof response === 'object') {
                return response.json();
            }
        })
        .then(resp => {
            if(resp.message && typeof resp.message === 'object') {
                this.setState({restaurantReviews: this.state.restaurantReviews.concat(resp.message)});
                console.log(resp.message);
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

    getReview() {
        let {restaurantReviews} = this.state;
        console.log(restaurantReviews);
        if(restaurantReviews.length === 0) {
            console.log ('0 reviews');
        } else {
            restaurantReviews.map(review => {
                console.log(review.user);
                return (
                    <div className='review'>
                        <div className='user-name'>
                            {review.user}
                            ksksk
                        </div>
                        <div className='review'>
                            {review.review}
                        </div>
                    </div>
                );
            });
        }

    }

    render() {
        return (
            <div className='restaurant-all-view-wrapper'>
            {this.props.idRestaurant}
                <div className='reviews'>
                    {this.getReview()}
                    ldldl
                </div>
                <button className='back-button' onClick={this.props.buttonClicked}>Back</button>
            </div>
        );
    }
}

export default RestaurantAllView;
