
/**
 * 用户数据模型
 * Created by paul on 17-1-2.
 */
var mongoose = require('../db').mongoose;
var schema = new mongoose.Schema({
    name : 'string',
    password : 'string'
});
var User = mongoose.model('User', schema);

module.exports = User;
