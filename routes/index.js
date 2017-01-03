var express = require('express');
var router = express.Router();

var crypto = require('crypto');
var db = require('../db');
var User = require('../models/user');
var Post = require('../models/post');

/* GET home page. */
router.get('/', function(req, res, next) {
    Post.find({}, function(err, posts) {
        if (err) {
            req.session.message = err.message;
            return res.redirect('/');
        }
        res.render('index', { posts : posts});
    });
});

// 用户进入注册页面
router.get('/reg', isLogin);
router.get('/reg', function(req, res) {
    res.render('reg', { title : "用户注册" });
});

// 用户提交注册
router.post('/reg', isLogin);
router.post('/reg', function(req, res) {
    if (req.body['password'] != req.body['passwordconf']) {
        req.session.error = "两次密码不一致";
        return res.redirect('/reg');
    }

    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');
    var newUser = new User({
        name : req.body.username,
        password : password
    });
    User.findOne({name : newUser.name}, function(err, user) {
        if (user) {
            err = "用户名已经存在";
        }
        if (err) {
            req.session.error = err;
            return res.redirect('/reg');
        }
        newUser.save(function(err) {
           if (err) {
               req.session.error = err.message;
               return res.redirect('/reg');
           }
           req.session.user = newUser;
           req.session.success = "注册成功";
           res.redirect('/');
        });
    });
});

// 用户进入登录界面
router.get('/login', isLogin);
router.get('/login', function(req, res) {
   res.render('login', { title : "用户登录" });
});

// 用户点击登录按钮
router.post('/login', isLogin);
router.post('/login', function(req, res) {
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');
    User.findOne({ name:req.body.username }, function(err, user) {
       if (!user) {
           req.session.error = "用户不存在";
           return res.redirect('/login');
       }
       if (user.password != password) {
           req.session.error = "密码错误";
           return res.redirect('/login');
       }
       req.session.user = user;
       req.session.success = "登录成功";
       res.redirect('/');
    });
});

function isLogin(req, res, next) {
    if (req.session.user) {
        req.session.message = "用户已登录";
        return res.redirect('/');
    }
    next();
}

// 用户退出
router.get('/logout', function(req, res) {
    req.session.user = null;
    res.redirect('/');
});

module.exports = router;
