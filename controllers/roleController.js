const Model = require("../models/role");
const oneEntityName = "Role";

exports.getAll = async (req, res, next) => {
  try {
    const objects = await Model.find();
    res.send(objects);
  } catch (error) {
    console.error(`Error ${oneEntityName}/getAll: ${error}`);
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const obj = new Model({ ...req.body });
    await obj.save();
    res.status(201).send(obj);
  } catch (error) {
    console.error(`Error ${oneEntityName}/create: ${error}`);
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const obj = await Model.findOneAndUpdate(
      { _id: req.body._id },

      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!obj) {
      throw new Error(`${oneEntityName.toUpperCase()} not found` );
    }
    res.send(obj);
  } catch (error) {
    console.error(`Error ${oneEntityName}/updateOne: ${error}`);
    next(error);
  }
};

exports.deleteOne = async (req, res, next) => {
  try {
    const obj = await Model.findOneAndDelete({
      _id: req.body._id,
    });
    if (!obj) {
      throw new Error(`${oneEntityName.toUpperCase()} not found` );
    }
    res.send(obj);
  } catch (error) {
    console.error(`Error ${oneEntityName}/deleteOne: ${error}`);
    next(error);
  }
};
