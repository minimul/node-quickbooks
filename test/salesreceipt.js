var os         = require('os'),
    fs         = require('fs'),
    util       = require('util'),
    expect     = require('expect'),
    async      = require('async'),
    _          = require('underscore'),
    config     = require('../config'),
    QuickBooks = require('../index'),
    qbo        = new QuickBooks(config);

describe('SalesReceipt', function() {

  this.timeout(30000);

  it.skip('find sandbox items', function (done) {
    qbo.findItems(function(_, items) {      
      items.QueryResponse.Item.forEach(function(item) {
        console.log("id:" + item.Id + " name:" + item.Name + " type:" + item.Type)      
      })
    }) 
  });

  it('should create a new SalesReceipt', function (done) {
    var sr = {
      "Line": [{
        "Id": "1",
        "LineNum": 1,
        "Amount": 35.0,
        "DetailType": "SalesItemLineDetail",
        "SalesItemLineDetail": {
          "ItemRef": {
            "value": "6",
            "name": "10 Pack Group X Classes"
          },
          "UnitPrice": 35,
          "Qty": 1,
          "TaxCodeRef": {
            "value": "NON"
          }
        }
      }]
    }
    qbo.createSalesReceipt(sr, function(err, salesReceipt) {
      expect(err).toBe(null)
      expect(salesReceipt.Fault).toBe(undefined)
      done()
    })
  })

})
