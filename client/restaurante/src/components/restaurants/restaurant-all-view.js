import React, {Component} from 'react';
import Reviews from '../reviews/reviews';
import AddReview from '../reviews/add-review';
import Raiting from '../rating/rating';
import LogoImgAddress from '../../assets/graphic/location.png';
import LogoImgOpening from '../../assets/graphic/opening.png';
import LogoImgTelephone from '../../assets/graphic/mobile.png';
import LogoImgBack from '../../assets/graphic/back.png';
import Autentificare from '../autentificare-inregistrare/autentificare';
import Inregistrare from '../autentificare-inregistrare/inregistrare';

class RestaurantAllView extends Component {
    constructor() {
        super();
        this.state = {
            restaurantReviews: [],
            buttonAddClicked: false,
            loginModalVisibility: false,
            viewModal: 'autentificare'
        }
        this.ifNotEmptyReturnHours = this.ifNotEmptyReturnHours.bind(this);
        this.ifNotEmptyReturnTelephone = this.ifNotEmptyReturnTelephone.bind(this);
        this.ifNotEmptyReturnWebsite = this.ifNotEmptyReturnWebsite.bind(this);
        this.handleButtonAddClicked = this.handleButtonAddClicked.bind(this);
        this.showAddReview = this.showAddReview.bind(this);
        this.showModal = this.showModal.bind(this);
        this.changeVisibilityLoginModal = this.changeVisibilityLoginModal.bind(this);
        this.changeViewModalToSignup = this.changeViewModalToSignup.bind(this);
        this.changeViewModalToLogin = this.changeViewModalToLogin.bind(this);
        this.handleClickedAddReviewButton = this.handleClickedAddReviewButton.bind(this);
        this.getReviews = this.getReviews.bind(this);
    }

    componentWillMount() {
        this.getReviews(this.props.idRestaurant);
    }

    getReviews(idRestaurant) {
        fetch('/restaurantid/' + idRestaurant, {method: 'GET'})
        .then(response => {
            if(typeof response === 'object') {
                return response.json();
            }
        })
        .then(resp => {
            if(resp.message && typeof resp.message === 'object') {
                this.setState({restaurantReviews: resp.message});
            } else {
                if(resp.message) {
                    console.log(resp.message);
                }
            }
        })
        .catch(e => {
            console.error('Error->', e);
        });

        if(this.props.isOnButton === true && this.props.logged === true) {
            this.setState({buttonAddClicked: true});
        }
    }

    changeVisibilityLoginModal() {
        this.setState({loginModalVisibility: !this.state.loginModalVisibility});
    }

    handleButtonAddClicked() {
        this.setState({
            //buttonAddClicked: true,
            loginModalVisibility: true
        });
    }

    changeViewModalToSignup() {
        this.setState({viewModal: 'inregistrare'});
    }

    changeViewModalToLogin() {
        this.setState({viewModal: 'autentificare'});
    }

    searchIfLogged(logged) {
        this.setState({buttonAddClicked: true});
    }


    showModal() {
        if(this.state.loginModalVisibility === true) {
            if(this.state.viewModal === 'autentificare') {
                console.log(this.props.userData);
                return (
                    <div className='login-modal-wrapper' onClick={() => this.changeVisibilityLoginModal()}>
                        <div className='login-modal' onClick={(e) => e.stopPropagation()}>
                            <Autentificare
                                redirectToSignup={this.changeViewModalToSignup}
                                loginCallback={this.props.isLogged}
                                userData={this.props.userData}
                                redirect={() => {
                                    this.changeVisibilityLoginModal();
                                    this.setState({buttonAddClicked: true});
                                }}
                                getMyRestaurants={this.getMyRestaurants}
                            />
                        </div>
                    </div>
                );
            } else if(this.state.viewModal === 'inregistrare') {
                return (
                    <div className='login-modal-wrapper' onClick={() => this.changeVisibilityLoginModal()}>
                        <div className='login-modal' onClick={(e) => e.stopPropagation()}>
                            <Inregistrare
                                redirectToLogin={this.changeViewModalToLogin}
                                buttonName='Înregistrare'
                                typeOfButton='signup'
                            />
                        </div>
                    </div>
                );
            }
        }
    }

    handleClickedAddReviewButton() {

    }

    showAddReview(logged) {
            if (logged === false) {
                return (
                    <div className='add-review-button-wrapper'>
                        <div className='add-review-button tooltip-add-review' onClick={this.handleButtonAddClicked}>
                            &#43;
                            <span className='text-tolltip-add-review tooltiptext-add-review'>Scrie recenzie</span>
                        </div>
                    </div>
                );
            } else if(logged === true) {
                return (
                    <AddReview
                        idRestaurant={this.props.idRestaurant}
                        userDataInfoEmail={this.props.userDataInfoEmail}
                        userDataInfoName={this.props.userDataInfoName}
                        callback={this.getReviews}
                        callbackReloadRestaurants={this.props.callbackReloadRestaurants}
                    />
                );
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
                    {this.showModal()}
                    {this.showAddReview(this.props.logged)}
                    <Reviews restaurantReviews={restaurantReviews} />
                    <img className='back-button' onClick={this.props.buttonClicked} src={LogoImgBack} />
                </div>
            </div>
        );
    }
}

export default RestaurantAllView;
