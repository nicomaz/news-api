const { handleServerErrors, handlePsqlErrors, handleCustomErrors } = require("./errors");
const { handle404 } = require("./controllers/api.controllers");

const express = require("express");
const app = express();

app.use(express.json());

const apiRouter = require("./routes/api-router");
app.use("/api", apiRouter);

app.all("*", handle404);

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
