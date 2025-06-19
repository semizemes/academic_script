import express from "express";
import cors from "cors";
import env from 'dotenv';
import pg from "pg";
import bcrypt from "bcrypt";
import passport from "passport";
import {Strategy} from "passport-local";
import GoogleStrategy from "passport-google-oauth2";
import session from 'express-session';

env.config();


const app = express();
const port = 3001;
const saltRounds = 10;

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize);
app.use(passport.session);

const db = new pg.Client({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
});
db.connect();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3001/auth/google/callback',
    passReqToCallback: true
   },
   function (request, accessToken, refreshToken, profile, done) {

       return done(null, profile);
   }
));

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.get('/auth/google/callback',
    passport.authenticate('google', {scope: ['email', 'profile'] })
);

app.get('auth/google',
  passport.authenticate('google', {
      successRedirect: "http://localhost:5173/dashboard",
      failureRedirect: "http://localhost:5173/login"
  })
);

app.get('api/user', (req, res) => {
    if(req.isAuthenticated()) {
        res.json({authenticated: true, user: req.user});
    } else {
        res.json({authenticated: false});
    }
});

app.get('api/logout', (req, res) => {
    req.logout(function(err) {
        if(err) {return next(err); }
        res.redirect('http://localhost:5173/login');
    });
});

app.get('api/test', (req, res) => {
    console.log('hello')
    res.json({message: 'API is working'});
});

app.post('/api/login', (req, res) => {
    const {username, password} = req.body;

    res.json({succes: true, user: {email}});
})

app.listen(port, () => {
    console.log(`Server is running: http://localhost:${port}`);
})