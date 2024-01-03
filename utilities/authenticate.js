require("dotenv").config();

var passport = require("passport");
var LocalStategy = require("passport-local");
var JwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;
var jwt = require("jsonwebtoken");

var User = require("../db/models/user");

exports.getToken = function (user) {
  return jwt.sign(user, process.env.secretOrKey, {
    expiresIn: 3600,
  });
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.secretOrKey;

exports.jwtPassport = passport.use(
  new JwtStrategy(opts, (jwt_payload, done) => {
    console.log("JWT payload: ", jwt_payload);
    User.findOne({ id: jwt_payload.id }, (err, user) => {
      if (err) {
        return done(err, false);
      } else if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  })
);

exports.verifyUser = passport.authenticate("jwt", { session: false });

exports.verifyAdmin = (req, res, next) => {
  let admin = req.user.admin;
  if (!req.user || !admin) {
    var err = new Error("You are not authenticated!");
    err.status = 403;
    return next(err);
  } else {
    next();
  }
};
