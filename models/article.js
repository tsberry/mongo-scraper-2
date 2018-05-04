var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var commentSchema = new Schema({
    text: {
        type: String,
        required: true,
        trim: true
    }
});

var articleSchema = new Schema({
    headline: {
        type: String,
        required: true
    },
    summary: {
        type: String
    },
    link: {
        type: String,
        required: true
    },
    comments: [commentSchema]
});

var Article = mongoose.model("Article", articleSchema);

module.exports = Article;