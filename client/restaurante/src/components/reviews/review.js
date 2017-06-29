import React, {Component} from 'react';
import Raiting from '../rating/rating';
class Review extends Component {
    render() {
        let {credibility_score} = this.props.review;
        console.log('credibility_score', credibility_score)

        var a = null;
        if(credibility_score < 0) {
            a = ((((-1) * parseFloat(credibility_score)) - 1) * 2) / 10;
            let r = 256,
                g = 40,
                b = 40;
            return (
                <div style={{backgroundColor: 'rgba(' + parseFloat(r) +','+parseFloat(g)+','+parseFloat(b)+','+parseFloat(a)+')'}} className='review' >
                    <div className='top-review'>
                        <span className='name-of-author'>{this.props.review.author_name}</span>
                        <span className='relative-time'>({new Date(this.props.review.time).toLocaleString()})</span>
                    </div>
                    <div className='content-review'>
                        <div className='raiting-review'>
                            <Raiting rating={this.props.review.rating}/>
                        </div>
                        <span className='message-of-author'>{this.props.review.message}</span>
                    </div>

                </div>
            );
        } else if(credibility_score > 0){
            a = (((parseFloat(credibility_score)) - 1) * 2) / 10;
            let r = 34,
                g = 210,
                b = 93;
            return (
                <div style={{backgroundColor: 'rgba(' + parseFloat(r) +','+parseFloat(g)+','+parseFloat(b)+','+parseFloat(a)+')'}} className='review' >
                    <div className='top-review'>
                        <span className='name-of-author'>{this.props.review.author_name}</span>
                        <span className='relative-time'>({new Date(this.props.review.time).toLocaleString()})</span>
                    </div>
                    <div className='content-review'>
                        <div className='raiting-review'>
                            <Raiting rating={this.props.review.rating}/>
                        </div>
                        <span className='message-of-author'>{this.props.review.message}</span>
                    </div>

                </div>
            );
        } else {
            return (
                <div style={{backgroundColor: 'rgba(255, 255, 255, 0.6)'}} className='review' >
                    <div className='top-review'>
                        <span className='name-of-author'>{this.props.review.author_name}</span>
                        <span className='relative-time'>({new Date(this.props.review.time).toLocaleString()})</span>
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
}

export default Review;
