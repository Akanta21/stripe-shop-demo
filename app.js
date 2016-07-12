// Setup Express
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();
app.set('port', (process.env.PORT || 3000))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Setup Stripe
var stripe = require("stripe")(process.env.SECRET_KEY);
var T_SHIRT_PRICE_CENTS = 999
var T_SHIRT_PRICE_CURRENCY = 'sgd'

// Routes
app.get('/', function (req, res) {
  res.render('index', { 
  	price: T_SHIRT_PRICE_CENTS,
  	currency: T_SHIRT_PRICE_CURRENCY 
  });
});

app.get('/thanks', function (req, res) {
  res.render('thanks');
});

// Stripe Route
app.post('/charge', function (req, res) {
  var stripeToken = req.body.stripeToken;
  var stripeEmail = req.body.stripeEmail;

	stripe.customers.create({
		source: stripeToken,
		description: stripeEmail
	}).then(
		function(customer) {
			return stripe.charges.create({
		    amount: T_SHIRT_PRICE_CENTS,
		    currency: T_SHIRT_PRICE_CURRENCY,
		    customer: customer.id
		  });
		}
	).then(
	  function(charge) {
			console.log('Save to DB: ', charge.id, charge.customer);
			res.redirect('/thanks');
		},
		function(err) {
			console.log('There was an error: ', err);
			res.render('sorry', {
				message: err.message
			});
		}
	);
});

// Run
app.listen(app.get('port'), function() {
  console.log('Stripe Shop Demo app is running on port', app.get('port'));
});