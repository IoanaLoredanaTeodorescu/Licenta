import React, { Component } from 'react';
import FirstPage from './components/firstPage/first-page';

class App extends Component {

    constructor() {
        super();
        this.state = {
            logged: false,
            emailLogged: ''
        }
        this.isLogged=this.isLogged.bind(this);
        this.handleSetEmailLogged=this.handleSetEmailLogged.bind(this);
        this.handleSetEmptyEmail=this.handleSetEmptyEmail.bind(this);
    }

    isLogged() {
        this.setState({logged: !this.state.logged});
    }

    handleSetEmailLogged(email) {
        this.setState({emailLogged: email});
    }

    handleSetEmptyEmail(){
        this.setState({emailLogged: ''});
    }

    render () {
        return (
            <FirstPage
                isLogged={this.isLogged}
                logged={this.state.logged}
                setEmailLogged={this.handleSetEmailLogged}
                emailLogged={this.state.emailLogged}
                setEmptyEmail={this.handleSetEmptyEmail}
            />);
    }
}

export default App;
