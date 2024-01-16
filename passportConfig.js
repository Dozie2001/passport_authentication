const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

const initialize = (passport, getUserByEmail, getUserById) => {
    const authenticateUser = async (email, password, done) => {
    const user = await getUserByEmail(email);

    if (user == null) {
        return done(null, false, { message: 'No user with that email'})
    }

    console.log('User found:', user);
    try {
        if (await bcrypt.compare(password, user.password)) {
            return done(null, user)
        } else {
            return done(null, false, {message: "Password is incorrect"})
        }
    } catch (error) {
        console.error('Error during authentication:', error);

        return done(error)
    }
    }
    passport.use(new localStrategy({ usernameField: 'email' }, authenticateUser));
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser(async (id, done) => {
        const user = await getUserById(id)
        done(null, user);
    });
}

module.exports = initialize