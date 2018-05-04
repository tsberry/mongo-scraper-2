var Article = require("../models/article");
var express = require("express");
var request = require("request");
var cheerio = require("cheerio");

var router = express.Router();

router.get("/", function (req, res) {
    Article.find({}, function (error, docs) {
        res.render("index", { articles: docs });
    });
});

router.get("/scrape", function (req, res) {
    request("https://animenewsnetwork.com", function (error, response, html) {
        console.log("Scraping...");
        var $ = cheerio.load(html);
        var articles = [];
        $("div.herald").each(function (i, element) {
            var headline = $(element).find("h3").find("a").text();
            var link = $(element).find("h3").find("a").attr("href");
            var summary = $(element).find("div.preview").text();
            articles.push({ headline: headline, summary: summary, link: link });
        });

        saveArticles(articles, 0, res);
    });
});

router.post("/comments", function (req, res) {
    console.log(req.body);
    var id = req.body.id;
    var text = req.body.text;
    Article.findOne({ _id: id })
        .then(function (dbArticle) {
            dbArticle.comments.push({ text: text });
            dbArticle.save()
                .then(function () {
                    console.log("Success! Added comment: " + text);
                    res.end();
                })
                .catch(function (error) {
                    res.json(error);
                });
        })
        .catch(function (error) {
            res.json(error);
        });
});

function saveArticles(articles, i, res) {
    if (i === articles.length) res.json(articles);
    else {
        Article.find({ headline: articles[i].headline })
            .then(function (dbArticles) {
                if (dbArticles.length > 0) {
                    console.log(`${dbArticles[0].headline} is already in database!`);
                    saveArticles(articles, i + 1, res);
                }
                else {
                    Article.create(articles[i])
                        .then(function (dbArticle) {
                            console.log(`${articles[i].headline} added to database!`);
                            saveArticles(articles, i + 1, res);
                        })
                        .catch(function (error) {
                            res.json(error);
                        });
                }
            })
            .catch(function (error) {
                res.json(error);
            });
    }
}

module.exports = router;