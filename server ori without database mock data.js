import express, { json } from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';
import knex from 'knex';

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

db.select('*').from('users').then(data =>{
  console.log(data);
});

const database = {
  users:[
  {
    id:'123',
    name:'John',
    password:'cookies',
    email:'john@gmail.com',
    entries: 0,
    joined: new Date()
  },
  {
    id:'124',
    name:'Sally',
    password: 'bananas',
    email:'sally@gmail.com',
    entries: 0,
    joined: new Date()
  }
  ],
  login: [
    {
      id:'987',
      hash: '',
      email:'jonh@gmail.com'
    }
  ]
}

app.use(express.json());
app.use(cors());

app.get('/',(req,res)=>{
  res.send(database.users)
})

app.post('/signin', (req,res) =>{
  if (req.body.email === database.users[0].email && 
      req.body.password === database.users[0].password){
     res.json(database.users[0]);
  }else {
    res.status(400).json('error logging in');
  }  
})

app.post('/register', (req,res) =>{
  const {email, name, password} = req.body;
  bcrypt.hash(password, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    console.log(hash);
  });
  db('users').insert({
    email: email,
    name:name,
    joined: new Date()
  }). then(console.log)

  res.json(database.users[database.users.length - 1]) ; 
  res.status(200)
  
})

app.get('/profile/:id', (req,res) => {
  const {id} = req.params;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id){
      found=true;
      return res.json(user);
    }
  })
  if (!found){
      res.status(400).json('no such user')
  }
})

app.put('/image', (req,res) =>{
  const {id} = req.body;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id){
      found=true;
      user.entries++;
      console.log(user.entries)
      return res.json(user.entries);
    }
  })
  if (!found){
      res.status(400).json('no found')
  }
})

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