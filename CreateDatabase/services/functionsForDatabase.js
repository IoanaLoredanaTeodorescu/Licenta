var fs = require('fs');

module.exports={
	parseResponse: function(res){
		fs.writeFileSync('./scripts/insert_datas_into_restaurant.sql', '');
		fs.writeFileSync('./scripts/insert_datas_into_tag.sql', '');
		var obj = JSON.parse(res);
		//console.log(obj.results);
		var restaurants=obj.results;
		for(var i=0;i<restaurants.length;i++){
			var restaurant=restaurants[i];
			var id=restaurant.id;
			var name=restaurant.name;
		//	console.log(name);
			//replaceDiacritics(name.toString());
		//	console.log(name);
			var address=restaurant.formatted_address;
			//console.log(address);
		//	replaceDiacritics(address.toString());
			//console.log(address);
			var lat=restaurant.geometry.location.lat;
			var lng=restaurant.geometry.location.lng;
			var tags=restaurant.types;


			let script_string = fs.readFileSync('./scripts/insert_datas_into_restaurant.sql').toString();
			if(searchIfExists(id, script_string) < 0) {
				var string1='INSERT INTO restaurants(id, name, address, lat, lng) VALUES(\''+id+'\',\''+name+'\',\''+address+'\',\''+lat+'\',\''+lng+'\');\n';
				fs.appendFileSync('./scripts/insert_datas_into_restaurant.sql', string1);
			}

			for(var j=0;j<tags.length;j++){
				var tag=tags[j];
			//	replaceDiacritics(tag.toString());
				var string2='INSERT INTO tags(id, tag) VALUES(\''+id+'\',\''+tag+'\');\n';
				fs.appendFileSync('./scripts/insert_datas_into_tag.sql', string2);
			}
		}
	}
}


var searchIfExists = (stringToSearch, stringWhereToSearch) => {
	return stringWhereToSearch.indexOf(stringToSearch);
}

var replaceDiacritics = (stringWhereToSearch) => {
		if(stringWhereToSearch.indexOf('Ș') > -1) {
			stringWhereToSearch.replace('Ș','kkkk');
		}
		console.log(stringWhereToSearch);
	return stringWhereToSearch;
}
