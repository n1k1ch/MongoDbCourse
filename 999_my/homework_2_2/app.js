var MongoClient = require('mongodb').MongoClient;


MongoClient.connect('mongodb://localhost:27017/weather', function(err, db){
	//console.log('Connected to ' + db);


	var answers = {};

	var cursor = db.collection('data').find({}, {State:1, Temperature: 1}, {
		sort: [['State', 'asc'], ["Temperature", 'desc']]
	});
	//cursor.sort([["State", -1],["Temperature", 1]]);
	//cursor.sort('State', 1);
	//cursor.limit(2);

/*
	cursor.toArray(function(err, data){
		if(err) {
			console.log(err);
			db.close();
		}

		data.forEach(function(one){
			console.log(one);
		});

		db.close();
	});
*/
	cursor.toArray(function(err, data){
		if(err) {
			console.log(err);
			db.close();
		}

		if(data == null) {
			return db.close();
		}

		//console.log(data);

		data.forEach(function(elem, index){
			var stateName = elem.State;
			var temperature = elem.Temperature;

			if(answers[stateName] === undefined) {
				answers[stateName] = elem._id;
			}
		});

		console.dir(answers);

		for(var elem in answers) {
			/*
			db.collection('data').find({_id: answers[elem]}).toArray(function(err, toUpdate){
				if(err) {
					console.log(err);
					return db.close();
				}
				console.log(toUpdate);
			});
			*/

			db.collection('data').update({_id: answers[elem]}, {'$set' : {'month_high': true}});
		}
	});


	/*
	var stateNames;

	db.collection('data').distinct("State", {}, {sort: "State"}, function(err, names) {
		if(err) {
			console.log(err);
			db.close();
		}

		stateNames = names.sort();

		stateNames.forEach(function(state){
			db.collection('data').find({State: state}).sort({"Temperature" : 1}).limit(1).toArray(function(err, doc){
				if(err) {
					console.log(err);
				} else {
					console.log(doc);
				}
			});
		});

		//db.close();
	});
*/


	/*
	var query = {};

	var cursor = db.collection('data').find(query);
	cursor.sort({State:1, Temperature: -1});

	cursor.toArray(function(err, collection){
		if(err) {
			console.log(err);
			db.close();
		}

		console.dir(collection);
		db.close();
	});
	*/

});