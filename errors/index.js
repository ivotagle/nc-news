exports.handleCustomErrors = (err, req, res, next) => {
  if (err.message.includes("invalid format")) {
    res.status(400).send({ msg: "Bad request: invalid format" });
  }
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request: invalid format" });
  } else next(err);

  if (err.code === "22003") {
    res.status(404).send({ msg: "Bad request: Key not found" });
  } else next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
  //console.log("server error in=>", err);
  res.status(500).send({ msg: "Internal Server Error" });
};
