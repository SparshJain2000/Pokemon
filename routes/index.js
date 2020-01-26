var express = require('express'),
    router = express.Router(),
    middleware = require('../middleware'),
    Pokemon = require("../models/pokemon"),
    Comment = require("../models/comments"),
    User = require("../models/user"),
    passport = require("passport");


//REGISTER ROUTES
//show register
router.get("/register", function(req, res) {
    res.render("register");
})

//handle register logic
router.post("/register", function(req, res) {
    var newUser = new User({ username: req.body.username })
    User.register(newUser, req.body.password, function(error, user) {
        if (error) {
            console.log(error.message);
            req.flash('error', error.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function() {
            req.flash('success', 'Welcome ' + user.username);
            res.redirect("/pokemon");
        })
    });
});

//LOGIN ROUTES
//show login form
router.get("/login", function(req, res) {
    res.render("login");
});

//handle login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: '/pokemon',
    failureRedirect: "/login",

}), function(req, res) {});


//log-out routes
router.get("/logout", function(req, res) {
    req.logout();
    req.flash('success', 'Logged You OUT !');
    res.redirect("back");
})

module.exports = router;