const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
require("dotenv").config();
const errorHandler = require("./middlewares/errorHandler");

const corsOptions = {
  origin: process.env.ALLOWED_IP,
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true,
};

const app = express();

app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.use("/user", require("./routes/userRoutes"));
    app.use("/notification", require("./routes/notificationRoutes"));
    app.use("/role", require("./routes/roleRoutes"));

    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("Could not connect to MongoDB", err));
