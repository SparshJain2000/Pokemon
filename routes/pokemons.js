var express = require("express"),
    router = express.Router(),
    middleware = require("../middleware"),
    Comment = require("../models/comments"),
    Pokemon = require("../models/pokemon");

//INDEX route
router.get("/", function(req, res) {
    // console.log(req.user);
    Pokemon.find({}, function(err, allpokemon) {
        if (err) {
            req.flash("error", error.message);
            console.log("ERROR !!");
        } else {
            res.render("pokemons", {
                pokemon: allpokemon,
                currentUser: req.user
            });
        }
    });
});

//CREATE route
router.post("/", middleware.isLoggedIn, function(req, res) {
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var obj = {
        name: req.body.name,
        img: req.body.url,
        description: req.body.desc,
        author: author
    };

    Pokemon.create(obj, function(err, newPok) {
        if (err) {
            req.flash("error", error.message);
            console.log("Error !!");
        } else {
            res.redirect("/pokemon");
        }
    });
});

//NEW
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("new", { currentUser: req.user });
});

//SHOW
router.get("/:id", function(req, res) {
    Pokemon.findById(req.params.id)
        .populate("comments")
        .exec(function(err, foundPok) {
            if (err) {
                console.log("ERROR !!!" + err);
            } else {
                res.render("show", {
                    pokemon: foundPok,
                    currentUser: req.user
                });
            }
        });
});

//EDIT ROUTES
//Edit Pokemon form
router.get("/:id/edit", middleware.checkPokemonOwnership, function(req, res) {
    Pokemon.findById(req.params.id, function(error, foundPokemon) {
        if (error) {
            console.log(error);
            req.flash("error", error.message);
            req.redirect("back");
        }
        res.render("edit", { pokemon: foundPokemon, currentUser: req.user });
    });
});
//Edit route logic
router.put("/:id", function(req, res) {
    //find and update pokemon and redirect show page
    Pokemon.findByIdAndUpdate(req.params.id, req.body.pok, function(
        err,
        updatedPok
    ) {
        if (err) {
            res.redirect("/");
        } else {
            res.redirect("/pokemon/" + req.params.id);
        }
    });
});

//DELETE ROUTE
router.delete("/:id", function(req, res) {
    Pokemon.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            req.flash("error", error.message);
            res.redirect("/pokemon");
        } else res.redirect("/pokemon");
    });
});

module.exports = router;
