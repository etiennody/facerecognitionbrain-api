const Clarifai = require('clarifai');

const app = new Clarifai.App({
  apiKey: process.env.REACT_APP_CLARIFAI_API_KEY
});

const handleClarifaiApiCall = (req, resp) => {
  const { input } = req.body;
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, input)
    .then(data => {
      resp.json(data);
    })
    .catch(err => resp.status(400).json('Sorry, unable to work with Clarifai API...'))
}

const handleImage = (req, resp, db) => {
  const { id } = req.body;
  db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      resp.json(entries[0]);
    })
    .catch(err => resp.status(400).json('Unable to get entries...'))
}

module.exports = {
  handleImage,
  handleClarifaiApiCall
}