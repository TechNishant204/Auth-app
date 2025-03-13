const User = require("../models/User"); // Import User model to perform database operations
const bcrypt = require("bcrypt"); // Import bcrypt for password hashing
const jwt = require("jsonwebtoken"); // Import jsonwebtoken for token generation
require("dotenv").config();

// In case of signup we perform hashing of password and then store it in database
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already Exists",
      });
    }
    //If user don't exist then secure password using hash
    let hashPassword;
    try {
      // here using hash function from bcrypt we hashed the password
      hashPassword = await bcrypt.hash(password, 10);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Error in hashing password",
      });
    }

    // create entry for user
    const user = await User.create({
      name,
      email,
      password: hashPassword,
      role,
    });

    return res.status(200).json({
      success: true,
      message: "User Created Successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered, please try again later",
    });
  }
};

// In case of login we perform generation of token and then send it to client

exports.login = async (req, res) => {
  try {
    // data fetch
    const { email, password } = req.body;

    //Validation on email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields carefully",
      });
    }

    // check for a registered user
    let user = await User.findOne({ email });

    // if not a registered user or user not in database
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered, Please signup",
      });
    }

    const payload = {
      email: user.email,
      id: user._id,
      role: user.role,
    };

    //verify password and generate a JWT token
    if (await bcrypt.compare(password, user.password)) {
      // if password match then generate token
      let token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });

      user = user.toObject(); // here we convert mongoose document to plain object
      user.token = token;
      user.password = undefined;

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      // here cookie is set with token and options and we are sending back to the client
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        data: user,
        message: "User LoggedIn Successfully",
      });
    } else {
      //password do not match
      return res.status(403).json({
        success: false,
        message: "Incorrect Password",
      });
    }
  } catch (error) {
    //Login failure
    console.log(error);
    return res.status(403).json({
      success: false,
      message: "Login Failure",
    });
  }
};
