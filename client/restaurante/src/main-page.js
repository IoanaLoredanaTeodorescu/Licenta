import React, { Component } from 'react';
import FirstPage from './components/firstPage/first-page';

class App extends Component {

    constructor() {
        super();
        this.state = {
            logged: false
        }
        this.isLogged=this.isLogged.bind(this);
    }

    isLogged() {
        this.setState({logged: !this.state.logged})
    }

    render () {
        if(this.state.logged === false){
            return (<FirstPage isLogged={this.isLogged}/>);
        } else {
            return (
                <div>
                    <button onClick={this.isLogged}>logout</button>
                </div>
            );
        }
    }
}

export default App;
