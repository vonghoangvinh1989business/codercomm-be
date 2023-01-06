const Reaction = require("../models/Reaction");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils");
const mongoose = require("mongoose");

const reactionController = {};

const calculateReaction = async (targetId, targetType) => {
  const stats = await Reaction.aggregate([
    {
      $match: { targetId: mongoose.Types.ObjectId(targetId) },
    },
    {
      $group: {
        _id: "$targetId",
        like: { $sum: { $cond: [{ $eq: ["$emoji", "like"] }, 1, 0] } },
        dislike: {
          $sum: { $cond: [{ $eq: ["$emoji", "dislike"] }, 1, 0] },
        },
      },
    },
  ]);

  const reactions = {
    like: (stats[0] && stats[0].like) || 0,
    dislike: (stats[0] && stats[0].dislike) || 0,
  };

  await mongoose.model(targetType).findByIdAndUpdate(targetId, { reactions });
  return reactions;
};

reactionController.saveReaction = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const { targetType, targetId, emoji } = req.body;

  // check targetType exists
  const targetObject = await mongoose.model(targetType).findById(targetId);
  if (!targetObject)
    throw new AppError(404, `${targetType} Not Found`, "Create Reaction Error");

  // find the reaction if exists
  let reaction = await Reaction.findOne({
    targetType,
    targetId,
    author: currentUserId,
  });

  // if there is no reaction in the DB -> create a new one
  if (!reaction) {
    reaction = await Reaction.create({
      targetType,
      targetId,
      author: currentUserId,
      emoji,
    });
  } else {
    // if there is a previous reaction in the DB -> compare the emojis
    if (reaction.emoji === emoji) {
      // if they are the same -> delete the reaction
      await reaction.delete();
    } else {
      // if they are different -> update the reaction
      reaction.emoji = emoji;
      await reaction.save();
    }
  }

  const reactions = await calculateReaction(targetId, targetType);

  return sendResponse(
    res,
    200,
    true,
    reactions,
    null,
    "Save Reaction Successfully"
  );
});

module.exports = reactionController;
