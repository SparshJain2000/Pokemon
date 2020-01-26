var express = require('express'),
    middleware = require('../middleware'),
    router = express.Router({ mergeParams: true }),
    Pokemon = require("../models/pokemon"),
    Comment = require("../models/comments");

//CREATE COMMENTS ROUTES
//comments new FORM
router.get("/new", middleware.isLoggedIn, function(req, res) {
    Pokemon.findById(req.params.id, function(err, pokemon) {
        if (err) { console.log(err) } else {
            res.render("comments/new", { pokemon: pokemon, currentUser: req.user })
        }
    })
})

//comments create logic
router.post("/", middleware.isLoggedIn, function(req, res) {
    Pokemon.findById(req.params.id, function(err, pokemon) {
        if (err) console.log(err);
        else {
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    req.flash('error', 'Error creating');
                    console.log(err);
                } else {
                    //add username and id to comment
                    comment.author.username = req.user.username;
                    comment.author.id = req.user._id;
                    comment.save();
                    //save comment
                    pokemon.comments.push(comment);
                    pokemon.save();

                    console.log(comment);
                    req.flash('success', 'Successfully added comment');
                    res.redirect("/pokemon/" + pokemon._id);
                }
            })
        }
    });
});


//UPDATE COMMENT ROUTES
//EDIT comment form
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComm) {
        if (err) {
            console.log(err);
        } else {
            res.render("edit_comment", { pokemon_id: req.params.id, comment: foundComm });
        }
    })
});

//edit logic
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, upCom) {
        if (err) {
            res.redirect('back');
        } else {
            res.redirect("/pokemon/" + req.params.id);
        }
    });
});

//Comment DESTROY route
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    //find by id remove
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if (err) res.redirect('back');
        else {
            req.flash('success', 'Deleted successfully');
            res.redirect('/pokemon/' + req.params.id);
        }
    });
});
//middleware

module.exports = router;