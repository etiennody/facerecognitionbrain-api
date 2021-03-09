const handleSignIn = (db, bcrypt) => (req, resp) => {
    db.select('email', 'hash').from('login')
        .where('email', '=', req.body.email)
        .then(data => {
            const isSignInValid = bcrypt.compareSync(req.body.password, data[0].hash);
            if (isSignInValid) {
                return db.select('*').from('users')
                    .where('email', '=', req.body.email)
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