const handleSignIn = (db, bcrypt) => (req, resp) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return resp.status(400).json('Incorrect sign in form submission !');
  }
  db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      const isSignInValid = bcrypt.compareSync(password, data[0].hash);
      if (isSignInValid) {
        return db.select('*').from('users')
          .where('email', '=', email)
          .then(user => {
            resp.json(user[0])
          })
          .catch(err => resp.status(400).json('Sorry, unable to get user...'))
      } else {
        resp.status(400).json('Sorry, wrong credentials...')
      }
    })
    .catch(err => resp.status(400).json('Sorry, wrong credentials...'))
}

module.exports = {
  handleSignIn: handleSignIn
}