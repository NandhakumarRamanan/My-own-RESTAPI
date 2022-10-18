//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//TODO
mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema={
  title:String,
  content:String
};

const Article= mongoose.model("Article",articleSchema);


////////////////////////////////////////////REQUEST TARGETING ALL THE ARTICLES/////////////////////////////


app.route("/articles")
.get(function(req,res){
  Article.find(function(err,foundArticles){
    if(!err){
      res.send(foundArticles);
    }else{
      console.log(err);
    }
  });
})

.post(function(req,res){
  const article= new Article({
    title:req.body.title,
    content:req.body.content
  });
  article.save(function(err){
    if(!err){
      console.log("Successfully added new articles");
    }else{
      console.log(err);
    }
  });
})

.delete(function(req,res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("Successfully deleted all articles.");
    }else{
      res.send(err);
    }
  });
});
//////////////////////////////////REQUEST TARGETING SPECIFIC ARTICLE/////////////////////

app.route("/articles/:articletitle")

.get(function(req,res){
  Article.findOne({title: req.params.articletitle},function(err,foundArticle){
    if(foundArticle){
      res.send(foundArticle);
    }else{
      res.send("No articles is found with that name.");
    }
  });
})

.put(function(req,res){
  const articletitle=req.params.articletitle;
  const newDocument={
    title:req.body.title,
    content:req.body.content
  };
  Article.findOneAndUpdate(
    {title:articletitle},
    newDocument,
    {overwrite: true},
    function(err,replacedArticle){
      if(!err){
        res.send(replacedArticle);
      }else{
        res.send(err);
      }
    }
  );
})

.patch(function(req,res){
  const articletitle=req.params.articletitle;
  Article.updateOne(
    {title:articletitle},
    {$set: req.body},
    {overwrite: true},
    function(err,replacedArticle){
      if(!err){
        res.send("Successfully updated article");
      }else{
        res.send(err);
      }
    }
  );
})

.delete(function(req,res){
  Article.deleteOne({title:req.params.articletitle},function(err){
    if(!err){
      res.send("Successfully deleted the corresponding the article");
    }else{
      res.send(err);
    }
  });
});




app.listen(3000, function() {
  console.log("Server started on port 3000");
});
