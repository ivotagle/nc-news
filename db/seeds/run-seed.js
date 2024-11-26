const devData = require("../data/development-data/index.js");
const seed = require("./seed.js");
const db = require("../connection.js");

const runSeed = () => {
  return seed(devData)
    .then(() => {
      console.log("seeding complete");

      return db.end();
    })
    .catch((err) => {
      console.log(err, "<= error in seeding");
    });
};

runSeed();
