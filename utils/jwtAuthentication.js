const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const User = require('./collection/Users');

var opts = {};
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderWithScheme("jwt");
opts.secretOrKey = process.env.SECRET_KEY;

passport.use(new JWTStrategy(opts, async (jwt_payload, done) => {
    User.findById(jwt_payload.id)
        .then((results) => {
            if (results) {
                return done(null, results);
            } else {
                return done(null, false);
            }
        })
        .catch((err) => {
            return done(err, false);
        });
}));

exports.isAuthenticated = passport.authenticate('jwt', {session: false});
exports.secret = opts.secretOrKey;