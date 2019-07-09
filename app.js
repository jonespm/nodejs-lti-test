/*jshint sub:true*/
var https = require('http');
var fs = require('fs');
var express = require('express');
var app = express();
var lti = require('ims-lti');
var _ = require('lodash');
var bodyParser  = require('body-parser');
  
var ltiKey = "mykeyagain";
var ltiSecret = "mysagain";

app.engine('pug', require('pug').__express);

app.use(express.bodyParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine', 'pug');

app.post('/launch_lti', function(req, res, next){
 
  req.body = _.omit(req.body, '__proto__');
  	if (req.body['oauth_consumer_key']===ltiKey){
        //Adding encrypted
        req.connection.encrypted = true;
  		var provider = new lti.Provider(ltiKey, ltiSecret);
        
  	   //Check is the Oauth  is valid.
  			provider.valid_request(req, function (err, isValid){
  				if (err) {
			      console.log('Error in LTI Launch:' + err);
			      res.status(403).send(err);
			      
  				}
  				else {
			      if (!isValid) {
			        console.log('\nError: Invalid LTI launch.');
			        res.status(500).send({ error: "Invalid LTI launch" });
			         } 
			      else {
		        	  //User is Auth so pass back when ever we need.
			    	  res.render('start', { title: 'LTI SETTINGS', currentTime: Math.round(Date.now() / 1000), courseID: req.body['context_id'], userID: req.body['user_id'], userRole: req.body['roles'], fulllog: JSON.stringify(req.body) });
			}}
	   });
	}
  else {
	  console.log('LTI KEY NOT MATCHED:');
	  res.status(403).send({ error: "LTI KEY NOT MATCHED" });	  
  }

});

//Setup the http server
var server = https.createServer(app).listen(process.env.PORT || 5000, function(){
  console.log("https server started");
});



