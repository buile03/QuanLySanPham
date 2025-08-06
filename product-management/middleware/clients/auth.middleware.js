const User = require("../../models/user.model");

module.exports.requireAuth = async (req, res, next) => {
  if (!req.cookies.tokenUser) {
    return res.redirect(`/login`);
  } else {
    const user = await User.findOne({
      token: req.cookies.tokenUser,
      deleted: false,
    }).select("-password");
    if (!user) {
      return res.redirect(`/login`);
    } else {
      res.locals.user = user;
      next();
    }
  }
};
