const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const { handleServerErrors } = require("./errors");
const { handle404, getEndpoints } = require("./controllers/api.controllers");
const { getArticles } = require("./controllers/articles.controllers");
const app = express();

app.get("/api", getEndpoints);
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles)


app.all("*", handle404);
app.use(handleServerErrors);

module.exports = app;
