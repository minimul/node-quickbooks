module.exports = {
  consumerKey:     process.env.MINIMULCASTS_CONSUMER_KEY,
  consumerSecret:  process.env.MINIMULCASTS_CONSUMER_SECRET,
  token:           process.env.OAUTH_TOKEN,
  tokenSecret:     process.env.OAUTH_TOKEN_SECRET,
  realmId:         process.env.REALM_ID,
  useSandbox:      true,
  debug:           true,
  //
  // Set useSandbox to false when moving to production. For info, see the following url:
  // https://developer.intuit.com/v2/blog/2014/10/24/intuit-developer-now-offers-quickbooks-sandboxes
  
  testEmail:       ''  // Use this email address for testing send*Pdf functions
}
