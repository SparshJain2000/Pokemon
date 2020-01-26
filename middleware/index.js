var Pokemon = require("../models/pokemon"),
    Comment = require("../models/comments"),
    User = require("../models/user");

var middlewareObj = {}
middlewareObj.checkCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        //Is Authorized
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err) {
                req.flash('error', 'You need to be logged in');
                res.redirect("back");
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash('error', 'Permission denied !');
                    res.redirect("back");
                }
            }
        })
    } else {
        req.flash('error', 'You need to be logged in');
        res.redirect("back");
    };
}

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'You need to be logged in');
    res.redirect("/login");
}

middlewareObj.checkPokemonOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        //Is Authorized
        Pokemon.findById(req.params.id, function(err, foundPokemon) {
            if (err) {
                req.flash('error', 'Not Found !!!');
                res.redirect("back");
            } else {
                if (foundPokemon.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash('error', "You can't do that");
                    res.redirect("back");
                }
            }
        })
    } else {
        req.flash('error', 'You need to be logged in');
        res.redirect("back");
    };
}
module.exports = middlewareObj;