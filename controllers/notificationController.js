const Model = require("../models/notification");
const oneEntityName = "notification";




exports.notificationsSent = async (req, res) => {
  try {
    let objects = await Model.find({ sender_user_id: req.user._id })
      .populate({
        path: "receipt_user_id",
        select: "username",
      })
      .lean();
    objects = objects.map((ele) => ({
      ...ele,
      receipt_user_name: ele.receipt_user_id.username,
      receipt_user_id: null,
      class_status_cell:
        ele.status == "read"
          ? "circle_before circle_green"
          :"circle_before circle_red"
    }));
    console.log("objs: ", objects);
    res.send(objects);
  } catch (error) {
    console.error(`Error ${oneEntityName}/notificationsSent: ${error}`);
    res.status(500).send({ error: error.message });
  }
};
exports.getForUsr = async (req, res) => {
  try {
    const objects = await Model.find({ receipt_user_id: req.user._id });

    res.send(objects);
  } catch (error) {
    console.error(`Error ${oneEntityName}/getForUser: ${error}`);

    res.status(500).send({ error: error.message });
  }
};
exports.getForUsrUnread = async (req, res) => {
  try {
    const objects = await Model.find({
      receipt_user_id: req.user._id,
      status: "unread",
    }).lean();
    res.send(objects);
  } catch (error) {
    console.error(`Error ${oneEntityName}/getForUsrUnread: ${error}`);

    res.status(500).send({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const obj = new Model({
      message: req.body.message,
      sender_user_id: req.user._id,
      receipt_user_id: req.body.receipt_user_id,
    });
    await obj.save();
    res.status(201).send(obj);
  } catch (error) {
    console.error(`Error ${oneEntityName}/create: ${error}`);
    res.status(400).send({ error: error.message });
  }
};

exports.deleteOneFromAdmin = async (req, res) => {
  try {
    const obj = await Model.findOneAndDelete({
      _id: req.body._id,
    });
    if (!obj) {
      return res
        .status(404)
        .send({ error: `${oneEntityName.toUpperCase()} not found` });
    }
    res.send(obj);
  } catch (error) {
    console.error(`Error ${oneEntityName}/deleteOne: ${error}`);

    res.status(500).send(error);
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { _id } = req.user;
    console.log("_id: ", _id);
    await Model.updateMany(
      { receipt_user_id: _id },
      { $set: { status: "read" } },
      { multi: true }
    );
    res.send({ _id });
  } catch (error) {
    console.error("Error policy/updateOne: ", error);

    res.status(400).send(error);
  }
};


const status_style = {
  position: 'relative',
  paddingLeft: '20px',
  '::before': {
    content: '""',
    position: 'absolute',
    left: '0',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '10px',
    height: '10px',
    backgroundColor: 'red',
    borderRadius: '50%',
  },
}