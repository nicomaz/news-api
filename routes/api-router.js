const apiRouter = require("express").Router();
const { getEndpoints } = require("../controllers/api.controllers");
const userRouter = require("./users-router");
const topicRouter = require("./topics-router");
const commentRouter = require("./comments-router");
const articleRouter = require("./articles-router");

apiRouter.get("/", getEndpoints);

apiRouter.use('/users', userRouter)
apiRouter.use('/topics', topicRouter)
apiRouter.use('/comments', commentRouter)
apiRouter.use('/articles', articleRouter)

module.exports = apiRouter;
