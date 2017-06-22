import React, {Component} from 'react';
import Rating from 'react-rating';
import RestaurantsMap from '../map/map';
import Lightbox from 'react-images';
import LogoImgAddress from '../../assets/graphic/location.png';
import LogoImgOpening from '../../assets/graphic/opening.png';
import LogoImgTelephone from '../../assets/graphic/mobile.png';
import LogoImgWebsite from '../../assets/graphic/website.png';
import Raiting from '../rating/rating';


class Restaurant extends Component {
    constructor(props){
    	super(props);
    	this.state = {
            tagBarVisible: false
        };
        this.ifNotEmptyReturn = this.ifNotEmptyReturn.bind(this);
        this.handleClickButonTag = this.handleClickButonTag.bind(this);
        this.renderTagsBar = this.renderTagsBar.bind(this);
        this.handleClickButonAddReview = this.handleClickButonAddReview.bind(this);
    }

    ifNotEmptyReturn(input, name) {
        switch (name) {
            case 'phone':
                if(input !== '') {
                    return (
                        <div className='phone-wrapper'>
                            <img src={LogoImgTelephone} alt='logo' className='add-padding'/>
                            <span className='telephone'>{input}</span>
                        </div>
                    );
                }
                break;
            case 'address':
                if(input !== '') {
                    input = input.split(",");
                    input = input.slice(0, -2);
                    let k = 0;
                    return (
                        <div className='address-wrapper'>
                            <img src={LogoImgAddress} alt='logo' className='add-padding'/>
                            <div className='address'>
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
                break;
            case 'opening_hours':
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
                break;
            case 'website':
                if(input !== '') {
                    return (
                        <div className='website-wrapper'>
                            <img src={LogoImgWebsite} alt='logo' className='add-padding'/>
                            <div className='website'>
                                <a href={input} target="_blank">{input}</a>
                            </div>
                        </div>
                    );
                }
            default:
        }
    }

    handleClickButonTag() {
        this.setState({tagBarVisible: !this.state.tagBarVisible});
    }

    renderTagsBar(array_tags, i) {
        if(this.state.tagBarVisible === true) {
            return (
                <div className='tags'>
                    {
                        array_tags.map( item => {
                            return (
                                <div key={i++} className='tag' onClick={() => {this.props.onClickTag(item)}}>{item}</div>
                            );
                        })
                    }
                </div>
            );
        }
    }

    renderSymbol() {
        if(this.state.tagBarVisible === false) {
            return (
                <span className='button-tag' onClick={this.handleClickButonTag}>&#x226B;<span className=''>Click </span></span>
            )
        } else return (<span className='button-tag' onClick={this.handleClickButonTag}>&#x226A;</span>);
    }

    handleClickButonAddReview(restaurant, logged) {
        if(logged === false) {
            this.props.redirectToLogin();
        } else this.props.onClickName(restaurant);
    }


    render() {
        let {id, name, raiting, address, tags, lat, lng, phone, opening_hours, website} = this.props.restaurant[0];
        let array_tags = tags.split(",");
        let rating = raiting === '' ? 0 : raiting;
        console.log(website)
        var i=0;
        return (
            <div key={id} className='restaurant'>
                <div className='title-wrapper'>
                    <span className='name-restaurant' onClick={() => {this.props.onClickName(this.props.restaurant[0])}}>
                        {name}
                    </span>
                    {this.ifNotEmptyReturn(opening_hours, 'opening_hours')}
                    <div className='rating-wrapper'>
                        <Raiting rating={rating}/>
                    </div>
                </div>
                <div className='content-restaurant'>
                    <div className='left-side'>
                        <div className='contact'>
                            {this.ifNotEmptyReturn(phone, 'phone')}
                            {this.ifNotEmptyReturn(address, 'address')}
                            {this.ifNotEmptyReturn(website, 'website')}
                        </div>
                    </div>

                    <div className='right-side'>
                        <div className='map-restaurant'>
                            <RestaurantsMap type={this.props.type} restaurants={this.props.restaurant} />
                        </div>
                    </div>
                </div>

                <div className='tags-wrapper'>
                    {this.renderSymbol()}
                    {this.renderTagsBar(array_tags, i)}
                </div>

                <div className='add-review-button-wrapper'>
                    <div className='add-review-button tooltip-add-review' onClick={() => this.handleClickButonAddReview(this.props.restaurant[0], this.props.logged)}>
                        &#43;
                        <span className='text-tolltip-add-review tooltiptext-add-review'>Scrie recenzie</span>
                    </div>
                </div>
    		</div>
        );
    }
}

export default Restaurant;
