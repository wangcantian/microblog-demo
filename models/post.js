/**
 * 博客
 * Created by paul on 17-1-3.
 */
var mongoose = require('../db').mongoose;
var schema = new mongoose.Schema({
    user : 'string',
    post : 'string'
});

var Post = mongoose.model('Post', schema);
module.exports = Post;

