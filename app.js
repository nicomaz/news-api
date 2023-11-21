const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const {
  handleServerErrors,
  handlePsqlErrors,
  handleCustomErrors,
} = require("./errors");
const {
  getArticleById,
  getCommentsByArticleId,
  getArticles,
} = require("./controllers/articles.controllers");
const { handle404, getEndpoints } = require("./controllers/api.controllers");

const app = express();

app.get("/api", getEndpoints);
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.get("/api/articles", getArticles);

app.all("*", handle404);

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
