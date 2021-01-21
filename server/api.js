/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

const express = require("express");

// import models so we can interact with the database
const User = require("./models/user");

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socketManager = require("./server-socket");

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }

  res.send(req.user);
});

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user) socketManager.addUser(req.user, socketManager.getSocketFromSocketID(req.body.socketid));
  res.send({});
});

// |------------------------------|
// | write your API methods below!|
// |------------------------------|

const board = {
  spaces: [
    {
      _id: 0,
      name: "GO",
      canOwn: false,
    }, {
      _id: 1,
      name: "Edgerton House",
      canOwn: true,
      owner: "MIT",
      pricePerBooth: 50,
      rentPerBooth: 5,
      numberOfBooths: 0,
      color: "Purple",
    }, {
      _id: 2,
      name: "WILG",
      canOwn: true,
      owner: "MIT",
      pricePerBooth: 50,
      rentPerBooth: 5,
      numberOfBooths: 0,
      color: "Purple",
    }, {
      _id: 3,
      name: "Next House",
      canOwn: true,
      owner: "MIT",
      pricePerBooth: 75,
      rentPerBooth: 10,
      numberOfBooths: 0,
      color: "LightBlue",
    }, {
      _id: 4,
      name: "New House",
      canOwn: true,
      owner: "MIT",
      pricePerBooth: 75,
      rentPerBooth: 10,
      numberOfBooths: 0,
      color: "LightBlue",
    }, {
      _id: 5,
      name: "Student Center",
      canOwn: true,
      owner: "Taylor Shaw",
      pricePerBooth: 100,
      rentPerBooth: 10,
      numberOfBooths: 1,
      color: "orange",
    }, {
      _id: 6,
      name: "Senior House",
      canOwn: true,
      owner: "Sara Falcone",
      pricePerBooth: 125,
      rentPerBooth: 15,
      numberOfBooths: 1,
      color: "green",
    }, {
      _id: 7,
      name: "Lobby 10",
      canOwn: true,
      owner: "MIT",
      pricePerBooth: 150,
      rentPerBooth: 15,
      numberOfBooths: 0,
      color: "blue",
    }
  ]
};

router.get("/board", (req, res) => {
  res.send(board.spaces);
});
// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
