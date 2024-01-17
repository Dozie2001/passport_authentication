const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/models.js');
const initializePassport = require('../passportConfig.js');
const passport = require('passport');

const Router = express.Router();

const checkNotAuthenticated = (req, res, next) => {
   if (req.isAuthenticated()) {
      return res.redirect('/');
   }
   next();
};

const checkAuthenticated = (req, res, next) => {
   if (req.isAuthenticated()) {
      return next();
   }
   res.redirect('/login');
};

initializePassport(passport, async (email) => {
   try {
      console.log('Email from req.body:', email);
      const user = await User.findOne({ email: email });
      return user;
   } catch (error) {
      console.error('Error fetching user:', error);
      return null;
   }
}, async (id) => {
   const user = await User.findById(id);
   return user;
});

Router.get('/login/testing', async (req, res) => {
   try {
      res.json({ message: 'Works' });
   } catch (error) {
      res.status(500).json({ message: error });
   }
});

Router.get('/login', checkNotAuthenticated, (req, res) => {
   res.render('login.ejs');
});

Router.get('/signup', checkNotAuthenticated, (req, res) => {
   res.render('signup.ejs');
});

Router.post('/signup', checkNotAuthenticated, async (req, res) => {
   try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = new User({
         name: req.body.name,
         email: req.body.email,
         password: hashedPassword,
      });
      const newUser = await user.save();
      console.log(newUser);
      res.redirect('/login');
   } catch (error) {
      console.error(error);
      res.redirect('/signup');
   }
});

Router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
   successRedirect: '/',
   failureRedirect: '/login',
   failureFlash: true
}));

Router.get('/', checkAuthenticated, (req, res) => {
   console.log(req.user);
   res.render('index.ejs', { name: req.user.name });
});

Router.delete('/logout', (req, res) => {
   req.logout((err) => {
      if (err) {
         console.error('Error during logout:', err);
         // Handle the error if needed
      }
      res.redirect('/login');
   });
});

module.exports = Router;
