var MongoClient = require('mongodb').MongoClient;


MongoClient.connect('mongodb://localhost:27017/school', function(err, db){
	if(err) {
		console.log(err);
		db.close();
	}

	console.log('Connected to db');

	var students = db.collection('students');

/*
	db.students.aggregate([
		{ '$unwind': '$scores' },
		{ '$match': { 'scores.type':'homework' } },
		{ '$group': { _id: { id: '$_id' }, minHwScore: { $min: '$scores.score' } } }
	]);
*/

	//aggregate receives something like "trafarets". Data 'flows' through these trafarets and will be available in callback
	//details: http://docs.mongodb.org/manual/reference/operator/aggregation-pipeline/
	students.aggregate([
		{$unwind: '$scores'},
		{$match: {'scores.type' : 'homework'}},
		{$group: {_id: {id: '$_id'}, minHwScore: {$min: '$scores.score'}}},
		{$sort: {'_id.id': 1}}
		], function(err, idsWithMinScore){
			if(err) {
				console.log('ERROR AGGREGATE');
				db.close();
				return;
			}

			idsWithMinScore.forEach(function(element){
				console.log(element["_id"]["id"]);
				console.log(element.minHwScore);

				/*
				db.students.update({name: 'Shmalya'}, {$pull: {scores:{score:5, type: 'homework'}}, {multi: true})
				*/
				
				students.update(
					{_id: element["_id"]["id"]},
					{$pull: {scores: {score: element.minHwScore, type:'homework'}}},
					{multi: true},
					function(err, recordsAffected){
						if(err) {
							console.log('ERROR');
							db.close();
							return;
						}

						console.log(typeof(recordsAffected));
						
					});
			});
		});
});