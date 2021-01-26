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
  Player.find({userId:req.user._id}).then((players) => {
    if (players.length === 0) {
      const newPlayer = new Player({
        userId: req.user._id,
        name: req.user.name,
        money: 2500,
        location: 0,
      });
      newPlayer.save().then((player) => res.send(player));
    } else {
      res.send(players[0])
    }
  });
});

router.get("/startTurn", auth.ensureLoggedIn, (req, res) => {
  //get player
  Player.find({userId: req.user._id}).then((players) => {
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
          result.canBuy = true; //TODO player has enough money?
        } else if (dBSpace.ownerId !== req.user._id) {
          result.paidRent = true;
          //pay rent - update user money
          const s = board.spaces.find((staticS) => dBSpace.space_id === staticS._id); //js find
          const rent = dBSpace.numberOfBooths * s.rentPerBooth;
          player.money -= rent; //TODO player has enogh money
          //update owner money
          Player.find({userId: dBSpace.ownerId}).then((owners) => {
            const owner = owners[0]; //TODO check nonempty
            owner.money += rent;
            owner.save(); //TODO notify owner client
          });
        }
      } else {
        //space not found in database
        result.canBuy = true; //TODO player has enough money?
      }
      //update database
      player.save().then((player) => {
        result.player = player; //display player bank
        res.send(result)
      })
    }); //space.find.then
  }); //player.find.then
});

router.post("/endTurn", auth.ensureLoggedIn, (req, res) => {
  Player.find({userId: req.user._id}).then((players) => {
    const player = players[0];
    //handle buying property
    if (req.body.boughtProperty) { 
      //TODO check player has enough money
      const space = board.spaces.find((staticS) => player.location === staticS._id); //js find
      player.money -= space.cost;
      Space.find({space_id: space._id}).then((dBSpaces) => {
        if (dBSpaces.length > 0) {
          const dBSpace = dBSpaces[0];
          dBSpace.ownerId = player.userId;
          dBSpace.owner = player.name;
          dBSpace.numberOfBooths =1;
          dBSpace.save();
        } else {
          const newSpace = new Space({
            space_id: space._id,
            owner: player.name,
            ownerId: player.userId,
            numberOfBooths: 1,
          });
          newSpace.save();
        } //TODO turns
        player.save().then((p) => res.send(p));
      }); //space.find.then
    } else { ///if not bought property 
      res.send(player);
    }
  }); //player.find.then
  //increment turn
});//end of post

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});



module.exports = router;
