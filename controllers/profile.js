const handleUserProfile = (req, resp, db) => {
  const { id } = req.params;
  db.select('*').from('users').where({ id })
    .then(user => {
      if (user.length) {
        resp.json(user[0]);
      } else {
        resp.status(400).json('Profile not found...');
      }
    })
    .catch(err => resp.status(400).json('Error getting user...'))
}

module.exports = {
  handleUserProfile: handleUserProfile
}