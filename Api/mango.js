var mongoose = require('mongoose')
    , fs = require('fs'),
    Schema = mongoose.Schema;
    
var database = 'data'
const server = 'mongodb://'+process.env.IP+'/'+database;
console.log(server)
mongoose.connect(server, {server:{auto_reconnect:true}});
var db = mongoose.connection;

        
const ArticleSchema = new mongoose.Schema({
    title: String,
    slug: String,
    content: String,
    author: String,
});
const Article = mongoose.model('Article', ArticleSchema);


/* HERE*/

exports.addList = (data, callback) => {
  console.log('addList')
  /* here we extract the data from the supplied string. This would be more concise if NodeJS supported the 'destructuring assignment'. */
  const step1 = data.split(':')
  console.log(step1)
  const name = step1[0]
  /* here we use the 'map' function to loop through the array and apply the trim() function. There are several useful functions that are part of the 'array prototype' such as map(), filter(), reduce(). */
  const items = step1[1].split(',').map(function(item) {
    return item.trim()
  })
  /* now we have extracted the data we can use it to create a new 'List' object that adopts the correct schema. */
  const newArt = new Article({
    title: String,
    slug: String,
    content: String,
    author: String,
})
  newArt.save( (err, data) => {
    if (err) {
      callback('error: '+err)
    }
    callback('added: '+data)
  })
}

exports.getAll = callback => {
  /* the List object contains several useful properties. The 'find' property contains a function to search the MongoDB document collection. */
  Article.find( (err, data) => {
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
  Article.find({_id: id}, (err, data) => {
    if (err) {
      callback('error: '+err)
    }
    callback(data)
  })
}

exports.clear = (callback) => {
  /* the 'remove()' function removes any document matching the supplied criteria. */
  Article.remove({}, err => {
    if (err) {
      callback('error: '+err)
    }
    callback('lists removed')
  })
}