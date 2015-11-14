
var request = require('request')
var util = require('util');
var yahooFinance = require('yahoo-finance');
var parser = require('xml2json');

require('colors');

var _ = require('lodash');

var SYMBOLS = [
  'AAPL',
  'AMZN',
  'GOOGL',
  'YHOO'
];

// Step 1: insert the api url without ?q=
var url =  'https://query.yahooapis.com/v1/public/yql';
var startDate = '2012-01-01';
var endDate = '2012-01-08';

// Step 2; query the database table use sql and encode the Uri component 
var data = encodeURIComponent('%20env%20%27store%3A%2F%2Fdatatables.org%2Falltableswithkeys%27%3Bselect%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22YHOO%22%2C%22AAPL%22%2C%22GOOG%22%2C%22MSFT%22)&diagnostics=true');
//encodeURIComponent('select * from yahoo.finance.historicaldata where symbol in ("YHOO","AAPL","GOOG","MSFT") and startDate = "' + startDate + '" and endDate = "' + endDate + '"');

// Use the following on the postscript 
// https://cde305-ousbah-2.c9.io/stockmarket?q=show%20tables&diagnostics=true
// https://cde305-ousbah-2.c9.io/stockmarket?q=%20env%20%27store%3A%2F%2Fdatatables.org%2Falltableswithkeys%27%3Bselect%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22YHOO%22%2C%22AAPL%22%2C%22GOOG%22%2C%22MSFT%22)&diagnostics=true

exports.search = function(query, callback) {
  console.log('search success')
  if (typeof query !== 'string' || query.length === 0) {
    callback({code:400, response:{status:'error', message:'missing query (q parameter)'}})
  }
  
 
 // Step 3; take data sql query encoded and insert  it into the query string 
  const query_string = {q: data, maxResults: 40}
  
  // step 4: Pass the query and url string to the server
  request.get({url: url, qs: query_string}, function(err, res, body) {
        
             // Step 5: See what is return it should be data that can be analysed not error messages
             console.log(body.query)
        
        var json = parser.toJson(body); //returns a string containing the JSON structure by default 
     
    if (err) {
      callback({code:500, response:{status:'error', message:'search failed', data:err}})
    }
    
   
    callback({code:200, response:{status:'success', message:body.length+' Stocks found', data:body}})
  })
}