import React, {Component} from 'react';
import Reviews from '../reviews/reviews';
import AddReview from '../reviews/add-review';
import Raiting from '../rating/rating';
import LogoImgAddress from '../../assets/graphic/location.png';
import LogoImgOpening from '../../assets/graphic/opening.png';
import LogoImgTelephone from '../../assets/graphic/mobile.png';

class RestaurantAllView extends Component {
    constructor() {
        super();
        this.state = {
            restaurantReviews: []
        }
        this.searchIfIsLogged = this.searchIfIsLogged.bind(this);
        this.ifNotEmptyReturnHours = this.ifNotEmptyReturnHours.bind(this);
        this.ifNotEmptyReturnTelephone = this.ifNotEmptyReturnTelephone.bind(this);
        this.ifNotEmptyReturnWebsite = this.ifNotEmptyReturnWebsite.bind(this);
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

    searchIfIsLogged(logged) {
        if(logged === true) {
            return (<AddReview />);
        }
    }

    ifNotEmptyReturnHours(input) {
        let k = 0;
        if(input !== '') {
            return (
                <div className='opening-wrapper tooltip'>
                    <img src={LogoImgOpening} alt='logo' className='add-padding'/>
                    <div className='opening tooltiptext'>
                        {
                            input.split(",").map(item => {
                                let arr = item.split("y:");
                                return (
                                    <div key={k++} className='day'>
                                        <span key={k++} className='day-name'>{arr[0]+'y:'}</span>
                                        <span key={k++} className='day-program'>{arr[1]}</span>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
            );
        }
    }

    ifNotEmptyReturnTelephone(input) {
        if(input !== '') {
            return (
                <div className='phone-wrapper tooltip'>
                    <img src={LogoImgTelephone} alt='logo' className='add-padding'/>
                    <span className='telephone tooltiptext'>{input}</span>
                </div>
            );
        }
    }

    ifNotEmptyReturnWebsite(input) {
        if(input !== '') {
            return (
                <div className='website-wrapper'>
                    <a href={input} target="_blank">{input}</a>
                </div>
            );
        }
    }

    ifNotEmptyReturnAddress(input) {
        if(input !== '') {
            input = input.split(",");
            input = input.slice(0, -2);
            let k = 0;
            return (
                <div className='address-wrapper tooltip'>
                    <img src={LogoImgAddress} alt='logo' className='add-padding'/>
                    <div className='address tooltiptext'>
                        <span className='strada'>{input[0]}</span>
                        {
                            input.map(item => {
                                if(item !== input[0]) {
                                    return (
                                        <span key={k++} className='rest-address'>, {item}</span>
                                    );
                                }
                            })
                        }
                    </div>
                </div>
            );
        }
    }

    render() {
        let restaurantToShow = this.props.restaurantToShow;
        let {restaurantReviews} = this.state;
        let raiting = restaurantToShow.raiting;
        if(raiting === '') {
            raiting = 0;
        }
        return (
            <div className='restaurant-view-all'>
                <div className='restaurant-all-view-wrapper'>
                    <div className='title-restaurant-view'>
                        <span className='name-restaurant'>
                            {restaurantToShow.name}
                        </span>
                        <div className='contact-wrapper-view'>
                            {this.ifNotEmptyReturnHours(restaurantToShow.opening_hours)}
                            {this.ifNotEmptyReturnTelephone(restaurantToShow.phone)}
                            {this.ifNotEmptyReturnAddress(restaurantToShow.address)}
                        </div>
                        <div className='rating-wrapper'>
                            <Raiting rating={raiting}/>
                        </div>
                    </div>
                    {this.ifNotEmptyReturnWebsite(restaurantToShow.website)}
                    {this.searchIfIsLogged(this.props.logged)}

                    <Reviews restaurantReviews={restaurantReviews}/>
                    <button className='back-button' onClick={this.props.buttonClicked}>Back</button>
                </div>
            </div>
        );
    }
}

export default RestaurantAllView;
