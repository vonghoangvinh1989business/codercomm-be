const { sendResponse, AppError, catchAsync } = require("../helpers/utils");
const User = require("../models/User");
const userController = {};

userController.register = catchAsync(async (req, res, next) => {
  // Get data from request
  const { name, email, password } = req.body;

  // Validation
  let user = await User.findOne({ email });
  if (user)
    throw new AppError(400, "User already exists", "Registration Error");

  // Process
  user = await User.create({ name, email, password });

  // Response
  sendResponse(res, 200, true, { user }, null, "Create User Successfully.");
});

module.exports = userController;
