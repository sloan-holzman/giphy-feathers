const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/giphy-db")

module.exports = mongoose
