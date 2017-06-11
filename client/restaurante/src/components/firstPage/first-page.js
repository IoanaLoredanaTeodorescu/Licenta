import React, { Component } from 'react';
import Header from '../header/header';
import Constants from '../../services/constants';
import Autentificare from '../autentificare-inregistrare/autentificare';
import Inregistrare from '../autentificare-inregistrare/inregistrare';
import AllRestaurants from '../restaurants/all-restaurants';

class FirstPage extends Component {

    constructor(){
        super();
        this.state = {
            showedTab: null,
            selectedTab: 1,
            restaurants: []
        }
        this.changeTab = this.changeTab.bind(this);
        this.getSelectedTabView = this.getSelectedTabView.bind(this);
    }

    changeTab(id) {
		this.setState({selectedTab: id});
	}

    componentWillMount() {
        fetch('/allrestaurants', {method: 'GET'})
        .then(response => {
            if(typeof response === 'object') {
                return response.json();
            }
        })
        .then(resp => {
            if(resp.message && typeof resp.message === 'object') {
                this.setState({restaurants: this.state.restaurants.concat(resp.message)});
            } else {
                if(resp.message) {
                    console.log(resp.message);
                }
            }
        })
        .catch(e => {
            console.error('Error->', e);
        });
    }


    getSelectedTabView(id) {
		switch(id){
			case 1:
				return (<AllRestaurants restaurants={this.state.restaurants}/>);
			case 2:
				return (null);
			case 3:
				return (<Autentificare loginCallback={this.props.isLogged()}/>);
			case 4:
				return (<Inregistrare buttonName='Înregistrare' typeOfButton='signup' redirectToLogin={this.changeTab.bind(this, 3)}/>);
			default:
				return (<AllRestaurants restaurants={[{id:1, name:'llaa', address:'dddd'}]}/>);
		}
	}

    render() {
        let showedTab = this.getSelectedTabView(this.state.selectedTab);
        return (
            <div className="main-page">
                <div className='bg'></div>
                <div className='header'>
                    <Header callback={this.changeTab} tabs={Constants.firstPageTabs} selectedTab={this.state.selectedTab}/>
                </div>
                <div className='main-page-wrapper'>
                    <div className='main-page-content'>
                        <div className='output-tab-place'>
                            {showedTab}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default FirstPage;
