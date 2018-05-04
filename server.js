var mongoose = require("mongoose");
var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");

var app = express();

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var PORT = process.env.PORT || 7000;

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines2";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

var router = require("./routes/router");
app.use(router);

app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT + "!");
})