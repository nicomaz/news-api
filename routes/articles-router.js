const articleRouter = require('express').Router();
const { getArticles, getArticleById, updateArticleVotesById, postArticle } = require("../controllers/articles.controllers");
const { getCommentsByArticleId, postComment } = require('../controllers/comments.controllers');

articleRouter
.route("/")
.get(getArticles)
.post(postArticle)

articleRouter
.route("/:article_id")
.get(getArticleById)
.patch(updateArticleVotesById)

articleRouter
.route("/:article_id/comments")
.get(getCommentsByArticleId)
.post(postComment)

module.exports = articleRouter;