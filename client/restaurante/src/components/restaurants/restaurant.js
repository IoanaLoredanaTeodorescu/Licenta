import React, {Component} from 'react';
import Rating from 'react-rating';
import RestaurantsMap from '../map/map';
import Lightbox from 'react-images';
import LogoImgAddress from '../../assets/graphic/location.png';
import LogoImgOpening from '../../assets/graphic/opening.png';
import LogoImgTelephone from '../../assets/graphic/mobile.png';
import LogoImgEmpty from '../../assets/graphic/ustensil_color.png';
import LogoImgFull from '../../assets/graphic/ustensil.png';

class Restaurant extends Component {
    constructor(props){
    	super(props);
    	this.state = {};
        this.ifNotEmptyReturn = this.ifNotEmptyReturn.bind(this);
    }

    ifNotEmptyReturn(input, name) {
        switch (name) {
            case 'phone':
                if(input !== '') {
                    return (
                        <div className='phone-wrapper'>
                            <img src={LogoImgTelephone} className='add-padding'/>
                            <span className='telephone'>{input}</span>
                        </div>
                    );
                }
                break;
            case 'address':
                if(input !== '') {
                    return (
                        <div className='address-wrapper'>
                            <img src={LogoImgAddress} className='add-padding'/>
                            <div className='address'>
                                <span className='strada'>{input[0]}</span>
                                {
                                    input.map(item => {
                                        if(item !== input) {
                                            return (
                                                <span className='rest-address'>, {item}</span>
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
                if(input !== '') {
                    return (
                        <div className='opening-wrapper'>
                            <img src={LogoImgOpening} className='add-padding'/>
                            <div className='opening'>
                                {
                                    input.split(",").map(item => {
                                        let arr = item.split("y");
                                        console.log(arr);
                                        return (
                                            <div className='day'>
                                                <span className='day-name'>{arr[0]+'y'}</span>
                                                <span className='day-program'>{arr[1]}</span>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </div>
                    );
                }
                break;
            default:

        }

    }

    render() {
        let {id, name, raiting, address, tags, lat, lng, phone, opening_hours} = this.props.restaurant;
        let array_tags = tags.split(",");
        let array_address = address.split(",");
        var i=0;
        return (
            <div key={id} className='restaurant'>
                <div className='title-wrapper'>
        			<span className='name-restaurant' onClick={() => {this.props.onClickName(id)}}>
                        {name}
                    </span>
                    <span className='raiting'>
                        <Rating
                            placeholderRate={raiting}
                            empty={<img src={LogoImgEmpty} className="icon"/>}
                            placeholder={<img src={LogoImgFull} className="icon" />}
                            full={<img src={LogoImgFull} className="icon" />}
                            readonly
                        />
                        <span className='text-review'>{raiting} points</span>
                    </span>
                </div>

                <div className='contact'>
                    {this.ifNotEmptyReturn(phone, 'phone')}
                    {this.ifNotEmptyReturn(array_address, 'address')}
                    {this.ifNotEmptyReturn(opening_hours, 'opening_hours')}
                </div>

                <div className='map-restaurant'>
                    <RestaurantsMap restaurants={this.props.restaurant} />
                </div>

                <div className='tags'>
                    {
                        array_tags.map( item => {
                            return (
                                <span key={i++} className='tag' onClickTag={() => {this.props.onClickTag('cafe')}}>{item}</span>
                            );
                        })
                    }
                </div>


    		</div>
        );
    }
}

export default Restaurant;
