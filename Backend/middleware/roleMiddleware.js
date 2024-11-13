

// Checks if the user is an admin
const isAdmin = (req, res, next) => {
  console.log("i am in is admin check middleware")
  if (req.user && req.user.role === 'admin') {
    return next();
  } else {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
};

// Checks if the user is an owner
const isOwner = (req, res, next) => {
  console.log(req.user)
  if (req.user && req.user.role === 'owner') {
    return next();
  } else {
    return res.status(403).json({ message: 'Access denied: Owners only' });
  }
};

// Checks if the user is part of 'everyone' role
const isEveryone = (req, res, next) => {
  if (req.user && req.user.role === 'everyone') {
    return next();
  } else {
    return res.status(403).json({ message: 'Access denied: Everyone role required' });
  }
};

module.exports = { isAdmin, isOwner, isEveryone };
