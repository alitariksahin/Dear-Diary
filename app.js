const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
require("dotenv").config();
const axios = require("axios");

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI);

const compositionSchema = mongoose.Schema({
  title: String,
  text: String,
});
const Composition = mongoose.model("composition", compositionSchema);

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res) {
  Composition.find({}, function(err, result) {
    if (!err) {
      res.render("home", {title: "Home", posts: result});
    }
  })


})

app.get("/about", function(req, res) {
  res.render("about", {title: "About Us"});
})

app.get("/contact", function(req, res) {
  res.render("contact", {title: "Contact Us"});
})

app.get("/compose", function(req, res) {
  res.render("compose", {title: "Compose"});
})

app.get("/posts/:id", async function(req, res) {
  try {
    const result = await Composition.findOne({_id: req.params.id});
    res.render("post", {title:"Post", post: result});
  }catch(err) {
    console.log(err);
  }
});

app.post("/compose", async function(req, res) {
  const newTitle = req.body.title;
  const newContent = req.body.post;
  const newPost = new Composition({
    title: newTitle,
    text: newContent
  });
  try {
    const result = await newPost.save();
    res.redirect("/");
  }catch(err) {
    console.log(err);
  }
});

app.listen(process.env.PORT || 3000, function() {
  console.log(`Server started on port ${process.env.PORT}`);
});
