const Usermodel = require("../model/usermodel");
const jwt = require('jsonwebtoken');
const AppError = require("../utils/appError");


// token function
const createSendToken = (user, res) => {
  const token = user.generateAuthToken();
  user.password = undefined // avoid returning selected password to client
  res.status(200).json({
    success: true,
    token,
    data: {
      user
    }
  });
};

// Register function, checks if authenticated user is admin
exports.register = async (req, res, next) => {
  const { name, email, password, phoneNumber, isAdmin, company, passwordConfirm } = req.body;
  try {
    if (password !== passwordConfirm) {
      throw new AppError("Passwords do not match", 400)
    }
    if (!req.user || !req.user.isAdmin) {
      throw new AppError("Only admins can create users", 401)
    }
    const newUser = await Usermodel.create({
      name: name,
      email: email,
      password: password,
      company: company,
      isAdmin: isAdmin,
      phoneNumber: phoneNumber
    })
    if (!newUser) {
      throw new AppError("User not registered")
    }
    res.status(200).json({
      success: true,
      data: {
        newUser
      }
    });
  } catch (error) {
    next(error)
  }
}

// Login function
exports.login = async (req, res, next) => {
  try {
    const { emailOrPhone, password } = req.body;
    if (!emailOrPhone || !password) {
      throw new AppError("Please provide an email and password", 400)
    }
    let user;
    if (emailOrPhone.includes('@')) {
      user = await Usermodel.findOne({ email: emailOrPhone }).select('+password');
    } else {
      user = await Usermodel.findOne({ phoneNumber: emailOrPhone }).select('+password');
    }
    if (!user || !(await user.correctPassword(password, user.password))) {
      throw new AppError("Invalid email or password", 401)
    }
    createSendToken(user, res);
  } catch (err) {
    next(err);
  }
};


exports.getUsers = async (req, res, next) => {
  try {

    // fetches users from db with  limit of 5 as stated
    const searchQuery = req.query.search || '';
    const page = parseInt(req.query.page) || 1;
    const limit = 5
    const skip = (page - 1) * limit;
    const searchFilter = { name: { $regex: searchQuery, $options: 'i' } };
    const total = await Usermodel.countDocuments(searchFilter);
    const totalPages = Math.ceil(total / limit);
    const users = await Usermodel.find(searchFilter).skip(skip).limit(limit);


    res.status(200).json({
      success: true,
      data: {
        users,
      },
      meta: {
        page,
        limit,
        totalPages,
        total,
      },
    })
  } catch (error) {
    next(err)
  }
}

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await Usermodel.findById(req.params.id);
    if (!user) {
      throw new AppError('No user found with that ID', 404);
    }
    if (user.isAdmin && (req.user._id != req.params.id)) {
      throw new AppError("You cannot delete this admin", 403)
    }
    await user.deleteOne()
    res.status(200).json({
      success: true,
      data: null
    });
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await Usermodel.findById(req.params.id);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    res.status(200).json({
      success: true,
      data: {
        user
      }
    });
  } catch (err) {
    next(new AppError("Invalid User Id", 404));
  }
};


exports.updateUser = async (req, res, next) => {
  try {
    if (req.body.password) {
      throw new AppError('This route is not for password updates', 400);
    }
    const user = await Usermodel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!user) {
      throw new AppError('No user found with that ID', 404);
    }
    res.status(200).json({
      success: true,
      data: {
        user
      }
    });
  } catch (err) {
    next(err);
  }
};


// Auth middleware function to verify tokens
exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      throw new AppError('You are not logged in! Please log in to get access', 401);
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await Usermodel.findById(decoded.id);
    if (!currentUser) {
      throw new AppError('Please relogin to continue', 401);
    }
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      throw new AppError('User recently changed pasword! Please log in', 403)
    }
    req.user = currentUser;
    next();
  } catch (err) {
    next(err);
  }
};
