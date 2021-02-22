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

//import from other files in server
const staticSpaces = require("./staticSpaces");
const logic = require("./logic");

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socketManager = require("./server-socket");
const { query } = require("express");
const space = require("./models/space");
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
const BANK = staticSpaces.BANK;

router.get("/board", (req, res) => {
  Space.find({}).then((dBSpaces) => {
    board.spaces.forEach((s) => {
      const dBSpace = dBSpaces.find((dBs) => dBs.space_id === s._id); //js find
      if (dBSpace) {
        s.owner = dBSpace.owner;
        s.ownerId = dBSpace.ownerId;
        s.numberOfBooths = dBSpace.numberOfBooths;
      }
    }); //TODO display who's on each space
    res.send(board.spaces);
  });
});

router.get("/testMove", (req, res) => {
  const loc = req.query.loc;
  const newL = logic.movePlayer(loc);
  console.log(JSON.stringify(newL));
  res.send(newL);
});

router.get("/player", auth.ensureLoggedIn, (req, res) => {
  logic.getPlayer(req.user._id, res);
});

router.get("/requestTurn", auth.ensureLoggedIn, (req,  res) => {
  logic.requestTurn(req.user._id, res);
 });

 router.get("/requestMoreTime", auth.ensureLoggedIn, (req,  res) => {
  logic.requestMoreTime(req.user._id, res);
 });

router.get("/startTurn", auth.ensureLoggedIn, (req, res) => {
  const userId = req.user._id;
  logic.startTurn(userId, res, false);
});

router.post("/endTurn", auth.ensureLoggedIn, (req, res) => {
 const userId = req.user._id;
 const boughtProperty = req.body.boughtProperty
 logic.endTurn(userId, res, boughtProperty, false);
});//end of post

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;

