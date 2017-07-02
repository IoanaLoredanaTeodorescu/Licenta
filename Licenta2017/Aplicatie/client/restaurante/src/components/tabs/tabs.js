import React, {Component} from 'react';
import Tab from './tab';

class Tabs extends Component {
    constructor(){
        super();
        this.isSelected=this.isSelected.bind(this);
    }

    isSelected(tabId) {
		return this.props.selectedTab === tabId;
	}

    render() {
        let tabs = this.props.tabs;
        let callback = this.props.callback;
        return (
            <div className="tabs-wrapper">
            {
                tabs.map( item => {
                    return (
                        <Tab key={item.id} tab={item} callback={callback} isSelected={this.isSelected(item.id)}/>
                    );
                })
            }
            </div>
        );
    }
}

export default Tabs;
