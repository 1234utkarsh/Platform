const jwt = require("jsonwebtoken");
const User = require("../models/user");
const redisClient = require("../config/redis");

const userMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) throw new Error("Token doesn't exist");

    // Verify token
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Correct field is "id" (NOT "_id")
    const { id } = payload;
    if (!id) throw new Error("Invalid token");

    // Check user in database
    const result = await User.findById(id);
    if (!result) throw new Error("User doesn't exist");

    // Check if token is blocked in Redis
    const isBlocked = await redisClient.exists(`token:${token}`);
    if (isBlocked) throw new Error("Invalid token");

    // Add user to request
    req.result = result;

    next();

  } catch (err) {
    res.status(401).send("Error: " + err.message);
  }
};

module.exports = userMiddleware;
