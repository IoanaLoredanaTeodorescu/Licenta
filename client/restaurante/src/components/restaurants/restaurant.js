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
    	this.state = {
            tagBarVisible: false
        };
        this.ifNotEmptyReturn = this.ifNotEmptyReturn.bind(this);
        this.handleClickButonTag = this.handleClickButonTag.bind(this);
        this.renderTagsBar = this.renderTagsBar.bind(this);
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
                                        if(item !== input[0] && item !== input[input.length-1]) {
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
                        <div className='opening-wrapper tooltip'>
                            <img src={LogoImgOpening} className='add-padding'/>
                            <div className='opening tooltiptext'>
                                {
                                    input.split(",").map(item => {
                                        let arr = item.split("y:");
                                        return (
                                            <div className='day'>
                                                <span className='day-name'>{arr[0]+'y:'}</span>
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
                                <span key={i++} className='tag' onClickTag={() => {this.props.onClickTag('cafe')}}>{item}</span>
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

    render() {
        let {id, name, raiting, address, tags, lat, lng, phone, opening_hours} = this.props.restaurant[0];
        let array_tags = tags.split(",");
        let array_address = address.split(",");
        array_address = array_address.slice(0, -1);
        var i=0;
        return (
            <div key={id} className='restaurant'>
                <div className='title-wrapper'>
                    <span className='name-restaurant' onClick={() => {this.props.onClickName(id)}}>
                        {name}
                    </span>
                    {this.ifNotEmptyReturn(opening_hours, 'opening_hours')}
                    <span className='raiting'>
                        <Rating
                            placeholderRate={raiting}
                            empty={<img src={LogoImgEmpty} className="icon"/>}
                            placeholder={<img src={LogoImgFull} className="icon" />}
                            full={<img src={LogoImgFull} className="icon" />}
                            readonly
                        />
                        <span className='text-review'>{raiting} puncte</span>
                    </span>
                </div>
                <div className='content-restaurant'>
                    <div className='left-side'>
                        <div className='contact'>
                            {this.ifNotEmptyReturn(phone, 'phone')}
                            {this.ifNotEmptyReturn(array_address, 'address')}
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
    		</div>
        );
    }
}

export default Restaurant;
