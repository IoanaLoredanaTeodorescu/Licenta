export function isValidInput(input) {
	return input.length > 0;
}

export function isLengthAtLeastNumber(input,number) {
	return input.length >= number;
}

export function isFirstCharLetter(input) {
	let regex = /[a-zA-Z]/g;
	return input.split("")[0].match(regex) !== null;
}

export function isAlphanumeric(input) {
	let k = 0;
	let regex = /[a-zA-Z0-9]/g;
	let inputArray = input.split("");
	for(var i = 0; i < inputArray.length; i++){
		if(inputArray[i].match(regex) !== null){
			k++;
		}
	}
	return k === inputArray.length;
}

export function areEqual(input,stateInput) {
	return input === stateInput;
}

export function isEmail(input) {
	let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g;
	return input.match(regex);
}

export function containLettersSpacesOnly(input) {
	var regex = /^[a-zA-Z\s]*$/g;
	return input.match(regex);
}
