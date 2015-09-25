var os         = require('os'),
    fs         = require('fs'),
    util       = require('util'),
    expect     = require('expect'),
    async      = require('async'),
    _          = require('underscore'),
    config     = require('../config'),
    QuickBooks = require('../index'),
    qbo        = new QuickBooks(config);

describe('Customer', function() {

  this.timeout(30000);

  it.skip('find customers', function (done) {
    qbo.findCustomers(function(_, customers) {      
      customers.QueryResponse.Customer.forEach(function(c) {
        console.log(`Id: ${c.Id} DisplayName: ${c.DisplayName}`);
      })
    }) 
  });

  it('should create a new customer', function (done) {
    var req = {
      "DisplayName": "Test Company"
    }
    qbo.createCustomer(req, function(err, customer) {
      expect(err).toBe(null)
      expect(customer.Fault).toBe(undefined)
      done()
    })
  })

  it.only('should delete a newly created customer', function (done) {
    qbo._delete(qbo, 'customer', 63, function(err, customer) {
      expect(err).toBe(null)
      console.log(customer);
      expect(customer.Fault).toBe(undefined)
      done()
    })
  })

})
