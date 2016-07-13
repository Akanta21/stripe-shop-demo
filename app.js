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
var MEN_PRICE_CENTS = 999
var MEN_PRICE_CURRENCY = 'sgd'
var WOMEN_PRICE_CENTS = 4999
var WOMEN_PRICE_CURRENCY = 'hkd'

// Routes
app.get('/', function (req, res) {
  res.render('index', { 
  	menPrice: MEN_PRICE_CENTS,
  	menCurrency: MEN_PRICE_CURRENCY,
  	womenPrice: WOMEN_PRICE_CENTS,
  	womenCurrency: WOMEN_PRICE_CURRENCY, 
  });
});

app.get('/thanks', function (req, res) {
  res.render('thanks');
});

// Stripe Route
app.post('/charge', function (req, res) {
  var stripeToken = req.body.stripeToken;
  var stripeEmail = req.body.stripeEmail;
  var type = req.body.type;

	stripe.customers.create({
		source: stripeToken,
		description: stripeEmail
	}).then(
		function(customer) {
			if (type === 'Men') {
				return stripe.charges.create({
			    amount: MEN_PRICE_CENTS,
			    currency: MEN_PRICE_CURRENCY,
			    customer: customer.id,
			    metadata: {
			    	type: type
			    }
			  });
			} else if (type === 'Women') {
				return stripe.charges.create({
			    amount: WOMEN_PRICE_CENTS,
			    currency: WOMEN_PRICE_CURRENCY,
			    customer: customer.id,
			    metadata: {
			    	type: type
			    }
			  });
			} else {
				throw new Error("Invalid Type");
			}
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