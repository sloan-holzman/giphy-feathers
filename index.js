const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const mongoose = require("./db/schema.js")
const cors = require('cors')
const Model = require("./db/schema").Gif;
// const socketio = require('@feathersjs/socketio');
const service = require('feathers-mongoose');
mongoose.Promise = global.Promise;


// This creates an app that is both, an Express and Feathers app
const app = express(feathers());

// Turn on JSON body parsing for REST services
app.use(express.json())
// Turn on URL-encoded body parsing for REST services
app.use(express.urlencoded({ extended: true }));
// Set up REST transport using Express
app.configure(express.rest());

// Set up an error handler that gives us nicer errors
app.use(express.errorHandler());

var corsOption = {
  // note to self: need to whitelist origins.  right now it is open to all
  origin: "*",
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
  // exposedHeaders: ['x-auth-token']
};

app.use(cors(corsOption));

// const mongoose = require('mongoose');
// const Model = require('./message-model');

// Connect to your MongoDB instance(s)
// mongoose.connect('mongodb://localhost:27017/feathers', {
//   useMongoClient: true
// });

// Enable Socket.io services
// app.configure(socketio());

const myService = {
  async find() {
    let foundGifs = await Model.find({}, function(err, gifs) {
      if (err) {
        return err
      } else {
        return gifs
      }
    })
    return foundGifs
  },
  async get(id, params) {},
  async create(data, params) {
    let revenueValue = await Model.findOne({
      'id': data.id
    }, function(err, gif) {
      if (!gif) {
        let newGif = new Model(data);
        newGif.save(function(error, saveGif) {
          if (error) {
            console.log("error!")
            return error;
          }
          console.log(saveGif)
          return saveGif;
        });
      } else {
        return gif
      }
    });
    console.log(returnValue)
    return {data: returnValue, status: 200}

  },
  async update(id, data, params) {},
  async patch(id, data, params) {},
  async remove(id, params) {
    console.log(id)
    let foundGif = await Model.remove({_id: id}, function(err, gif) {
      if (err) {
        return err
      } else {
        return gif
      }
    })
    return foundGif
  }
}

// testing replacement
// app.use('/gifs', myService)


// works - Connect to the db, create and register a Feathers service.
app.use('/gifs', service({
  Model,
  lean: true, // set to false if you want Mongoose documents returned
  // paginate: {
  //   default: 2,
  //   max: 4
  // }
}));

// a hook to capitalize the titles
app.service('/gifs').hooks({
  before: {
    create: async context => {
      let titleCopy = context.data.title
      context.data.title = titleCopy.toUpperCase()
      return context;
    }
  }
});


app.use(express.errorHandler());

// Create a dummy gif
// app.service('gifs').create({
//   title: 'excited andre 3000 GIF',
//   imgUrl: 'https://media0.giphy.com/media/Y9xWFbTw37F8Q/giphy-downsized.gif',
//   id: 'Y9xWFbTw37F8Q'
// }).then(function(gif) {
//   console.log('Created gif', gif);
// });

// Start the server.
const port = 3030;
app.listen(port, () => {
    console.log(`Feathers server listening on port ${port}`);
});
