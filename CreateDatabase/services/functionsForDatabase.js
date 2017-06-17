var fs = require('fs');
var id = null;

var mysql = require('mysql');

function connectionEnd(conn, id) {
	conn.end((err) => {
		if(err) {
			console.log('Error disconnecting from database! \nExecution stopped! \n' + 'Error message: ' + err.message);
			res.json({typeError: 'DBdisconnect', text: 'Error disconnecting from database! \nExecution stopped! \n' + 'Error message: ' + err.message});
		}
		console.log('Connection with id: ' + id + ' disconected!');
	});
}
module.exports={
	parseResponse: function(res){
		fs.writeFileSync('./scripts/insert_datas_into_restaurant.sql', '');
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
				var string1='INSERT INTO restaurants(id, name, address, lat, lng, tags, description) VALUES(\"'+id+'\",\"'+name+'\",\"'+address+'\",\"'+lat+'\",\"'+lng+'\",\"';
				//+tags+'\');\n'
				var str = '';
				for(var j=0;j<tags.length;j++){
					var tag=tags[j];
				//	replaceDiacritics(tag.toString());
					str += tag + ",";
				}
				string1 += str.slice(0, -1) + '\",\"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheet\");\n';

				fs.appendFileSync('./scripts/insert_datas_into_restaurant.sql', string1);
			}
		}
	},

	createTableForEachRestaurant: () => {
		var connection = mysql.createConnection({
										  	host: "localhost",
										 	user: "root",
										 	password: "",
										  	database: "restaurants",
										  	debug: false,
    										multipleStatements: true
										});
		connection.connect((err) => {
			if(err) {
				console.log('Error connecting to database! \nExecution stopped! \n' + 'Error message: ' + err.message);
				process.exit();
			}
			id = connection.threadId;
			console.log('Connection established!\nConnected with id: ' + id);
		});

		connection.query('SELECT id FROM restaurants', (err, result) => {
			var results = null;
		    if(err) {
				console.log('Error searching in database! \nExecution stopped! \n' + 'Error message: ' + err.message);
				res.json({typeError: 'DBselect', text: 'Error searching in database! \nExecution stopped! \n' + 'Error message: ' + err.message});
				connectionEnd(connection, id);
		    } else {
				fs.writeFileSync('./scripts/create_restaurants_tables.sql', '');
				for(var j = 0; j < result.length; j++){
					console.log(result[j].id);
					var name = result[j].id;
					var script = 'CREATE OR REPLACE TABLE idrestaurant_' + name + ' (user VARCHAR(50), message VARCHAR(500));\n';
					fs.appendFileSync('./scripts/create_restaurants_tables.sql', script);
				}
				connectionEnd(connection, id);
		    }
		});
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
