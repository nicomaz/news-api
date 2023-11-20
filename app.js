const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const { handleServerErrors } = require("./errors");
const { handle404 } = require("./controllers/api.controllers");
const { getArticleById } = require("./controllers/articles.controllers");
const app = express();

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.all("*", handle404);
app.use(handleServerErrors);

module.exports = app;
