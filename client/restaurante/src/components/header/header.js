import React, {Component} from 'react';
import Tabs from '../tabs/tabs';


class Header extends Component {


    render() {
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
