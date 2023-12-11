const { handleServerErrors, handlePsqlErrors, handleCustomErrors } = require("./errors");
const { handle404 } = require("./controllers/api.controllers");
const cors = require('cors');

const express = require("express");
const app = express();

app.use(cors());
app.use(express.json());

const apiRouter = require("./routes/api-router");
app.use("/api", apiRouter);

app.all("*", handle404);

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
