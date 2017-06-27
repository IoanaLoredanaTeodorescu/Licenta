import React, {Component} from 'react';

class Tab extends Component{

    constructor(props){
    	super(props);
        this.func = this.func.bind(this);
    }

    func(tabClass, id) {
        if(tabClass !== 'tab selected') {
            this.props.callback(id);
        } else {

        }
    }

    render(){
        let tab = this.props.tab;
        let isSelected = this.props.isSelected;

        let {id, name} = tab,
    		tabClass = isSelected ? 'tab selected' : 'tab';



        return (
            <div key={id} className={tabClass} onClick={() => this.func(tabClass, id)}>
                {name || 'Tab'}
            </div>
        );
    }
}

export default Tab;
