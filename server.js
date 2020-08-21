const morgan = require("morgan");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(morgan("short"));
//app.use(morgan("combined"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/commands", function(req, res) {
  res.sendFile(__dirname + "/commands.html");
});

app.get("/livechat", function(req, res) {
  res.sendFile(__dirname + "/livechat.html");
});

app.get("/support", function(req, res) {
  res.redirect("https://discord.gg/2YQ2ydr");
});

app.get("/invite", function(req, res) {
  res.redirect(
    "https://discordapp.com/oauth2/authorize?client_id=702935974308741140&scope=bot&permissions=52289"
  );
});

app.post("/api/bot/commands", function(req, res) {
  console.log(req.body);
  res.end('Successfully updated commands');
});

var listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});