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
            var summary = $(element).find("span.intro").text();
            articles.push({headline: headline, summary: summary, link: link});
        });

        saveArticles(articles, 0, res);
    });
});

function saveArticles(articles, i, res) {
    if (i === articles.length) res.json(articles);
    else {
        Article.find({headline: articles[i].headline}, function (error, docs) {
            if(docs.length > 0) {
                console.log(`${docs[0].headline} is already in database!`);
                saveArticles(articles, i + 1, res);
            }
            else {
                Article.create(articles[i], function (error, docs) {
                    if (!error) console.log(`${articles[i].headline} added to database!`);
                    saveArticles(articles, i + 1, res);
                });
            }
        });
    }
}

module.exports = router;