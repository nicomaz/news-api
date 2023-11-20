const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const { handleServerErrors } = require("./errors");
const app = express();

app.get("/api/topics", getTopics);

app.use(handleServerErrors);

module.exports = app;