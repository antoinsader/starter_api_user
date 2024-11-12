const errorHandler = (err, req, res, next) => {
  console.log("error from error handler:", err);
  if (err.name === "ValidationError") {
    let msg = "You have the following validation errors: ";
    for (field in err.errors) {
      msg += `the  ${err.errors[field].message}`;
    }
    console.log("Validation errors: ", msg);
    res.status(400).send({
      error: msg,
    });
  } else if (err.message) {
    res.status(500).send({ msg: err.message });
  } else if (err.msg) {
    res.status(500).send({ msg: err.msg });
  } else {
    res.status(500).send({
      msg: typeof err == "string" ? err : "Something went wrong!",
    });
  }
};

module.exports = errorHandler;
