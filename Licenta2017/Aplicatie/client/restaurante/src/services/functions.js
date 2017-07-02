export function getSizeOfObject(object) {
    var size = 0;
    for(var i in object) {
        if(object.hasOwnProperty(i)) {
            size++;
        }
    }
	return size;
}
