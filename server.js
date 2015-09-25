//var app = require('express')(); // Express App include

var express = require('express');
var app = express();

var http = require('http').Server(app); // http server
var mysql = require('mysql'); // Mysql include
var bodyParser = require("body-parser"); // Body parser for fetch posted data
var connection = mysql.createConnection({ // Mysql Connection
    host : 'localhost',
    user : 'shop_app',
    password : 'shop_app',
    database : 'shop_app',
});

//
//app.express.static('frontend');
app.use(express.static('frontend'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // Body parser use JSON data

http.listen(8080,function(){
	console.log("HTTP Server is up, connected, and listening on port 8080, let's role fools!");
});

console.log(connection.config.database)
connection.connect(function(err, connection){
//console.log('Connecting to the ' + connection.config.database)
  if(err){
    console.log('Error connecting to Db, error is : ' + err );
    console.log('Killing application, because without a db I am useless.')
    process.exit();
    return;
  }
  console.log('Connection to the database has been established');
});

//This is the API for CRUD operations against the DB. Currently able to do the following
//app.get = Get all volunteers
//app.post = insert new volunteer
//app.put = updates a volunteer
app.get('/api/users',function(req,res){
    var data = {
        "error":1,
        "users":""
    };
    
    connection.query("SELECT * from volunteers",function(err, rows, fields){
        if(rows.length != 0){
            data["error"] = 0;
            data["users"] = rows;
            res.json(data);
        }else{
            data["users"] = 'No users found..';
            res.json(data);
        }
    });
});

app.post('/api/users',function(req,res){
    var fname = req.headers.fname;
    var lname = req.headers.lname;
	var phone = req.headers.phone;
    var address = req.headers.address;
	var zip = req.headers.zip;
    var city = req.headers.city;
    var email = req.headers.email;
    var data = {
        "error":1,
        "users":""
    };
    console.log(req);
	console.log(req.headers)
    if(!!fname && !!lname && !!phone && !!address && !!zip && !!city && !!email){
        connection.query("INSERT INTO volunteers (fname,lname,phone,address,zip,city,email) VALUES(?,?,?,?,?,?,?)",[fname,lname,phone,address,zip,city,email],function(err, rows, fields){
            if(!!err){
                data["users"] = "Error Adding data" + err;
				console.log("There was an error with the SQL to add a user, here's the info." + err + " and here is the payload " + req.headers + "")
            }else{
                data["error"] = 0;
                data["users"] = "Book Added Successfully";
            }
            res.json(data);
        });
    }else{
        data["users"] = "Please provide all required data (i.e : Bookname, Authorname, Price)";
        res.json(data);
    }
});

app.put('/api/users',function(req,res){
    var id = req.headers.id;
    var fname = req.headers.fname;
    var lname = req.headers.lname;
	var phone = req.headers.phone;
    var address = req.headers.address;
	var zip = req.headers.zip;
    var city = req.headers.city;
    var email = req.headers.email;
    var data = {
        "error":1,
        "users":""
    };
	//console.log(req.headers)
    if(!!fname && !!lname && !!phone && !!address && !!zip && !!city && !!email && !!id){
        connection.query("Update volunteers set fname=?, lname=?,phone=?,address=?,zip=?,city=?,email=? where idvolunteers =?",[fname,lname,phone,address,zip,city,email,id],function(err, rows, fields, result){
            if(!!err){
                data["users"] = "Error Updating data" + err;
				console.log("There was an error with the SQL to update a user, here's the info." + err + " and here is the payload " + req.headers + "")
            }else{
                data["error"] = 0;
                data["users"] = " " + fname + " " + lname + "'s profile has been updated without error.";
                console.log(rows)
            }
            res.json(data);
        });
    }else{
        data["users"] = "Please provide all required data (i.e : First Name, Last Name, Phone Number, Address, Zip, City, email)";
        res.json(data);
    }
});


//END of the API


//return something on the root of the server request
app.get('/',function(req,res){
	res.sendFile(__dirname + '/frontend/index.html'); //sending our html page
});
