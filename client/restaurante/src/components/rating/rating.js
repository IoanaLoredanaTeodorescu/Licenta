import React, {Component} from 'react';
import LogoImgEmpty from '../../assets/graphic/ustensil_color.png';
import LogoImgFull from '../../assets/graphic/ustensil.png';
import Rating from 'react-rating';

class Raiting extends Component {
    constructor(props){
    	super(props);
    	this.ifLogged = this.ifLogged.bind(this);
    }

    ifLogged() {
        let raiting = this.props.rating;
        if(this.props.logged && this.props.logged === true) {
            return (
                <div className='raiting'>
                    <Rating
                        placeholderRate={parseFloat(raiting)}
                        empty={<img src={LogoImgEmpty} alt='logo' className="icon"/>}
                        placeholder={<img src={LogoImgFull} alt='logo' className="icon" />}
                        full={<img src={LogoImgFull} alt='logo' className="icon" />}
                    />
                    <span className='text-review'>{parseFloat(raiting)} puncte</span>
                </div>
            );
        } else return (
            <div className='raiting'>
                <Rating
                    placeholderRate={parseFloat(raiting)}
                    empty={<img src={LogoImgEmpty} alt='logo' className="icon"/>}
                    placeholder={<img src={LogoImgFull} alt='logo' className="icon" />}
                    full={<img src={LogoImgFull} alt='logo' className="icon" />}
                    readonly
                />
                <span className='text-review'>{parseFloat(raiting)} puncte</span>
            </div>
        );
    }

    render() {
        return (
            <div>
                {this.ifLogged()}
            </div>
        );
    }
}

export default Raiting;
