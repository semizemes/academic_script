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

app.use(express.json());
app.use(cors());

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