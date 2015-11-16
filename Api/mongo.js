var mongoose = require('mongoose')
    , fs = require('fs'),
    Schema = mongoose.Schema;
    
var stock = require('./index.js')
    
var database = 'data'
const server = 'mongodb://'+process.env.IP+'/'+database;
console.log(server)
mongoose.connect(server, {server:{auto_reconnect:true}});
var db = mongoose.connection;

        
const StockSchema = new mongoose.Schema({
    symbol: String,
    currency: String,
    bid: String,
    name : String,
    oneyear : String,
    open : String,
    daylow : String,
    dayhigh : String,
    yearlow : String,
    yearhigh : String

})
const Stock = mongoose.model('Stock',StockSchema);


/* HERE*/

exports.addList = (data, callback) => {
  // convert string to json format
  var json = JSON.parse(data);
  
  console.log('addList')
  /* here we extract the data from the supplied string. This would be more concise if NodeJS supported the 'destructuring assignment'. */
  const step1 = data.split(':')
 // console.log(json)
  const symbolExt = json.query.results.quote.symbol;
  const currencyExt = json.query.results.quote.Currency;
  const bidExt = json.query.results.quote.Bid;
  const name = json.query.results.quote.Name;
  const oneyear = json.query.results.quote.OneyrTargetPrice;
  const open = json.query.results.quote.Open;
  const daylow = json.query.results.quote.DaysLow;
  const dayhigh = json.query.results.quote.DaysHigh;
  const yearlow = json.query.results.quote.YearLow;
  const yearhigh = json.query.results.quote.YearHigh;
       
  
  console.log(symbolExt +' - '+ currencyExt+' - '+bidExt+' - '+name+' - '+oneyear+' - '+open+' - '+daylow+' - '+dayhigh+' - '+yearlow+' - '+yearhigh)
 // console.log(step1)
  /* here we use the 'map' function to loop through the array and apply the trim() function. There are several useful functions that are part of the 'array prototype' such as map(), filter(), reduce(). */
//  const items = step1[1].split(',').map(function(item) {
//    return item.trim()
//  })
  /* now we have extracted the data we can use it to create a new 'List' object that adopts the correct schema. */
  const newstock = new Stock({
    symbol: symbolExt,
    currency: currencyExt,
    bid: bidExt,    
    name : name,
    oneyear : oneyear,
    open : open,       
    daylow : daylow,
    dayhigh : dayhigh,
    yearlow : yearlow,
    yearhigh : yearhigh

    
})


  newstock.save(function (err, newstock)  {
    if (err) {
      callback('error: '+err)
    }
    callback('added: '+newstock)
  });
  
   newstock.save(function (err, newstock) {
  if (err) return console.error(err);
  
});
  
  
}

exports.getAll = callback => {
  /* the List object contains several useful properties. The 'find' property contains a function to search the MongoDB document collection. */
stock.find( (err, data) => {
    if (err) {
      callback('error: '+err)
    }
    const list = data.map( item => {
      return {id: item._id, name: item.name}
    })
    callback(list)
  })
}

exports.getById = (id, callback) => {
  /* the 'find' property function can take a second 'filter' parameter. */
  Stock.find({_id: id}, (err, data) => {
    if (err) {
      callback('error: '+err)
    }
    callback(data)
  })
}

exports.clear = (callback) => {
  /* the 'remove()' function removes any document matching the supplied criteria. */
  stock.remove({}, err => {
    if (err) {
      callback('error: '+err)
    }
    callback('lists removed')
  })
}