if (process.env.SECRET_KEY !== 'production') {
   require('dotenv').config();
}
const loginRouter = require('./routers/login-router')
const express = require('express');
const db = require('./extension');
const flash = require('express-flash');
const session = require('express-session');
const passport = require('passport');
const methodOverRide = require('method-override');

const app = express();

app.set('view-engine', 'ejs');
app.use(methodOverRide('_method'))
app.use(express.urlencoded({extended: false}))
app.use(flash());
app.use(session({
   secret: process.env.SECRET_KEY,
   resave: false,
   saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session())
app.use(express.json());

// Move loginRouter middleware below passport initialization
app.use('/', (req, res, next) => {
  loginRouter(req, res, next);
});

app.listen(process.env.PORT, () => console.log(`Connected to http://localhost${process.env.PORT}`));

