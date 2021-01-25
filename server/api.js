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
const Player = require("./models/player");
const Space = require("./models/space");
const staticSpaces = require("./staticSpaces");

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socketManager = require("./server-socket");
const { query } = require("express");
//const { forEach } = require("core-js/fn/array");

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

const board = staticSpaces.board;
const player = {
  money: 2500,
  properties: [],
  location: 0,
};

router.get("/board", (req, res) => {
  Space.find({}).then((dBSpaces) => {
    board.spaces.forEach((s) => {
      const dBSpace = dBSpaces.find((dBs) => dBs._id === s._id);
      if (dBSpace) {
        s.owner = dBSpace.owner;
        s.numberOfBooths = dBSpace.numberOfBooths;
      }
    });
    res.send(board.spaces);
  });
});

router.get("/player", (req, res) => {
  Player.find({googleid:req.query.googleid}).then((players) => {
    if (players.length === 0) {
      const newPlayer = new Player({
        googleid: req.query.googleid,
        name: req.query.name,
        money: 2500,
        location: 0,
      });
      newPlayer.save().then((player) => res.send(player));
    } else {
      res.send(players[0])
    }
  });
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});



module.exports = router;
