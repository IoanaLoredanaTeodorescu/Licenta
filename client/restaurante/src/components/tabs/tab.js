import React, {Component} from 'react';

class Tab extends Component{

    render(){
        let tab = this.props.tab;
        let isSelected = this.props.isSelected;

        let {id, name} = tab,
    		tabClass = isSelected ? 'tab selected' : 'tab';

        return (
            <div key={id} className={tabClass} onClick={() => this.props.callback(id)}>
                {name || 'Tab'}
            </div>
        );
    }
}

export default Tab;
