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
    });
    res.send(board.spaces);
  });
});

router.get("/testMove", (req, res) => {
  const loc = req.query.loc;
  const newL = logic.movePlayer(loc);
  console.log(JSON.stringify(newL));
  res.send(newL);
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

router.get("/startTurn", (req, res) => {
  //get player req.query.id
  Player.find({googleid: req.query.googleid}).then((players) => {
    const player = players[0]; //TODO handle empty 
    const oldLoc = player.location;
    //roll dice, get new location- add GO money
    const result = logic.movePlayer(oldLoc);
    player.location = result.newLoc;
    if (result.passGO) {
      player.money += 200;
    };
    //query database for new location space
    Space.find({space_id: result.newLoc}).then((dBSpaces) => {
      if (dBSpaces.length > 0) {
        const dBSpace = dBSpaces[0];
        if (dBSpace.owner === BANK) {
          //buy
          result.canBuy = true;
        } else if (dBSpace.ownerId !== req.query.googleid) {
          result.paidRent = true;
          //pay rent - update user money, update owner money
          const s = board.spaces.find((staticS) => dBSpace.space_id === staticS._id); //js find
          const rent = dBSpace.numberOfBooths * s.rentPerBooth;
          player.money -= rent;
          //TODO update owner money
        }
      } else {
        //space not found in database
        result.canBuy = true;
      }
      //update database
      player.save().then((player) => {
        result.player = player;
        res.send(result)
      })
    }); //space.find.then
  }); //player.find.then
});

router.post("/endTurn", (req, res) => {
  //if req.body.buyProperty {
    const player = req.body.playerObj;
    const space = req.body.spaceObj;
    if (req.body.boughtPropertu) {
      player.money -= space.cost;
      space.numberOfBooths += 1;
    };
    //update database
    turnIndex += 1;
    //update space.owner, decrement player.money
  //}
  //increment turn
  //res.send(player)
})

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});



module.exports = router;
