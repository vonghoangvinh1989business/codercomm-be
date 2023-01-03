const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

/**
 * @route POST /users
 * @description Register new user
 * @body { name, email, password }
 * @access Public
 */
router.post("/", userController.register);

/**
 * @route GET /users?page=1&limit=10
 * @description Get users with pagination
 * @access Login required
 */

/**
 * @route GET /users/me
 * @description Get current user info
 * @access Login required
 */

/**
 * @route GET /users/:id
 * @description Get a user profile
 * @access Login required
 */

/**
 * @route PUT /users/:id
 * @description Update user profile
 * @body { name, avatarUrl, coverUrl, aboutMe, city, country, company,
 * jobTitle, facebookLink, instagramLink, linkedinLink, twitterLink }
 * @access Login required
 */

module.exports = router;
