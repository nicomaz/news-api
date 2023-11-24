const fs = require("fs/promises");

exports.getAllEndpoints = () => {
  return fs
    .readFile(`${__dirname}/../endpoints.json`, "utf-8")
    .then((endpoints) => {
      const parsedEndpoints = JSON.parse(endpoints);
      return parsedEndpoints;
    });
};

