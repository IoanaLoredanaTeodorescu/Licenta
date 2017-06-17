import React, {Component} from 'react';
import Tabs from '../tabs/tabs';
import {getSizeOfObject} from '../../services/functions';


class Header extends Component {
    constructor() {
        super();
        //this.getUserData = this.getUserData.bind(this);
        this.getFullName = this.getFullName.bind(this);
        this.makeButtonsLogged = this.makeButtonsLogged.bind(this);
        this.handleClickMyProfile = this.handleClickMyProfile.bind(this);
        this.handleClickLogout = this.handleClickLogout.bind(this);
    }

    // getUserData() {
    //     let obj = this.props.userData;
    //     if(getSizeOfObject(obj) > 0) {
    //         this.setState({userData: this.props.userData});
    //     }
    // }

    getFullName() {
        let obj = this.props.userData;
        if(getSizeOfObject(obj) > 0) {
            return obj.fullname;
        }
    }

    handleClickMyProfile() {
        console.log('clicked my profile');
    }

    handleClickLogout() {
        console.log('clicked logout');
    }

    makeButtonsLogged() {
        let obj = this.props.userData;
        if(getSizeOfObject(obj) > 0) {
            return (
                <div className='top'>
                    <div className='title-logged-true'>
                        Salut {this.getFullName()} !
                    </div>
                    <div className='buttons-logged-true'>
                        <span onClick={this.handleClickMyProfile}>Profilul meu</span>
                        <span onClick={this.handleClickLogout}>Logout</span>
                    </div>
                </div>
            );
        }
    }

    render() {
        //this.getUserData();
        return (
            <div className='all-header'>
                <div className='left-side'>
                    <span className='restaurante'>
                        restaurante
                    </span>
                    <span className='iasi'>
                        iași
                    </span>
                </div>
                <div className='right-side'>
                    {this.makeButtonsLogged()}
                    <Tabs
                        callback={this.props.callback}
                        tabs={this.props.tabs}
                        selectedTab={this.props.selectedTab}
                    />
                </div>

            </div>
        );
    }
}

export default Header;
