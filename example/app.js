var http       = require('http'),
    port       = process.env.PORT || 3000,
    request    = require('request'),
    qs         = require('querystring'),
    util       = require('util'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    cookieSession    = require('cookie-session'),
    express    = require('express'),
    app        = express(),
    QuickBooks = require('../index')


// Generic Express config
app.set('port', port)
app.set('views', 'views')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser('brad'))
//app.use(session({resave: false, saveUninitialized: false, secret: 'smith'}));
app.use(cookieSession({name: 'session', keys: ['key1']}))

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'))
})

// INSERT YOUR CONSUMER_KEY AND CONSUMER_SECRET HERE

var consumerKey    = process.env.MINIMULCASTS_CONSUMER_KEY,
    consumerSecret = process.env.MINIMULCASTS_CONSUMER_SECRET

app.get('/start', function(req, res) {
  res.render('intuit.ejs', {locals: {port:port, appCenter: QuickBooks.APP_CENTER_BASE}})
})

app.get('/customer/:id', function (req, res) {
  console.log(req.session);
  var qbo = getQbo(req.session.qbo);
  qbo.getCustomer(req.params.id, function(err, customer) {
    console.log(customer);
    res.render('customer.ejs', { locals: { customer: customer }})
  })
})

app.get('/requestToken', function(req, res) {
  var postBody = {
    url: QuickBooks.REQUEST_TOKEN_URL,
    oauth: {
      callback:        'http://localhost:' + port + '/callback/',
      consumer_key:    consumerKey,
      consumer_secret: consumerSecret
    }
  }
  request.post(postBody, function (e, r, data) {
    var requestToken = qs.parse(data)
    req.session.oauth_token_secret = requestToken.oauth_token_secret
    console.log(requestToken)
    res.redirect(QuickBooks.APP_CENTER_URL + requestToken.oauth_token)
  })
})

app.get('/callback', function(req, res) {
  var postBody = {
    url: QuickBooks.ACCESS_TOKEN_URL,
    oauth: {
      consumer_key:    consumerKey,
      consumer_secret: consumerSecret,
      token:           req.query.oauth_token,
      token_secret:    req.session.oauth_token_secret,
      verifier:        req.query.oauth_verifier,
      realmId:         req.query.realmId
    }
  }
  request.post(postBody, function (e, r, data) {
    var accessToken = qs.parse(data)
    console.log(accessToken)
    console.log(postBody.oauth.realmId)
    req.session.qbo = {
      token: accessToken.oauth_token,
      secret: accessToken.oauth_token_secret,
      companyid: postBody.oauth.realmId
    };
    qbo = getQbo(req.session.qbo);
    // save the access token somewhere on behalf of the logged in user

    // test out account access
    qbo.findAccounts(function(_, accounts) {
      accounts.QueryResponse.Account.forEach(function(account) {
        console.log(account.Name)
      })
    })
    res.send('<!DOCTYPE html><html lang="en"><head></head><body><script>window.opener.location.reload(); window.close();</script></body></html>')
  })
})

var getQbo = function (args) {
  return new QuickBooks(consumerKey,
                       consumerSecret,
                       args.token,
                       args.secret,
                       args.companyid,
                       true, // use the Sandbox
                       true); // turn debugging on
  
};

