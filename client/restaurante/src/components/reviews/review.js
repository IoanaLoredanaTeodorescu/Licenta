import React, {Component} from 'react';
import Raiting from '../rating/rating';
class Review extends Component {
    constructor(props){
    	super(props)
    }

    render() {
        return (
            <div className='review'>
                <div className='top-review'>
                    <span className='name-of-author'>{this.props.review.author_name}</span>
                    <span className='relative-time'>({this.props.review.relative_time_description})</span>
                </div>
                <div className='content-review'>
                    <div className='raiting-review'>
                        <Raiting rating={this.props.review.rating}/>
                    </div>
                    <span className='message-of-author'>{this.props.review.message}</span>
                </div>

            </div>
        );
    }
}

export default Review;
