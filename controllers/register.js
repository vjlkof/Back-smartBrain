const handleRegister = (req,res,db, bcrypt,saltRounds) => {
  const {email, name, password} = req.body;
  if (!email || !name || !password){
    return res.status(400).json('incorrect form submission');
  }
  /*we ara usinc sync bcrypt for now*/
  const hash = bcrypt.hashSync(password, saltRounds);
  db.transaction(trx =>{
    trx.insert({
      hash: hash,
      email:email
    })
    .into ('login')
    .returning('email')
    .then(loginEmail=> {
      trx('users')
      .returning('*')
      .insert({
        email: loginEmail[0],
        name:name,
        joined: new Date()
      })
      .then(user => {
        res.json(user[0]); 
      })
    })
    .then(trx.commit)
    .catch(trx.rollback)
  })
    .catch(err => res.status(400).json("unavailable to register"))
   /* this a cool way to show in the console the result of a promise
  }). then(console.log) */
}

export default handleRegister;