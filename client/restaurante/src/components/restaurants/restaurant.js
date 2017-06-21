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

    render() {
        let {id, name, raiting, address, tags, lat, lng, phone, opening_hours} = this.props.restaurant[0];
        let array_tags = tags.split(",");
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
                            placeholderRate={parseFloat(raiting)}
                            empty={<img src={LogoImgEmpty} alt='logo' className="icon"/>}
                            placeholder={<img src={LogoImgFull} alt='logo' className="icon" />}
                            full={<img src={LogoImgFull} alt='logo' className="icon" />}
                            readonly
                        />
                        <span className='text-review'>{parseFloat(raiting)} puncte</span>
                    </span>
                </div>
                <div className='content-restaurant'>
                    <div className='left-side'>
                        <div className='contact'>
                            {this.ifNotEmptyReturn(phone, 'phone')}
                            {this.ifNotEmptyReturn(address, 'address')}
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
