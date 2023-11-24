const { checkExists } = require("../db/seeds/utils");
const { selectUsers, selectUserByUsername } = require("../models/users.models");

exports.getUsers = (req, res, next) => {
  selectUsers().then((users) => {
    res.status(200).send({ users });
  });
};

exports.getUsersByUsername = (req, res, next) => {
  const { username } = req.params;

  const userPromises = [
    checkExists("users", "username", username),
    selectUserByUsername(username),
  ];

  Promise.all(userPromises)
    .then((resolvedPromises) => {
      const user = resolvedPromises[1]
      res.status(200).send({ user });
    })
    .catch(next);
};
