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
        this.setState({logged: !this.state.logged});
    }

    render () {
        console.log(this.state)
        return (<FirstPage isLogged={this.isLogged} logged={this.state.logged}/>);
    }
}

export default App;
