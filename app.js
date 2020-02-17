var express = require("express"),
    app = express(),
    methodOverride = require('method-override'),
    mongoose = require("mongoose"),
    flash = require('connect-flash'),
    bodyParser = require("body-parser"),
    Pokemon = require("./models/pokemon.js"),
    Comment = require("./models/comments"),
    passport = require('passport'),
    LocalStratergy = require('passport-local'),
    User = require('./models/user')

//Requiring ROUTES
var pokemonRoutes = require('./routes/pokemons'),
    commentRoutes = require('./routes/comments'),
    indexRoutes = require('./routes/index');

//Setting mongoose (Mongo DB)

mongoose.connect("mongodb://localhost:27017/pokemon", { useNewUrlParser: true, useUnifiedTopology: true });

//linking external files
app.use(express.static(__dirname + "/public"));
//for flash messages
app.use(flash());
//for post routes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

//setting view engine as ejs
app.set("view engine", "ejs");
app.use(require("express-session")({
    secret: "Jain",
    resave: false,
    saveUninitialized: false
}));
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.err = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//Passport initialization
//==============================================================

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//==============================================================

app.get("/", function(req, res) {
    res.redirect("/pokemon");
});

app.use("/", indexRoutes);
app.use("/pokemon", pokemonRoutes);
app.use("/pokemon/:id/comments", commentRoutes);


//                  Sample Pokemons
//===============================================================
// Pokemon.create({ "name": "charizard", "img": "https://giantbomb1.cbsistatic.com/uploads/scale_small/13/135472/1891763-006charizard.png" }, );
// var pokemon = [
//     { "name": "pikachu", "img": "https://giantbomb1.cbsistatic.com/uploads/scale_small/0/6087/2437349-pikachu.png" },
//     { "name": "charizard", "img": "https://giantbomb1.cbsistatic.com/uploads/scale_small/13/135472/1891763-006charizard.png" },
//     { "name": "snorlax", "img": "https://giantbomb1.cbsistatic.com/uploads/scale_small/0/4986/406919-143snorlax.png" },
//     { "name": "gyarados", "img": "https://giantbomb1.cbsistatic.com/uploads/scale_small/13/135472/1891635-130gyarados.png" },
//     { "name": "alakazam", "img": "https://giantbomb1.cbsistatic.com/uploads/scale_small/13/135472/1891836-065alakazam.png" },
//     { "name": "rapidash", "img": "https://giantbomb1.cbsistatic.com/uploads/scale_small/13/135472/1892310-078rapidash.png" },
//     { "name": "onix", "img": "https://giantbomb1.cbsistatic.com/uploads/scale_small/13/135472/1891842-095onix.png" },
//     { "name": "mewtwo", "img": "https://giantbomb1.cbsistatic.com/uploads/scale_small/13/135472/1895869-150mewtwo.png" }
// ];
//===============================================================

//listening to port given by environment / 8080 if local environment
var port = process.env.PORT || 8080;
app.listen(port, function() {
    console.log("Pokemons have started !! at " + port);
});
