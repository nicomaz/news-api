const { getAllEndpoints } = require("../models/api.models");

exports.getEndpoints = (req, res) => {
  getAllEndpoints().then((endpoints) => {
    res.status(200).send({ endpoints });
  });
};

exports.handle404 = (req, res) => {
  res.status(404).send({ msg: "Path not found" });
};