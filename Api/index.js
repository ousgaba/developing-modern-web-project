var restify = require('restify')
const stdin = process.openStdin()
var mongo = require('./mongo.js');

var server = restify.createServer()
server.use(restify.fullResponse())
server.use(restify.queryParser())
server.use(restify.bodyParser())
server.use(restify.authorizationParser())

var request = require('request')

request.get("https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20%3D%20%22goog%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys", function(err, res, body) {
  if (err) {
    console.log("Error")
  }
  console.log(body)
  
 mongo.addList(body);

})


server.get('/stockmarket', function(req, res) {
  console.log('GET /stockmarket')
  const searchTerm = req.query.q
  console.log('q='+searchTerm)
  

/* customer.search(searchTerm, function(data) {
    console.log(data)
    res.setHeader('content-type', 'application/json');
    res.send(data.code, data.response);
    res.end();
  }) */
})

var port = process.env.PORT || 8080;
server.listen(port, function (err) {
  if (err) {
      console.error(err);
  } else {
    console.log('App is ready at : ' + port)}
  })

stdin.on('data', function(chunk) {
  console.log(typeof chunk)
  var text = chunk.toString().trim()
  console.log(typeof text)
  
  if (text.indexOf('add ') === 0) {
    var space = text.indexOf(' ')
    var item = text.substring(space+1).trim()
    console.log('adding "'+item+'"')
    /* notice the use of 'arrow function' syntax to define the anonymous function parameter. */
    mongo.addList(item, data => {
        console.log('returned: '+data)
    })
  }
  
  if (text.indexOf('get ') === 0) {
    var space = text.indexOf(' ')
    var item = text.substring(space+1).trim()
    console.log('finding: ID "'+item+'"')
    mongo.getById(item, data => {
        console.log(data)
    })
  }
  
  if (text.indexOf('list') === 0) {
    mongo.getAll( data => {
        console.log(data)
    })
  }
  
  if (text.indexOf('clear') === 0) {
    mongo.clear( data => {
        console.log(data)
    })
  }
})
