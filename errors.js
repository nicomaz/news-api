exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23503" || err.code === "23502" || err.code === "2201W" || err.code === "23505") {
    res.status(400).send({
      msg: "Bad request",
    });
  } else {
    next(err);
  }
};

exports.handleServerErrors = (err, req, res, next) => {
  console.log(err)
  res.status(500).send({ msg: "Internal server errors" });
};
