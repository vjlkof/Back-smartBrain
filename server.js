import express, { json } from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';
import knex from 'knex';
import handleRegister from './controllers/register.js';
import handleSignin from './controllers/signin.js';
import handleProfileGet from './controllers/profile.js';
import {handleImage, handleApiCall} from './controllers/image.js';
/* import handleApiCall from './controllers/image.js'; */

const app=express();
const saltRounds = 10;

 const db = knex ({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'pos01',
    database : 'smart-brain'
  }
});
/* 
db.select('*').from('users').then(data =>{
  console.log(data);
}); */

app.use(express.json());
app.use(cors());

app.get('/',(req,res)=>{ res.send('success') })

app.post('/signin', (req,res) => { handleSignin(req, res, db, bcrypt) })
/* other way to do the above thing
app.post('/signin', handleSignin(req, res, db, bcrypt)) */

app.post('/register', (req, res) => { handleRegister(req, res, db, bcrypt,saltRounds) })

app.get('/profile/:id', (req, res) => { handleProfileGet(req, res, db) })

app.put('/image', (req,res) => { handleImage(req, res, db) })
app.post('/imageurl', (req,res) => { handleApiCall(req, res) })

app.listen(3001, ()=>{
  console.log('app is running on port 3001');
})



/*
/ --> res= this is working
/signin --> POST success or fail (because we are sending password)
/register --> POST = this is the new user object
/profile/:userId --> GET = user
/image --> PUT --> user updated
/
*/