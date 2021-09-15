
// comment here
var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');



var connection = mysql.createConnection({
    host     : 'aws-cos221.c5zbzrr9w4bb.us-east-2.rds.amazonaws.com',
    user     : 'admin',
    password : 'cos221_prac3_pw',
    database : 'elections'
});
// This is test comment
//this is my comment
var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(session({
    secret: 'super secret secret key for hash',
    resave: false,
    saveUninitialized: false
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.listen(5000, function () {
    // tslint:disable-next-line:no-console
    console.log("server started at http://localhost:" + 5000);
});


// index page
app.get('/', function(req, res) {
    res.render('pages/login');
});




app.post('/auth', function(request, response) {
    connection.query('SELECT * FROM payment', function(error, results, fields) {
        if (results.length > 0) {
            response.send(results);
        }else{
            response.send(error);
        }
    })


   /* var firstname = request.body.firstname;
    var surname = request.body.surname;
    var idNumber = request.body.idnumber;
    var password = request.body.password;

    if (firstname && password) {
        connection.query('SELECT * FROM voter WHERE id = ? AND firstname = ? AND surname = ? AND password = ?', [idNumber, firstname, surname, password], function(error, results, fields) {
            if (results.length > 0) {
                request.session.loggedin = true;
                request.session.userID = idNumber;
                response.redirect('/voterMain');
            } else {
                response.send('Incorrect firstname and/or Password!');
            }
            response.end();
        });
    } else {
        response.send('Please enter firstname and Password!');
        response.end();
    }*/
});


