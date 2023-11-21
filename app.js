const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const {
  handleServerErrors,
  handlePsqlErrors,
  handleCustomErrors,
} = require("./errors");
const {
  getArticleById,
  getArticles,
  updateArticleVotesById,
} = require("./controllers/articles.controllers");
const { handle404, getEndpoints } = require("./controllers/api.controllers");
const {
  getCommentsByArticleId,
  deleteComment,
  postComment,
} = require("./controllers/comments.controllers");

const app = express();
app.use(express.json());

app.get("/api", getEndpoints);
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", updateArticleVotesById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postComment);
app.get("/api/articles", getArticles);
app.delete("/api/comments/:comment_id", deleteComment);

app.all("*", handle404);

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
