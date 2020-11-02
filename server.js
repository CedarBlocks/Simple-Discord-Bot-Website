const config = require("./config.json");
const morgan = require("morgan");
const ejs = require("ejs");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(morgan("short"));
app.use(morgan("combined"));

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

const apiRoute = require('./routes/api');

app.use("/api", apiRoute)

app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.set('views', __dirname + '/views');

app.get("/", function (req, res) {
  res.render("index.ejs");
});

app.get("/commands", function (req, res) {
  res.render("commands.ejs");
});

app.get("/livechat", function (req, res) {
  res.render("livechat.ejs");
});
app.get("/privacy", function (req, res) {
  res.render("privacy.ejs");
});

app.get("/support", function (req, res) {
  res.redirect(config.supportServer);
});

app.get("/invite", function (req, res) {
  res.redirect(config.botInvite);
});

app.get('*', function(req, res){
  res.status(404).render("404.ejs")
});

app.use(function(err, req, res, next) {
  console.error('ERROR ', err.stack);
  res.status(500).render('500.ejs');
});

var listener = app.listen(config.port || process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});