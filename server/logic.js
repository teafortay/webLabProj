/*
game logic goes here
*/

const socketManager = require("./server-socket");
const Player = require("./models/player");
const Space = require("./models/space");

const staticSpaces = require("./staticSpaces");

const board = staticSpaces.board;
const BANK = staticSpaces.BANK;


const rollDice = () => {
    const rand = Math.random();
    const diceRoll = (Math.floor(rand * 11) + 2);

    return diceRoll;
  };

  const movePlayer =(playerLoc) => {
    let passGO = false;
    const diceRollResult = rollDice();
    let newLoc = Number(playerLoc) + diceRollResult;
    const boardLength = 40; //not dynamic
    if (newLoc >= boardLength) {
      newLoc -= boardLength;
      passGO = true;
    }
    return {
      newLoc: newLoc,
      dice: diceRollResult,
      passGO: passGO,
      canBuy: false,
      paidRent: false,
    };
  };

  const incrementTurn = () => {
    Player.find({}).then((players) => {
      for (let index = 0; index < players.length; index++) {
        const player = players[index];
        if (player.didStartTurn) {
          //player.isTurn = false;
          player.didStartTurn = false;
          player.save().then((player) => {
          
            let nextTurnIndex = index + 1;
            if (nextTurnIndex >= players.length) {
              nextTurnIndex = 0;
            }
            const nextPlayer = players[nextTurnIndex];
            nextPlayer.isTurn = true;
            nextPlayer.save().then((nextPlayer) => {
              socketManager.getIo().emit("newTurn", nextPlayer);
            });
          });
        } 
      }
    });
  };

  const startTurn = (userId, res) => {
    //get player
  Player.find({userId: userId}).then((players) => {
    const player = players[0]; //TODO handle empty 
    if (!player.isTurn || player.didStartTurn) {
      return res.status(401).send({ err: "not your turn" }); //works?
    }
    player.didStartTurn = true;
    const oldLoc = player.location;
    //roll dice, get new location- add GO money
    const result = movePlayer(oldLoc);
    player.location = result.newLoc;
    if (result.passGO) {
      player.money += 200;
    };
    //query database for new location space
    Space.find({space_id: result.newLoc}).then((dBSpaces) => {
      const s = board.spaces.find((staticS) => result.newLoc === staticS._id); //js find
      if (dBSpaces.length > 0) {
        const dBSpace = dBSpaces[0];
        if (dBSpace.owner === BANK && s.cost <= player.money) { //TODO recycling
          //buy
          result.canBuy = true; 
        } else if (dBSpace.ownerId !== req.user._id) {
          result.paidRent = true;
          //pay rent - update user money
          const rent = dBSpace.numberOfBooths * s.rentPerBooth;
          player.money -= rent; //TODO player has enogh money
          if (player.money <= 0) {
            //Player.deleteOne({userId: req.user._id}).then((p) => console.log("you ran out of money"));
          }
          //update owner money
          Player.find({userId: dBSpace.ownerId}).then((owners) => {
            if (owners) {
              const owner = owners[0]; 
            owner.money += rent;
            owner.save(); //TODO notify owner client
            }
            
          });
        }
      } else  if (s.canOwn && s.cost <= player.money) {
        //space not found in database
        result.canBuy = true; 
      }
      //update database
      player.save().then((player) => {
        result.player = player; //display player bank
        res.send(result);
      })
    }); //space.find.then
  }); //player.find.then
  };

  const endTurn = (userId, boughtProperty, res) => {
    //get player
  Player.find({userId: userId}).then((players) => {
    const player = players[0]; //TODO check nonempty?
    if (!player.isTurn) {
      return res.status(401).send({ err: "not your turn" });
    }
    if (!player.didStartTurn) {
      return res.status(401).send({ err: "Did not start turn" });
    }
    player.isTurn = false;
    //handle buying property
    const space = board.spaces.find((staticS) => player.location === staticS._id); //js find
      
    if (boughtProperty && space.canOwn && player.money >= space.cost) { 
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
        } //TODO turns DONE?
        player.save().then((p) => {
          res.send(p);
          incrementTurn();
        });
      }); //space.find.then
    } else { ///if not bought property 
      res.send(player);
      incrementTurn();
    }
  }); //player.find.then
  }
  const ghostMove = (playerObj) => {
    //roll dice, move player

    //pay rent

    //call endTurn(false)

    //penalize?

  };

module.exports = {
  startTurn,
  endTurn,
}