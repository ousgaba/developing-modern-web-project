var mongoose = require("mongoose");
var Schema   = mongoose.Schema;

var ArticleSchema = mongoose.Schema({
    title: String,
    slug: String,
    content: String,
    author: String,
});
mongoose.model('Article', ArticleSchema);