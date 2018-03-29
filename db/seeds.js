const Gif = require("./schema").Gif;


Gif.remove({})
  .then(() => {
    console.log("Gifs removed successfully!");
    process.exit()
  })
