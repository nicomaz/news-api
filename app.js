const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const { handleServerErrors } = require("./errors");
const { handle404, getEndpoints } = require("./controllers/api.controllers");
const app = express();

app.get("/api", getEndpoints);
app.get("/api/topics", getTopics);

app.all("*", handle404);
app.use(handleServerErrors);

module.exports = app;
