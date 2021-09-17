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


var cors = require("cors");
var app = express();

app.options('*', cors())
// set the view engine to ejs

app.set('view engine', 'ejs');

app.use(session({
    secret: 'super secret secret key for hash',
    resave: false,
    saveUninitialized: false
}));
app.use(bodyParser.urlencoded({extended : true}));   / ///////DELETE

app.use(bodyParser.json());
///app.use(cors);


app.listen(5000, function () {
    // tslint:disable-next-line:no-console
    console.log("server started at http://localhost: -> " + 5000);
});


// index page
app.get('/check',cors(), function(req, res) {
    ///console.log("server auth function called")
    ///res.send(message:"api is running", others:"dfddfgsdfgd");
    res.json({ username: 'Flavio' })
});

app.post('/pay',cors(),async function(req, response) {
   // console.log(req.body)
    //response.send("results");
    ///response.json({ username: 'Flavhhhhhhhio' })
    var id =req.body.data.id
    console.log(id)
    var created=req.body.data.created
    console.log(created)
    var client_ip=req.body.data.client_ip
    console.log(client_ip)
    var card_id=req.body.data.card.id
    console.log(card_id)
    var email=req.body.data.email
  console.log(email)

   await connection.query('INSERT INTO payment.payments (id, created, client_ip, card_id, email) VALUES (?, ?, ?, ?, ?);',[id, created, client_ip, card_id, email], function(error, results, fields)
   {
        if (error) {
            ///response.send(results);
            response.json({ status: 'failed', error:error })
        }else{
            //response.send(error);

            response.json({ status: 'success ok', data:results })
        }
    })

});


app.get('/getPaymentDetails',cors(),async function(req, res) {
    connection.query('SELECT * FROM payment.payments where email = ? ;', [req.query.email], function(error, details, fields)
		{
			if (details.length > 0){
                res.json({ status:"success ok", paymentDetails: details })
            }
			else{
                res.json({ status:"failed", error: error })
			}
        })
})

