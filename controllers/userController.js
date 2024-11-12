const Model = require("../models/user");
const roleModel = require("../models/role");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { hashPassword_customer, hashPassword_admin } = require("../utils/hash");
const { default: mongoose } = require("mongoose");

exports.registerCustomer = async (req, res, next) => {
  try {
    const roleObj = await roleModel.findOne({ name: "customer" });
    if (!roleObj) {
      throw new Error("Role not found");
    }

    const customerRoleId = new mongoose.Types.ObjectId(roleObj._id);

    const { username, email, password } = req.body;

    const hashedPassword = await hashPassword_customer(password);

    const user = new Model({
      username,
      password: hashedPassword,
      email,
      role_id: customerRoleId,
    });
    await user.save();
    
    const token = jwt.sign(
      { _id: user._id.toString() },
      process.env.JWT_SECRET_CUSTOMER
    );

    res.status(201).send({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
      role: { name: "customer" },
      token,
    });
  } catch (error) {
    next(error);
  }
};


exports.createUser = async (req, res, next) => {
  try {
    const { username, email, password, role_id, cnfrmPassword } = req.body;
    if (password !== cnfrmPassword) {
      throw new Error("Password confirmation did not match");
    }
    const rr_id = new mongoose.Types.ObjectId(role_id);
    const roleObj = await roleModel.findById(rr_id);
    if (!roleObj) {
      throw new Error("Role not found");
    }
    let hashedPassword;

    if (roleObj.name == "customer") {
      hashedPassword = await hashPassword_customer(password);
    } else if (roleObj.name == "admin") {
      hashedPassword = await hashPassword_admin(password);
    } else {
      throw new Error("Role not found");
    }

    const user = new Model({
      username,
      password: hashedPassword,
      email,
      role_id,
    });
    const obj = await user.save();

    res.status(201).send(obj);
  } catch (error) {
    console.error("Error user/signup: ", error);
    next(error);
  }
};


exports.loginCustomer = async (req, res, next) => {
  try {
    const roleObj = await roleModel.findOne({ name: "customer" });
    if (!roleObj) {
      throw new Error("Role not found");
    }

    const { username, password } = req.body;
    const user = await Model.findOne({
      username,
      role_id: roleObj._id,
    }).populate("role_id", "name");


    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error("Invalid login credentials");
    }

    const JWT_SECRET = process.env.JWT_SECRET_CUSTOMER;
    const token = jwt.sign({ _id: user._id }, JWT_SECRET);

    res.send({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
      role: { name: "customer" },
      token,
    });
  } catch (error) {
    console.error("Error user/login: ", error);
    next(error);
  }
};

exports.loginAdmin = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const roleObj = await roleModel.findOne({ name: "admin" });
    if (!roleObj) {
      throw new Error("Role not found");
    }

    const user = await Model.findOne({
      username,
      role_id: roleObj._id,
    }).populate("role_id", "name");

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error("Invalid login credentials");
    }
    const JWT_SECRET = process.env.JWT_SECRET_ADMIN;
    const token = jwt.sign({ _id: user._id }, JWT_SECRET);

    res.send({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
      role: { name: "admin" },
      token,
    });
  } catch (error) {
    console.error("Error user/login: ", error);
    next(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const users = await Model.aggregate([
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
          createdAt: 1,
        },
      },
    ]);

    res.send(users);
  } catch (error) {
    console.error("Error user/getprofile: ", error);
    next(error);
  }
};
exports.getCustomers = async (req, res, next) => {
  try {
    const roleObj = await roleModel.findOne({ name: "customer" });
    if (!roleObj) {
      throw new Error("Role not found");
    }

    const customers = await Model.find({ role_id: roleObj._id }).select(
      "_id username"
    );
    res.send(customers);
  } catch (error) {
    console.error("Error user/getCustomers: ", error);
    res.status(400).send({ error: error.message });
  }
};
exports.getOne = async (req, res, next) => {
  try {
    const _id = req.body.user_id;
    const original_id = new mongoose.Types.ObjectId(_id);
    if (!original_id) res.status(400).send({ msg: "User is not valid" });

    const user = await Model.aggregate([
      {
        $match: {
          _id: original_id,
        },
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
          createdAt: 1,
        },
      },
    ]);
    const userObject = user.length > 0 ? user[0] : null;

    res.send(userObject);
  } catch (error) {
    console.error("Error user/getprofile: ", error);
    res.status(400).send({ error: error.message });
  }
};

exports.userOne = async (req, res, next) => {
  const userId = new mongoose.Types.ObjectId(req.body._id);

  try {
    let user = await Model.aggregate([
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

    res.send({ user });
  } catch (error) {
    console.error("Error user/getprofile: ", error);
    res.status(400).send({ error: error.message });
  }
};
exports.getProfile = async (req, res, next) => {
  try {
    const user = await Model.findOne(req.user._id).populate("role_id", "name");
    res.send({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role_id.name,
    });
  } catch (error) {
    console.error("Error user/getprofile: ", error);
    res.status(400).send({ error: error.message });
  }
};

exports.updateInfo = async (req, res, next) => {
  try {
    const { username, email } = req.body;
    const body = {
      email,
      username,
    };

    const obj = await Model.findOneAndUpdate(
      { _id: req.user._id },

      body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!obj) {
      return res.status(404).send({ error: "Policy not found" });
    }
    res.send(obj);
  } catch (error) {
    console.error("Error policy/updateOne: ", error);

    res.status(400).send(error);
  }
};

exports.updateInfoAdmin = async (req, res, next) => {
  try {
    const { username, email, role_id } = req.body;
    const body = {
      email,
      username,
      role_id,
    };

    const obj = await Model.findOneAndUpdate(
      { _id: req.body.user_id },

      body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!obj) {
      return res.status(404).send({ error: "Policy not found" });
    }
    res.send(obj);
  } catch (error) {
    console.error("Error policy/updateOne: ", error);

    res.status(400).send(error);
  }
};

exports.updatePassword_customer = async (req, res, next) => {
  try {
    const { old_password, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      throw new Error("Password were not matched!");
    }
    const user_id = new mongoose.Types.ObjectId(req.user._id);

    const user = await Model.findById(user_id).lean();
    if (!user || !(await bcrypt.compare(old_password, user.password))) {
      throw new Error("Wrong old password!");
    }

    const hashedPassword = await hashPassword_customer(password);
    const obj = await Model.findByIdAndUpdate(
      user_id,
      { hashedPassword },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!obj) {
      return res.status(404).send({ error: "Policy not found" });
    }
    res.send(obj);
  } catch (error) {
    console.error("Error user/changepasswordcustomer: ", error);
    next(error);
  }
};

exports.changePasswordOfUser = async (req, res, next) => {
  try {
    const { password, _id, confirmPassword, old_password } = req.body;
    const user_id = new mongoose.Types.ObjectId(_id);
    console.log("user:  ", user_id);
    if (!user_id) throw new Error("User not found");
    if (password != confirmPassword)
      throw new Error("PASSWORDS were not a match");

    const user = await Model.findById(user_id).populate("role_id", "name");
    console.log("user: ", user);
    if (!user || !(await bcrypt.compare(old_password, user.password))) {
      throw new Error("Wrong old password!");
    }

    let hashed;
    if (user.role_id.name == "customer") {
      hashed = await hashPassword_customer(password);
    }
    if (user.role_id.name == "admin") {
    }
    hashed = await hashPassword_admin(password);
    if (!hashed) {
      throw new Error("Error changing passwords x321");
    }

    const body = {
      password: hashed,
    };

    const obj = await Model.findOneAndUpdate(
      { _id: user_id },

      body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!obj) {
      return res.status(404).send({ error: "Error changing passwords x324" });
    }
    res.send(obj);
  } catch (error) {
    console.error("Error user/changepasswordadmin: ", error);
    next(error);
  }
};

exports.deleteOne = async (req, res, next) => {
  try {
    const obj = await Model.findOneAndDelete({
      _id: req.body._id,
    });
    if (!obj) {
      throw new Error(`${oneEntityName.toUpperCase()} not found`);
    }
    res.send(obj);
  } catch (error) {
    console.error(`Error ${oneEntityName}/deleteOne: ${error}`);
    next(error);
  }
};



