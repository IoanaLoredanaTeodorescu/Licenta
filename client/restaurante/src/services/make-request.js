import RegistrationService from './registration-service';

async function receiveResponse({fullNameValue, emailValue, passwordValue}) {
    return RegistrationService.signup(fullNameValue, emailValue, passwordValue)
        .then(response => {
            if(response.ok /*|| response.status === 401*/) {
                //console.log(response);
                //console.log(response);
                return response;//.json();
            }
            throw new Error('Eroare neașteptată!');
        });
        /*.then(rjson => {
            console.log(rjson.message);
        });*/
}

export default {
    receiveResponse
}
