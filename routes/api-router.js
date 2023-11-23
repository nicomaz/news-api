const { checkAPIRouter } = require("../controllers/api.controllers");
const apiRouter = require("express").Router();

apiRouter.get("/", checkAPIRouter);

module.exports = apiRouter;
