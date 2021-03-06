const handleRegister = (db, bcrypt) => (req, resp) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return resp.status(400).json('Incorrect register form submission !');
  }
  const hash = bcrypt.hashSync(password);
  db.transaction(trx => {
    trx.insert({
      hash: hash,
      email: email
    })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx('users')
          .returning('*')
          .insert({
            username: username,
            email: loginEmail[0],
            joined: new Date()
          })
          .then(user => {
            resp.json(user[0]);
          })
      })
      .then(trx.commit)
      .catch(trx.rollback)
  })
    .catch(err => resp.status(400).json('Unable to register...'))
}

module.exports = {
  handleRegister: handleRegister
}