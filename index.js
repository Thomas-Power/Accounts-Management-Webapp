//required modules
var express = require("express");
var path = require("path");
var fs = require('fs');

var mongodb = require('mongodb');
var db_addr = "mongodb://localhost:27017/";
MongoClient  = mongodb.MongoClient;

app = express();

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

//entry point
app.get('/', (req, res) =>{
	res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/app.js', (req, res) =>{ //retrieve angular code
	res.sendFile(path.join(__dirname + '/app.js'));
});

app.get('/Company_List', (req, res) =>{ //retrieves list of clients from database
	console.log("Sending Customer List");
	
	MongoClient.connect(db_addr, function(err, db) {
		dbo = db.db("Bluebell_Dairies");
		console.log("Connected to Database");
		dbo.collection("customers").distinct("name", function(err, result) {
			if (err) throw err;
			console.log("Data Found!");
			db.close();
			res.send(result);
		});
	});
});



app.get('/data/', (req, res) =>{ //retrieves data on individual client
	var customer_name = req.query.company;
	MongoClient.connect(db_addr, function(err, db) {
		var data = {}
		dbo = db.db("Bluebell_Dairies");
		console.log("Connected to Database");
		dbo.collection("customers").findOne({"name":customer_name}, function(err, customer) {
			if (err) throw err;
			console.log("Data Found!");
			data["customer"] = customer;
			dbo.collection("orders").findOne({"customer_no":customer["customer_no"]}, function(err, order) {
				if (err) throw err;
				console.log("Data Found!");
				db.close();
				data["order"] = order;
				res.send(data);
			});
		});
	});
	
});

app.post('/generateInvoices/', (req, res) =>{ //execute python code for invoice generation
	year = req.body.year
	month = req.body.month
	var spawn = require("child_process").spawn;
	var pythonProcess = spawn('python',["./Python/create_invoices.py", year, month]);
	pythonProcess.stdout.on('data', (data) => {
		var textChunk = data.toString('utf8');
		console.log(textChunk)
		res.sendStatus(200)
	});
});


app.post('/updateDatabase/', (req, res) =>{ //execute python code for data scraping
	year = req.body.year
	month = req.body.month
	var spawn = require("child_process").spawn;
	var pythonProcess = spawn('python',["./Python/scrape_all.py", year, month]);
	pythonProcess.stdout.on('data', (data) => {
		var textChunk = data.toString('utf8');
		console.log(textChunk)
		res.sendStatus(200)
	});
});

app.post('/holiday/', (req, res) =>{ //adds holiday to database
	var holiday = {"date":req.body.holiday};
	MongoClient.connect(db_addr, function(err, db) {
		dbo = db.db("Bluebell_Dairies");
		console.log("Connected to Database");
		console.log(holiday + "inserted");
		dbo.collection("holidays").insertOne(holiday, function(err, order) {
		    if (err) throw err;
			console.log(holiday + "inserted");
			db.close();
			res.sendStatus(200)
		});
	});
});

app.get('/holiday', (req, res) =>{ //retrieves list of holiday dates
	console.log("Sending Holiday List");
	
	MongoClient.connect(db_addr, function(err, db) {
		dbo = db.db("Bluebell_Dairies");
		console.log("Connected to Database");
		dbo.collection("holidays").distinct("date", function(err, result) {
			if (err) throw err;
			console.log("Data Found!");
			db.close();
			res.send(result);
		});
	});
});

app.delete('/holiday', (req, res) =>{ //removes holiday from database
	var holiday = {"date":req.body.holiday};
	MongoClient.connect(db_addr, function(err, db) {
		dbo = db.db("Bluebell_Dairies");
		console.log("Connected to Database");
		console.log(holiday + "deleted");
		dbo.collection("holidays").deleteOne(holiday, function(err, order) {
		    if (err) throw err;
			console.log(holiday + "deleted");
			db.close();
			res.sendStatus(200)
		});
	});
});


app.listen(8080);
console.log("Listening on port 8080");