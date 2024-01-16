if (process.env.SECRET_KEY !== 'production') {
   require('dotenv').config();
}
const loginRouter = require('./routers/login-router')
const express = require('express');
const db = require('./extension');
const flash = require('express-flash');
const session = require('express-session');
const passport = require('passport');


const app = express();

app.set('view-engine', 'ejs');
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

app.use('/', loginRouter, (req, res) =>{
} ) 


app.listen(process.env.PORT, () => console.log(`Connected to http://localhost${process.env.PORT}`));
