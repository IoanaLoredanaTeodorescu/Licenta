import React, {Component} from 'react';
import Raiting from '../rating/rating';

class AddReview extends Component {

    constructor(props){
    	super(props);
    	this.state = {
            rate: 5,
            textareaValue: '',
            addReviewError: '',
            modalVisibility: false,
            addReview: false,
            buttonAddReviewClicked: false
        };
        this.handleRateHover = this.handleRateHover.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.addReview = this.addReview.bind(this);
        this.popUp = this.popUp.bind(this);
        this.yesAddReview = this.yesAddReview.bind(this);
        this.noAddReview = this.noAddReview.bind(this);
        this.setButtonAddClicked = this.setButtonAddClicked.bind(this);
    }

    handleRateHover(rate) {
        this.setState({rate: rate});
    }

    handleChange(e) {
        this.setState({
            textareaValue: e.target.value
        });
    }

    changeVisibilityModal() {
        this.setState({modalVisibility: !this.state.modalVisibility});
    }

    yesAddReview() {
        this.setState({addReview: true});

    }

    noAddReview() {
        this.setState({addReview: false});
        this.changeVisibilityModal();
    }

    addReview() {
        let {rate, textareaValue} = this.state;
        let idRestaurant = this.props.idRestaurant;
        let email = this.props.userDataInfoEmail;
        let name = this.props.userDataInfoName;
            fetch('/add-review', {method: 'POST',
                body: JSON.stringify({rate: rate, textareaValue: textareaValue, idRestaurant: idRestaurant, email: email, name: name}),
                headers: {"Content-Type": "application/json"}})
                .then(res => {
                    if(typeof res === 'object') {
                        this.setState({addReviewError: ''});
                        return res.json();
                    }
                })
                .then(resp => {
                    if(resp.typeError === 'NoError') {
                        console.log(resp.message);
                        this.props.callback(idRestaurant);
                        this.setState({
                            rate: 5,
                            textareaValue: '',
                            modalVisibility: false
                        });
                    } else {
                        if(resp.message) {
                            this.setState({addReviewError: resp.message});
                        }
                    }
                })
                .catch(e => {
                    this.setState({addReviewError: 'A apărut o eroare neașteptată la adăugarea recenziei!'});
                    console.error('Error->', e);
            });
            //this.props.callback();
    }

    popUp(rate, text) {
        if(this.state.modalVisibility === true)
            {
                return (
                    <div className='login-modal-wrapper' onClick={() => this.changeVisibilityModal()}>
                        <div className='login-modal' onClick={(e) => e.stopPropagation()}>
                            <div className='ask'>Ești sigur că vrei să adaugi recenzia cu rating {rate} și textul {text} ?</div>
                            <div className='butons'>
                                <button onClick={this.addReview}>Da</button>
                                <button onClick={this.changeVisibilityModal}>Nu</button>
                            </div>
                        </div>
                    </div>
                );
            }
        }

    setButtonAddClicked() {
        this.setState({
            buttonAddClicked: true,
            modalVisibility: true
        });
    }

    render() {
        return (
            <div className='add-review-wrapper'>
                <div className='rating-review' >
                    <Raiting rating={this.state.rate} logged={true} rate={this.handleRateHover} />
                </div>
                <textarea value={this.state.textareaValue} onChange={this.handleChange} type="text" className='review-textarea' placeholder='Scrie o recenzie...' maxLength="600"/>
                <span className='error'>{this.state.addReviewError}</span>
                <div className='buton-add-review-wrapper'>
                    <button className='buton-add-review' onClick={() => this.setButtonAddClicked()}>Adaugă recenzie</button>
                </div>
                {this.popUp(this.state.rate, this.state.textareaValue)}
            </div>
        );
    }
}

export default AddReview;
