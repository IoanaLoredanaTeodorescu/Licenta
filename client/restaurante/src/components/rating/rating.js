import React, {Component} from 'react';
import LogoImgEmpty from '../../assets/graphic/ustensil_color.png';
import LogoImgFull from '../../assets/graphic/ustensil.png';
import Rating from 'react-rating';

class Raiting extends Component {
    constructor(props){
    	super(props);
        this.state= {
            rate: 5
        }
    	this.ifLogged = this.ifLogged.bind(this);
    	this.handleRate = this.handleRate.bind(this);
    }

    handleRate(rate) {
        if(rate) {
            this.setState({rate: parseFloat(rate)});
            this.props.rate(parseFloat(rate));
        } else if(rate === '') {
            this.setState({rate: parseFloat(0)});
        }
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
                        full={<img src={LogoImgFull} alt='logo' className="icon"/>}
                        onRate={(rate) => {this.handleRate(rate)}}
                        onChange={(rate) => {this.handleRate(rate)}}
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
