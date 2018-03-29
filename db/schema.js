const mongoose = require('./connection')

const GifSchema = new mongoose.Schema({
	title: String,
	imgUrl: String,
  id: String
})

const Gif = mongoose.model('Gif', GifSchema)

module.exports = {
  Gif
}
