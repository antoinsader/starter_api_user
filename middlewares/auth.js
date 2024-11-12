const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { default: mongoose } = require("mongoose");

const auth_admin = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new Error("Authentication required");
    }
    const JWT_SECRET = process.env.JWT_SECRET_ADMIN;
    const decoded = jwt.verify(token, JWT_SECRET);

    const userId = new mongoose.Types.ObjectId(decoded._id);

    const users = await User.aggregate([
      {
        $match: { _id: userId },
      },
      {
        $lookup: {
          from: "roles",
          localField: "role_id",
          foreignField: "_id",
          as: "role_info",
        },
      },
      {
        $unwind: "$role_info",
      },
      {
        $project: {
          _id: 1,
          username: 1,
          email: 1,
          role: "$role_info.name",
        },
      },
    ]);
    const user = users[0];

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    console.error("Error in auth middleware x11: ", error);
    next(error);
  }
};

const auth_customer = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new Error("Authentication required");
    }

    const JWT_SECRET = process.env.JWT_SECRET_CUSTOMER;
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = new mongoose.Types.ObjectId(decoded._id);

    const users = await User.aggregate([
      {
        $match: { _id: userId },
      },
      {
        $lookup: {
          from: "roles",
          localField: "role_id",
          foreignField: "_id",
          as: "role_info",
        },
      },
      {
        $unwind: "$role_info",
      },
      {
        $project: {
          _id: 1,
          username: 1,
          email: 1,
          role: "$role_info.name",
        },
      },
    ]);
    const user = users[0];

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    console.error("Error in auth middleware x33: ", error);
    next(error);
  }
};

const auth_all = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new Error("Authentication required. x1");
    }
    let decoded;
    try {
      const JWT_SECRET_ADMIN = process.env.JWT_SECRET_ADMIN;
      decoded = jwt.verify(token, JWT_SECRET_ADMIN);
    } catch (error) {
      const JWT_SECRET_CUSTOMER = process.env.JWT_SECRET_CUSTOMER;
      decoded = jwt.verify(token, JWT_SECRET_CUSTOMER);
    }
    if (!decoded) throw new Error("authentication required. x2");

    const userId = new mongoose.Types.ObjectId(decoded._id);
    const users = await User.aggregate([
      {
        $match: { _id: userId },
      },
      {
        $lookup: {
          from: "roles",
          localField: "role_id",
          foreignField: "_id",
          as: "role_info",
        },
      },
      {
        $unwind: "$role_info",
      },
      {
        $project: {
          _id: 1,
          username: 1,
          email: 1,
          role: "$role_info.name",
        },
      },
    ]);
    const user = users[0];

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    
    next(error);
  }
};

module.exports = { auth_admin, auth_customer, auth_all };
