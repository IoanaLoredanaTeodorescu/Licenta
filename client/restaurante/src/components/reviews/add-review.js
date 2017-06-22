import React, {Component} from 'react';
import Raiting from '../rating/rating';

export default class AddReview extends Component {

    render() {
        return (
            <div className='add-review-wrapper'>
                <div className='rating-review' >
                    <Raiting rating={'5'} logged={true} />
                </div>
                <textarea className='review-textarea' placeholder='Scrie o recenzie...' maxLength="600"/>
                <div className='buton-add-review-wrapper'>
                    <button className='buton-add-review'>Adaugă recenzie</button>
                </div>
            </div>
        );
    }
}
