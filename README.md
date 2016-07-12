```html
<div class="col-xs-6">
	<!-- <button type="button" class="btn btn-primary">Buy Women's</button> -->
	<form action="/charge" method="POST">
	  <script
	    src="https://checkout.stripe.com/checkout.js" class="stripe-button"
	    data-key="pk_test_6pRNASCoBOKtIshFeQd4XMUh"
	    data-amount="<%= price %>"
	    data-currency="<%= currency %>"
	    data-name="Stripe Shop Demo"
	    data-description="Women's T-shirt"
	    data-image="/thumb-womens.png"
	    data-locale="auto"
	    data-panel-label="Buy Women's"
	    data-label="Buy Women's">
	  </script>
	</form>
	</div>
	<div class="col-xs-6">
	<!-- <button type="button" class="btn btn-primary">Buy Men's</button> -->
	<form action="/charge" method="POST">
	  <script
	    src="https://checkout.stripe.com/checkout.js" class="stripe-button"
	    data-key="pk_test_6pRNASCoBOKtIshFeQd4XMUh"
	    data-amount="<%= price %>"
	    data-currency="<%= currency %>"
	    data-name="Stripe Shop Demo"
	    data-description="Men's T-shirt"
	    data-image="/thumb-mens.png"
	    data-locale="auto"
	    data-panel-label="Buy Men's"
	    data-label="Buy Men's">
	  </script>
	</form>
	</div>
```

```js
// Setup Stripe
var stripe = require("stripe")("sk_test_BQokikJOvBiI2HlWgH4olfQ2");
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
			console.log('Error: ', err);
			res.render('sorry', {
				message: err.message
			});
		}
	);
});
```
