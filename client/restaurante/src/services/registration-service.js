function signup(fullNameValue, emailValue, passwordValue){
    let body = {fullNameValue, emailValue, passwordValue};

    return fetch('http://localhost:1023/signup', {method: 'POST', body});
}

export default {
    signup
}
